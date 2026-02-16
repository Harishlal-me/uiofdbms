const db = require('./config/db');

async function inspectMatches() {
    try {
        console.log("--- Inspecting 'Room Key' Matches ---");
        const [matches] = await db.execute(`
            SELECT 
                m.match_id, 
                m.confidence_score, 
                l.lost_id, l.item_name as lost_item, l.description as lost_desc, 
                f.found_id, f.item_name as found_item, f.description as found_desc 
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            WHERE l.item_name LIKE '%room key%' OR f.item_name LIKE '%keys%'
            ORDER BY m.match_id DESC
        `);
        console.table(matches);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

inspectMatches();
