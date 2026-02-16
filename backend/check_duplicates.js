const db = require('./config/db');

async function check() {
    try {
        console.log("--- Checking for Duplicate Lost Reports ---");
        const [lostDups] = await db.execute(`
            SELECT item_name, description, COUNT(*) as count, GROUP_CONCAT(lost_id) as ids 
            FROM LostReports 
            GROUP BY item_name, description 
            HAVING count > 1
        `);
        console.table(lostDups);

        console.log("\n--- Checking for Duplicate Found Reports ---");
        const [foundDups] = await db.execute(`
            SELECT item_name, description, COUNT(*) as count, GROUP_CONCAT(found_id) as ids 
            FROM FoundReports 
            GROUP BY item_name, description 
            HAVING count > 1
        `);
        console.table(foundDups);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
