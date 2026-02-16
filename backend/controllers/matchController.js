
const db = require('../config/db');

// Get All Matches
// Get All Matches
exports.getAllMatches = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                m.match_id, m.confidence_score, m.match_status, m.created_at,
                
                l.item_name as lost_name, l.description as lost_desc, l.lost_date, l.photo_url as lost_img, l.specific_location as lost_specific_loc,
                l.user_id as lost_user_id, u_l.name as lost_user_name, l.status as lost_status,
                loc_l.area_name as lost_loc_name,
                
                f.item_name as found_name, f.description as found_desc, f.found_date, f.found_photo_url as found_img, f.specific_location as found_specific_loc,
                f.user_id as found_user_id, u_f.name as found_user_name, f.status as found_status,
                loc_f.area_name as found_loc_name,
                
                sl.room_name as storage_loc
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            LEFT JOIN Locations loc_l ON l.location_id = loc_l.location_id
            LEFT JOIN Users u_l ON l.user_id = u_l.user_id
            
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN Locations loc_f ON f.location_id = loc_f.location_id
            LEFT JOIN Users u_f ON f.user_id = u_f.user_id
            
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            ORDER BY m.created_at DESC
        `);

        // Transform to frontend structure
        const matches = rows.map(row => ({
            id: row.match_id,
            confidence: row.confidence_score,
            status: row.match_status,
            lost: {
                name: row.lost_name,
                desc: row.lost_desc,
                date: row.lost_date,
                img: row.lost_img || 'https://placehold.co/400x300?text=No+Image',
                user: row.lost_user_name || 'Unknown User',
                loc: row.lost_specific_loc || row.lost_loc_name || 'Unknown',
                status: row.lost_status
            },
            found: {
                name: row.found_name,
                desc: row.found_desc,
                date: row.found_date,
                img: row.found_img || 'https://placehold.co/400x300?text=No+Image',
                user: row.found_user_name || 'Unknown User',
                loc: row.found_specific_loc || row.found_loc_name || 'Unknown',
                storage_kept: row.storage_loc || 'Not Stored Yet',
                status: row.found_status
            },
            reasons: [
                { text: `System Confidence Score: ${row.confidence_score}%`, score: row.confidence_score }
            ]
        }));

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Verify Match (Admin Action)
// Verify Match (Admin Action) - Uses Transaction
exports.verifyMatch = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { admin_id, action, notes } = req.body; // action: 'approve' or 'reject'

        const status = action === 'approve' ? 'Verified' : 'Rejected';
        const adminVerified = action === 'approve' ? 1 : 0;

        // 1. Update Match Status
        await connection.execute(
            'UPDATE Matches SET match_status = ?, admin_verified = ?, admin_id = ?, verification_notes = ?, verified_at = NOW() WHERE match_id = ?',
            [status, adminVerified, admin_id, notes, id]
        );

        // 2. If Approved, Award Credits & Notify Users & Update Report Status
        if (action === 'approve') {
            // Get Match Details (Lost/Found IDs)
            const [matchRows] = await connection.execute('SELECT lost_id, found_id FROM Matches WHERE match_id = ?', [id]);

            if (matchRows.length > 0) {
                const { lost_id, found_id } = matchRows[0];

                // Update Report Statuses to 'Resolved'
                await connection.execute('UPDATE LostReports SET status = "Resolved" WHERE lost_id = ?', [lost_id]);
                await connection.execute('UPDATE FoundReports SET status = "Resolved" WHERE found_id = ?', [found_id]);

                // Get User IDs and Item Details + Storage Location
                const [foundRows] = await connection.execute(`
                    SELECT f.user_id, f.item_name, f.contact_phone, f.ra_reg_no, f.description, 
                           sl.room_name as storage_loc, loc.area_name as found_loc_name, u.name as finder_name
                    FROM FoundReports f
                    LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
                    LEFT JOIN Locations loc ON f.location_id = loc.location_id
                    LEFT JOIN Users u ON f.user_id = u.user_id
                    WHERE f.found_id = ?
                `, [found_id]);

                const [lostRows] = await connection.execute(`
                    SELECT l.user_id, l.item_name, l.contact_phone, l.ra_reg_no, l.description, u.name as loser_name
                    FROM LostReports l
                    LEFT JOIN Users u ON l.user_id = u.user_id
                    WHERE l.lost_id = ?
                `, [lost_id]);

                const loser = lostRows[0];
                const finder = foundRows[0];

                const storageInfo = finder.storage_loc ? ` at ${finder.storage_loc}` : '';

                // A. Notify Finder (Credits moved to Resolution)
                if (finder && finder.user_id) {
                    // REMOVED_CREDITS: await connection.execute('UPDATE Users SET cs_credits = cs_credits + 50 WHERE user_id = ?', [finder.user_id]);

                    // B. Notify Finder
                    const loserName = loser.loser_name ? ` (${loser.loser_name})` : '';
                    const message = `Match Verified! Your found item "${finder.item_name}" has been matched with "${loser.item_name}" reported by Owner${loserName}. Please return item.`;

                    await connection.execute(
                        'INSERT INTO Notifications (user_id, match_id, message, type) VALUES (?, ?, ?, ?)',
                        [finder.user_id, id, message, 'success']
                    );
                }

                // C. Notify Loser (Credits moved to Resolution)
                if (loser && loser.user_id) {
                    // REMOVED_CREDITS: await connection.execute('UPDATE Users SET cs_credits = cs_credits + 10 WHERE user_id = ?', [loser.user_id]);

                    const finderName = finder.finder_name ? ` by ${finder.finder_name}` : '';
                    const message = `Great news! Your lost item "${loser.item_name}" has been found${finderName}${storageInfo}. Please proceed to verification/retrieval.`;

                    await connection.execute(
                        'INSERT INTO Notifications (user_id, match_id, message, type) VALUES (?, ?, ?, ?)',
                        [loser.user_id, id, message, 'success'] // Changed type to success for visibility
                    );
                }
            }
        }

        await connection.commit();

        res.json({ message: `Match ${status} successfully` });

    } catch (error) {
        await connection.rollback();
        console.error("Transaction Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    } finally {
        connection.release();
    }
};

// Get User Matches (Verified only, where user is owner or finder)
exports.getUserMatches = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.execute(`
            SELECT 
                m.match_id, m.confidence_score, m.match_status, m.created_at, m.admin_verified, m.verified_at,
                
                l.item_name as lost_name, l.description as lost_desc, l.lost_date, l.photo_url as lost_img,
                l.user_id as lost_user_id, u_l.name as lost_user_name,
                
                f.item_name as found_name, f.description as found_desc, f.found_date, f.found_photo_url as found_img,
                f.user_id as found_user_id, u_f.name as found_user_name,
                
                sl.room_name as storage_loc
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            LEFT JOIN Users u_l ON l.user_id = u_l.user_id
            
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN Users u_f ON f.user_id = u_f.user_id
            
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            
            WHERE (m.match_status = 'Verified' OR m.admin_verified = 1)
            AND (l.user_id = ? OR f.user_id = ?)
            ORDER BY m.verified_at DESC, m.created_at DESC
        `, [userId, userId]);

        const matches = rows.map(row => ({
            id: row.match_id,
            status: row.match_status,
            role: row.lost_user_id === userId ? 'loser' : 'finder',
            lost: {
                name: row.lost_name,
                desc: row.lost_desc,
                date: row.lost_date,
                img: row.lost_img,
                user: row.lost_user_name
            },
            found: {
                name: row.found_name,
                desc: row.found_desc,
                date: row.found_date,
                img: row.found_img,
                user: row.found_user_name,
                storage: row.storage_loc || 'Central Storage'
            },
            verified_at: row.verified_at
        }));

        res.json(matches);
    } catch (error) {
        console.error("Get User Matches Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get Single Match by ID (for claim page)
exports.getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [rows] = await db.execute(`
            SELECT 
                m.match_id, m.confidence_score, m.match_status, m.created_at, m.admin_verified, m.verified_at,
                
                l.item_name as lost_name, l.description as lost_desc, l.lost_date, l.photo_url as lost_img,
                l.user_id as lost_user_id, u_l.name as lost_user_name,
                
                f.item_name as found_name, f.description as found_desc, f.found_date, f.found_photo_url as found_img,
                f.user_id as found_user_id, u_f.name as found_user_name,
                
                sl.room_name as storage_loc
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            LEFT JOIN Users u_l ON l.user_id = u_l.user_id
            
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN Users u_f ON f.user_id = u_f.user_id
            
            LEFT JOIN StorageLocations sl ON f.storage_location_id = sl.storage_id
            
            WHERE m.match_id = ?
            AND (l.user_id = ? OR f.user_id = ?)
        `, [id, userId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Match not found or you do not have permission to view it' });
        }

        const row = rows[0];
        const match = {
            id: row.match_id,
            status: row.match_status,
            role: row.lost_user_id === userId ? 'loser' : 'finder',
            lost: {
                name: row.lost_name,
                desc: row.lost_desc,
                date: row.lost_date,
                img: row.lost_img,
                user: row.lost_user_name
            },
            found: {
                name: row.found_name,
                desc: row.found_desc,
                date: row.found_date,
                img: row.found_img,
                user: row.found_user_name,
                storage: row.storage_loc || 'Central Storage'
            },
            verified_at: row.verified_at
        };

        res.json(match);
    } catch (error) {
        console.error("Get Match By ID Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
