const db = require('./config/db');

async function fixCredits() {
    console.log("Starting CS Credit Fix...");
    try {
        // 1. Reset everyone to 0 (or baseline? Assuming 0 for now)
        // await db.execute('UPDATE Users SET cs_credits = 0'); 
        // Better: Calculate valid credits from verified matches

        const [rows] = await db.execute(`
            SELECT 
                m.match_id, 
                l.user_id as loser_id, 
                f.user_id as finder_id
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            WHERE m.match_status = 'Verified' OR m.match_status = 'Resolved'
        `);

        console.log(`Found ${rows.length} verified matches.`);

        const credits = {};

        for (const r of rows) {
            // Finder gets 50
            if (r.finder_id) {
                credits[r.finder_id] = (credits[r.finder_id] || 0) + 50;
            }
            // Loser gets 10
            if (r.loser_id) {
                credits[r.loser_id] = (credits[r.loser_id] || 0) + 10;
            }
        }

        console.log("Calculated Credits:", credits);

        // Update DB
        for (const [userId, score] of Object.entries(credits)) {
            await db.execute('UPDATE Users SET cs_credits = ? WHERE user_id = ?', [score, userId]);
            console.log(`Updated User ${userId} to ${score} credits.`);
        }

        console.log("Credit Fix Complete!");
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

fixCredits();
