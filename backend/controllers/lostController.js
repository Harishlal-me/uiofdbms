
const db = require('../config/db');

// Create Lost Report
exports.createLostReport = async (req, res) => {
    try {
        console.log('=== CREATE LOST REPORT REQUEST ===');
        console.log('User:', req.user);
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { item_name, category_id, location_id, description, lost_date, color, specific_location, ra_reg_no, contact_phone } = req.body;

        // Validate required fields
        if (!item_name || !description || !lost_date) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['item_name', 'description', 'lost_date']
            });
        }

        const user_id = req.user?.id;
        if (!user_id) {
            console.error('User ID not found in request');
            return res.status(401).json({ message: 'Authentication required' });
        }

        let photo_url = null;
        if (req.file) {
            photo_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        console.log('DEBUG: Creating Lost Report');
        console.log('Values:', { user_id, item_name, category_id, location_id, description, lost_date, color, photo_url, specific_location });

        const params = [
            user_id,
            item_name,
            category_id === undefined ? null : category_id,
            location_id === undefined ? null : location_id,
            description,
            lost_date,
            color === undefined ? null : color,
            photo_url,
            specific_location === undefined ? null : specific_location
        ];

        console.log('DEBUG: DB Params:', params);

        const [result] = await db.execute(
            'INSERT INTO LostReports (user_id, item_name, category_id, location_id, description, lost_date, color, photo_url, status, specific_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Pending", ?)',
            params
        );

        const lostId = result.insertId;
        console.log('✅ Lost report created with ID:', lostId);

        // --- AUTO-MATCH LOGIC (Text-Based) ---
        try {
            const [candidates] = await db.execute(`
                SELECT * FROM FoundReports 
                WHERE status = 'Pending'
            `);

            // Helper: Calculate Text Similarity (0-100)
            const calculateSimilarity = (str1, str2) => {
                if (!str1 || !str2) return 0;
                const clean = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
                const s1 = clean(str1);
                const s2 = clean(str2);

                const words1 = new Set(s1.split(' '));
                const words2 = new Set(s2.split(' '));

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
                        [lostId, candidate.found_id, score, 'Pending']
                    );
                    console.log(`Match created: Lost ${lostId} <-> Found ${candidate.found_id} (${score}%)`);
                }
            }
        } catch (matchError) {
            console.error('Auto-match error (non-critical):', matchError);
            // Don't fail the request if matching fails
        }

        res.status(201).json({
            message: 'Lost report submitted successfully',
            lost_id: lostId
        });

    } catch (error) {
        console.error('❌ CREATE LOST REPORT ERROR:');
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

// Get All Lost Reports
exports.getAllLostReports = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT l.*, u.name as user_name, c.category_name, loc.area_name as location_name
            FROM LostReports l
            LEFT JOIN Users u ON l.user_id = u.user_id
            LEFT JOIN Categories c ON l.category_id = c.category_id
            LEFT JOIN Locations loc ON l.location_id = loc.location_id
            ORDER BY l.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Get All Lost Reports Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get User's Lost Reports
exports.getUserLostReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(`
            SELECT l.*, c.category_name, loc.area_name as location_name
            FROM LostReports l
            LEFT JOIN Categories c ON l.category_id = c.category_id
            LEFT JOIN Locations loc ON l.location_id = loc.location_id
            WHERE l.user_id = ?
            ORDER BY l.created_at DESC
        `, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Get User Lost Reports Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get Single Lost Report
exports.getLostReportById = async (req, res) => {
    try {
        const [reports] = await db.execute('SELECT * FROM LostReports WHERE lost_id = ?', [req.params.id]);
        if (reports.length === 0) return res.status(404).json({ message: 'Report not found' });
        res.json(reports[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
