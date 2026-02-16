const db = require('../config/db');

// Create Found Report
exports.createFoundReport = async (req, res) => {
    try {
        console.log('=== CREATE FOUND REPORT REQUEST ===');
        console.log('User:', req.user);
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { item_name, category_id, location_id, description, found_date, color, storage_location_id, specific_location } = req.body;

        // Validate required fields
        if (!item_name || !description || !found_date) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['item_name', 'description', 'found_date']
            });
        }

        const user_id = req.user?.id;
        if (!user_id) {
            console.error('User ID not found in request');
            return res.status(401).json({ message: 'Authentication required' });
        }

        let found_photo_url = null;
        if (req.file) {
            found_photo_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const [result] = await db.execute(
            'INSERT INTO FoundReports (user_id, item_name, category_id, location_id, description, found_date, color, found_photo_url, status, storage_location_id, specific_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Pending", ?, ?)',
            [
                user_id,
                item_name,
                category_id === undefined ? null : category_id,
                location_id === undefined ? null : location_id,
                description,
                found_date,
                color === undefined ? null : color,
                found_photo_url,
                storage_location_id === undefined ? null : storage_location_id,
                specific_location === undefined ? null : specific_location
            ]
        );

        const foundId = result.insertId;
        console.log('✅ Found report created with ID:', foundId);

        // --- AUTO-MATCH LOGIC (Text-Based) ---
        let matchCount = 0;
        try {
            const [candidates] = await db.execute(`
                SELECT * FROM LostReports 
                WHERE status = 'Pending'
            `);

            // Helper: Calculate Text Similarity (0-100)
            const calculateSimilarity = (str1, str2) => {
                if (!str1 || !str2) return 0;

                // 1. Normalize
                const clean = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
                const s1 = clean(str1);
                const s2 = clean(str2);

                // 2. Tokenize
                const words1 = new Set(s1.split(' '));
                const words2 = new Set(s2.split(' '));

                // 3. Calculate Jaccard
                const intersection = new Set([...words1].filter(x => words2.has(x)));
                const union = new Set([...words1, ...words2]);

                const jaccardIndex = (intersection.size / union.size) * 100;

                // BOOST: If Jaccard > 10, add 50 (max 95)
                let score = jaccardIndex;
                if (jaccardIndex > 10) {
                    score = Math.min(jaccardIndex + 50, 95);
                }

                return Math.round(score);
            };

            for (const candidate of candidates) {
                const score = calculateSimilarity(description, candidate.description);

                if (score >= 40) {
                    await db.execute(
                        'INSERT INTO Matches (lost_id, found_id, confidence_score, match_status) VALUES (?, ?, ?, ?)',
                        [candidate.lost_id, foundId, score, 'Pending']
                    );
                    matchCount++;
                    console.log(`Match created: Lost ${candidate.lost_id} <-> Found ${foundId} (${score}%)`);
                }
            }
        } catch (matchError) {
            console.error('Auto-match error (non-critical):', matchError);
            // Don't fail the request if matching fails
        }

        res.status(201).json({
            message: 'Found report submitted successfully',
            found_id: foundId,
            matches_created: matchCount
        });

    } catch (error) {
        console.error('❌ CREATE FOUND REPORT ERROR:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('SQL State:', error.sqlState);
        console.error('SQL Message:', error.sqlMessage);

        // Send user-friendly error message
        res.status(500).json({
            message: 'Failed to submit report. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};

// Get All Found Reports
exports.getAllFoundReports = async (req, res) => {
    try {
        const [reports] = await db.execute(`
            SELECT 
                r.*, 
                c.category_name, 
                l.area_name as location_name 
            FROM FoundReports r
            JOIN Categories c ON r.category_id = c.category_id
            JOIN Locations l ON r.location_id = l.location_id
            ORDER BY r.created_at DESC
        `);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get Single Found Report
exports.getFoundReportById = async (req, res) => {
    try {
        const [reports] = await db.execute('SELECT * FROM FoundReports WHERE found_id = ?', [req.params.id]);
        if (reports.length === 0) return res.status(404).json({ message: 'Report not found' });
        res.json(reports[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
