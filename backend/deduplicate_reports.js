const db = require('./config/db');

async function deduplicate() {
    try {
        console.log("Starting Deduplication...");

        // 1. Deduplicate Found Reports
        // Find duplicates based on item_name and description
        const [foundDups] = await db.execute(`
            SELECT item_name, description, GROUP_CONCAT(found_id ORDER BY found_id DESC) as ids 
            FROM FoundReports 
            GROUP BY item_name, description 
            HAVING COUNT(*) > 1
        `);

        let deletedFound = 0;
        for (const group of foundDups) {
            const ids = group.ids.split(',');
            const keepId = ids[0]; // Keep the newest one (highest ID)
            const removeIds = ids.slice(1); // Remove the rest

            if (removeIds.length > 0) {
                // Delete the older duplicates
                // Using WHERE IN (...)
                const placeholders = removeIds.map(() => '?').join(',');
                await db.execute(`DELETE FROM FoundReports WHERE found_id IN (${placeholders})`, removeIds);
                deletedFound += removeIds.length;
                console.log(`Deleted ${removeIds.length} duplicate Found Reports for "${group.item_name}" (Kept ID: ${keepId})`);
            }
        }

        // 2. Deduplicate Lost Reports
        const [lostDups] = await db.execute(`
            SELECT item_name, description, GROUP_CONCAT(lost_id ORDER BY lost_id DESC) as ids 
            FROM LostReports 
            GROUP BY item_name, description 
            HAVING COUNT(*) > 1
        `);

        let deletedLost = 0;
        for (const group of lostDups) {
            const ids = group.ids.split(',');
            const keepId = ids[0]; // Keep the newest
            const removeIds = ids.slice(1);

            if (removeIds.length > 0) {
                const placeholders = removeIds.map(() => '?').join(',');
                await db.execute(`DELETE FROM LostReports WHERE lost_id IN (${placeholders})`, removeIds);
                deletedLost += removeIds.length;
                console.log(`Deleted ${removeIds.length} duplicate Lost Reports for "${group.item_name}" (Kept ID: ${keepId})`);
            }
        }

        console.log(`\nCleanup Complete! Deleted ${deletedFound} Found duplicates and ${deletedLost} Lost duplicates.`);

        // 3. One last check for Matches that might be "duplicate" pairings 
        // (same lost_id and found_id - though DB usually prevents this if constraints exist, but let's check)
        // If the table doesn't have a UNIQUE constraint on (lost_id, found_id), we might have duplicates there too.
        // Let's assume the previous steps cleared the reports so matches cascaded.

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

deduplicate();
