const db = require('./config/db');

async function fixData() {
    console.log("Starting Data Fix...");
    try {
        // 1. Recalculate Confidence Scores
        console.log("Recalculating Confidence Scores...");
        const [matches] = await db.execute(`
            SELECT m.match_id, 
                   l.item_name as l_name, l.description as l_desc, l.color as l_color,
                   f.item_name as f_name, f.description as f_desc, f.color as f_color
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
        `);

        for (const m of matches) {
            const lostText = `${m.l_name} ${m.l_desc} ${m.l_color || ''}`;
            const foundText = `${m.f_name} ${m.f_desc} ${m.f_color || ''}`;
            const score = calculateSimilarity(lostText, foundText);

            console.log(`Match #${m.match_id}: ${score}% (was existing)`);
            await db.execute('UPDATE Matches SET confidence_score = ? WHERE match_id = ?', [score, m.match_id]);
        }

        // 2. Fix Report Statuses
        console.log("Fixing Report Statuses...");

        // Resolve LostReports for Verified Matches
        await db.execute(`
            UPDATE LostReports l 
            JOIN Matches m ON l.lost_id = m.lost_id 
            SET l.status = 'Resolved' 
            WHERE m.match_status = 'Verified' OR m.match_status = 'Resolved'
        `);

        // Resolve FoundReports for Verified Matches
        await db.execute(`
            UPDATE FoundReports f 
            JOIN Matches m ON f.found_id = m.found_id 
            SET f.status = 'Resolved' 
            WHERE m.match_status = 'Verified' OR m.match_status = 'Resolved'
        `);

        console.log("Data Fix Complete!");
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

// Helper: Calculate Text Similarity (0-100) - Same as in controllers
const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;

    // 1. Normalize
    const clean = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    const s1 = clean(str1);
    const s2 = clean(str2);

    // 2. Tokenize
    const words1 = new Set(s1.split(' ').filter(w => w.length > 2)); // Filter small words
    const words2 = new Set(s2.split(' ').filter(w => w.length > 2));

    if (words1.size === 0 || words2.size === 0) return 0;

    // 3. Intersection
    let common = 0;
    words1.forEach(w => { if (words2.has(w)) common++; });

    // 4. Score: Jaccard
    const unionSize = new Set([...words1, ...words2]).size;

    return Math.round((common / unionSize) * 100);
};

fixData();
