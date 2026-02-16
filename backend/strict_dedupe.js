const db = require('./config/db');

async function strictDedupe() {
    try {
        console.log("--- Strict Deduplication for 'Keys' ---");

        // 1. Found Keys
        // Fetch all Found reports that look like "keys"
        const [foundKeys] = await db.execute("SELECT found_id, item_name, description, created_at FROM FoundReports WHERE item_name LIKE '%keys%' OR description LIKE '%keys%' ORDER BY found_id DESC");

        if (foundKeys.length > 1) {
            console.log(`Found ${foundKeys.length} 'keys' reports. Keeping the latest one (ID: ${foundKeys[0].found_id})...`);
            const keepId = foundKeys[0].found_id;
            const removeIds = foundKeys.map(r => r.found_id).filter(id => id !== keepId);

            if (removeIds.length > 0) {
                const placeholders = removeIds.map(() => '?').join(',');
                await db.execute(`DELETE FROM FoundReports WHERE found_id IN (${placeholders})`, removeIds);
                console.log(`Deleted ${removeIds.length} duplicate Found Reports.`);
            }
        }

        // 2. Lost Room Keys
        const [lostKeys] = await db.execute("SELECT lost_id, item_name, description, created_at FROM LostReports WHERE item_name LIKE '%room key%' OR description LIKE '%room key%' ORDER BY lost_id DESC");

        if (lostKeys.length > 1) {
            console.log(`Found ${lostKeys.length} 'room key' Lost reports. Keeping the latest one (ID: ${lostKeys[0].lost_id})...`);
            const keepId = lostKeys[0].lost_id;
            const removeIds = lostKeys.map(r => r.lost_id).filter(id => id !== keepId);

            if (removeIds.length > 0) {
                const placeholders = removeIds.map(() => '?').join(',');
                await db.execute(`DELETE FROM LostReports WHERE lost_id IN (${placeholders})`, removeIds);
                console.log(`Deleted ${removeIds.length} duplicate Lost Reports.`);
            }
        }

        console.log("Strict cleanup complete.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

strictDedupe();
