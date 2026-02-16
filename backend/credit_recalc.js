require('dotenv').config();
const db = require('./config/db');

async function recalculate() {
    try {
        console.log("--- Recalculating CS Credits ---");

        // 1. Reset all users to 0
        await db.execute('UPDATE Users SET cs_credits = 0');
        console.log("Reset all credits to 0.");

        // 2. Get verified matches
        // Look for matches that are 'Verified', 'Resolved', or have admin_verified=1
        const [matches] = await db.execute(`
            SELECT m.match_id, m.lost_id, m.found_id 
            FROM Matches m 
            WHERE m.match_status IN ('Verified', 'Resolved') OR m.admin_verified = 1
        `);

        console.log(`Found ${matches.length} verified/resolved matches.`);

        let updates = 0;

        for (const match of matches) {
            // Get Finder
            const [found] = await db.execute('SELECT user_id FROM FoundReports WHERE found_id = ?', [match.found_id]);
            // Get Loser
            const [lost] = await db.execute('SELECT user_id FROM LostReports WHERE lost_id = ?', [match.lost_id]);

            // Award Finder (+50)
            if (found.length > 0 && found[0].user_id) {
                await db.execute('UPDATE Users SET cs_credits = cs_credits + 50 WHERE user_id = ?', [found[0].user_id]);
                updates++;
            }

            // Award Loser (+10)
            if (lost.length > 0 && lost[0].user_id) {
                await db.execute('UPDATE Users SET cs_credits = cs_credits + 10 WHERE user_id = ?', [lost[0].user_id]);
                updates++;
            }
        }

        console.log(`Processed ${updates} credit updates.`);

        // Log "Shamili" score (search by name or email part)
        const [shamili] = await db.execute('SELECT name, email, cs_credits FROM Users WHERE name LIKE "%Shamili%" OR email LIKE "%shamili%"');
        console.log("Shamili Status:", JSON.stringify(shamili));

        console.log("--- Recalculation Complete ---");
        process.exit(0);

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

recalculate();
