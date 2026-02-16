const db = require('../config/db');

// Create a new claim
exports.createClaim = async (req, res) => {
    try {
        console.log('=== CLAIM SUBMISSION BACKEND ===');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        const { match_id, proof_description } = req.body;
        const proof_photo_url = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('Parsed values:');
        console.log('  match_id:', match_id);
        console.log('  proof_description:', proof_description);
        console.log('  proof_photo_url:', proof_photo_url);

        // Validate match_id
        if (!match_id) {
            console.error('Validation failed: match_id is missing');
            return res.status(400).json({ message: 'Match ID is required' });
        }

        if (!proof_description || proof_description.trim() === '') {
            console.error('Validation failed: proof_description is missing');
            return res.status(400).json({ message: 'Proof description is required' });
        }

        // Check if match exists
        console.log('Checking if match exists...');
        const [match] = await db.execute('SELECT * FROM Matches WHERE match_id = ?', [match_id]);
        if (match.length === 0) {
            console.error('Match not found:', match_id);
            return res.status(404).json({ message: 'Match not found' });
        }
        console.log('Match found:', match[0].match_id);

        // Get the lost_id and found_id from the match
        const lost_id = match[0].lost_id;
        const found_id = match[0].found_id;
        console.log('Lost ID:', lost_id);
        console.log('Found ID:', found_id);

        // Verify that the user claiming is the owner of the lost item
        console.log('Verifying ownership...');
        const [lostReport] = await db.execute('SELECT user_id FROM LostReports WHERE lost_id = ?', [lost_id]);
        if (lostReport.length === 0) {
            console.error('Lost report not found for lost_id:', lost_id);
            return res.status(404).json({ message: 'Lost report not found' });
        }

        const claimed_by = req.user.id;
        console.log('Claimed by:', claimed_by, 'Owner:', lostReport[0].user_id);

        if (lostReport[0].user_id !== claimed_by) {
            console.error('Authorization failed: user is not the owner');
            return res.status(403).json({ message: 'You are not authorized to claim this item. Only the owner can claim.' });
        }

        // Check if claim already exists
        console.log('Checking for existing claim...');
        const [existingClaim] = await db.execute('SELECT * FROM ItemClaims WHERE match_id = ?', [match_id]);
        if (existingClaim.length > 0) {
            console.error('Claim already exists for match_id:', match_id);
            return res.status(400).json({ message: 'This match has already been claimed' });
        }

        // Insert claim with correct column names matching database schema
        console.log('Inserting claim into database...');
        const [result] = await db.execute(
            'INSERT INTO ItemClaims (match_id, found_id, claimed_by, claim_date, proof_description, proof_photo_url, claim_status) VALUES (?, ?, ?, NOW(), ?, ?, ?)',
            [match_id, found_id, claimed_by, proof_description, proof_photo_url, 'Pending']
        );

        console.log('✅ Claim created successfully! ID:', result.insertId);

        res.status(201).json({
            message: 'Claim submitted successfully',
            claim_id: result.insertId
        });
    } catch (error) {
        console.error("❌ Create Claim Error:");
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('SQL State:', error.sqlState);
        console.error('SQL Message:', error.sqlMessage);

        res.status(400).json({
            message: error.sqlMessage || error.message
        });
    }
};

// Create Condition Report (Admin verifies collection)
exports.createConditionReport = async (req, res) => {
    try {
        const { match_id, damage_found, damage_notes } = req.body;

        console.log('=== CREATE CONDITION REPORT ===');
        console.log('req.user:', req.user);
        console.log('req.user.id:', req.user?.id);
        console.log('match_id:', match_id);
        console.log('damage_found:', damage_found);

        const verified_by = req.user.id; // Admin ID

        if (!verified_by) {
            console.error('❌ verified_by is undefined! req.user:', req.user);
            return res.status(401).json({ message: 'User authentication failed. Please log in again.' });
        }

        console.log('verified_by (admin ID):', verified_by);

        // Get claim details including owner's pickup photo
        const [claim] = await db.execute(
            'SELECT claimed_by, proof_photo_url FROM ItemClaims WHERE match_id = ?',
            [match_id]
        );

        if (claim.length === 0) {
            return res.status(404).json({ message: 'No active claim for this match' });
        }

        const collected_by = claim[0].claimed_by;
        const collection_photo_url = claim[0].proof_photo_url; // Use existing owner pickup photo

        // Get match details to update related reports and get finder info
        const [match] = await db.execute(`
            SELECT m.lost_id, m.found_id, f.user_id as finder_id, f.storage_location_id
            FROM Matches m
            JOIN FoundReports f ON m.found_id = f.found_id
            WHERE m.match_id = ?
        `, [match_id]);

        if (match.length === 0) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const { lost_id, found_id, finder_id, storage_location_id } = match[0];

        // Prepare damage notes
        const finalDamageNotes = damage_found
            ? (damage_notes || "Damage detected during verification")
            : null;

        // --- AWARD CREDITS TO FINDER ONLY (Per User Requirement) ---
        // Ensure not already resolved to prevent duplicates
        const [matchCheck] = await db.execute('SELECT match_status FROM Matches WHERE match_id = ?', [match_id]);
        if (matchCheck[0].match_status !== 'Resolved') {
            if (finder_id) {
                await db.execute('UPDATE Users SET cs_credits = cs_credits + 50 WHERE user_id = ?', [finder_id]);
                console.log(`✅ Awarded +50 credits to Finder (ID: ${finder_id})`);

                // Send credit notification to finder
                await db.execute(
                    'INSERT INTO Notifications (user_id, match_id, message, type) VALUES (?, ?, ?, ?)',
                    [finder_id, match_id, 'You earned +50 CS Credits for successfully returning a lost item!', 'credit_earned']
                );
            }
        } else {
            console.log('⚠️ Match already resolved, skipping credit award.');
        }

        // Insert Condition Report using existing owner pickup photo
        const [result] = await db.execute(
            'INSERT INTO ItemConditionReport (match_id, collection_photo_url, collected_by, collection_date, damage_found, damage_notes, verified_by) VALUES (?, ?, ?, NOW(), ?, ?, ?)',
            [match_id, collection_photo_url, collected_by, damage_found ? 1 : 0, finalDamageNotes, verified_by]
        );

        // Update claim status to 'Collected'
        await db.execute('UPDATE ItemClaims SET claim_status = ? WHERE match_id = ?', ['Collected', match_id]);

        // Mark all related records as Resolved
        await db.execute('UPDATE Matches SET match_status = ? WHERE match_id = ?', ['Resolved', match_id]);
        await db.execute('UPDATE LostReports SET status = ? WHERE lost_id = ?', ['Resolved', lost_id]);
        await db.execute('UPDATE FoundReports SET status = ? WHERE found_id = ?', ['Resolved', found_id]);

        console.log(`✅ Collection verified for match ${match_id}. All records marked as Resolved.`);

        // If damage was detected, send notification to FINDER
        if (damage_found) {
            const notificationMessage = "Damage was detected during collection verification. Please contact the admin regarding this case.";

            await db.execute(
                'INSERT INTO Notifications (user_id, match_id, message, type) VALUES (?, ?, ?, ?)',
                [finder_id, match_id, notificationMessage, 'damage_alert']
            );

            console.log(`📧 Damage notification sent to finder (user_id: ${finder_id})`);

            // Optional: Increment damage counter for storage location analytics
            if (storage_location_id) {
                await db.execute(
                    'UPDATE StorageLocations SET damage_incidents = COALESCE(damage_incidents, 0) + 1 WHERE storage_id = ?',
                    [storage_location_id]
                );
                console.log(`📊 Damage incident counter incremented for storage_id: ${storage_location_id}`);
            }
        }

        res.status(201).json({
            message: 'Collection verified successfully. Case closed.',
            report_id: result.insertId,
            damage_notification_sent: damage_found
        });
    } catch (error) {
        console.error("Create Condition Report Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get claim by match ID with complete details including both photos
exports.getClaimByMatch = async (req, res) => {
    try {
        const { matchId } = req.params;

        const [claims] = await db.execute(`
            SELECT 
                ic.claim_id, ic.match_id, ic.claimed_by, ic.claim_date,
                ic.proof_description, ic.proof_photo_url as owner_collection_photo,
                ic.claim_status,
                u.name as claimer_name, u.email as claimer_email,
                m.confidence_score,
                l.item_name as lost_item_name, l.description as lost_item_desc,
                f.item_name as found_item_name, f.description as found_item_desc,
                f.found_photo_url as finder_photo,
                sl.room_name as storage_location
            FROM ItemClaims ic
            JOIN Users u ON ic.claimed_by = u.user_id
            JOIN Matches m ON ic.match_id = m.match_id
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            WHERE ic.match_id = ?
        `, [matchId]);

        if (claims.length === 0) {
            return res.status(404).json({ message: 'No claim found for this match' });
        }

        res.json(claims[0]);
    } catch (error) {
        console.error("Get Claim By Match Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all claims (Admin)
exports.getAllClaims = async (req, res) => {
    try {
        const [claims] = await db.execute(`
            SELECT 
                ic.claim_id, ic.match_id, ic.claimed_by, ic.proof_description, ic.proof_photo_url,
                ic.claim_status, ic.claimed_at,
                u.name as claimer_name, u.email as claimer_email,
                m.match_id, m.confidence_score,
                l.item_name as lost_item, l.photo_url as lost_photo,
                f.item_name as found_item, f.found_photo_url as found_photo,
                sl.room_name as storage_location
            FROM ItemClaims ic
            JOIN Users u ON ic.claimed_by = u.user_id
            JOIN Matches m ON ic.match_id = m.match_id
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            ORDER BY ic.claimed_at DESC
        `);

        res.json(claims);
    } catch (error) {
        console.error("Get All Claims Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
