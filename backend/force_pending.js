const db = require('./config/db');

async function forcePending() {
    try {
        console.log("Forcing Status Pending for Match 1-1...");
        await db.execute('UPDATE Matches SET match_status = "Pending" WHERE lost_id = 1 AND found_id = 1');
        console.log("Updated.");

        // Also update Lost/Found reports to Pending just in case
        await db.execute('UPDATE LostReports SET status = "Pending" WHERE lost_id = 1');
        await db.execute('UPDATE FoundReports SET status = "Pending" WHERE found_id = 1');
        console.log("Reports Updated.");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

forcePending();
