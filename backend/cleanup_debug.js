const db = require('./config/db');

async function cleanup() {
    try {
        console.log("Cleaning up debug data...");

        // Delete Matches first (though CASCADE might handle it, safer to be explicit if unsure)
        // Actually, let's just delete the Reports. The constraints usually cascade or we'll get an error.
        // If DELETE CASCADE is set up, deleting parent is enough.
        // Based on previous errors, we saw "ON DELETE CASCADE", so it should be fine.

        // Delete Found Reports
        const [foundResult] = await db.execute("DELETE FROM FoundReports WHERE item_name LIKE 'Debug%'");
        console.log(`Deleted ${foundResult.affectedRows} Found Reports.`);

        // Delete Lost Reports
        const [lostResult] = await db.execute("DELETE FROM LostReports WHERE item_name LIKE 'Debug%'");
        console.log(`Deleted ${lostResult.affectedRows} Lost Reports.`);

        // Also delete "room keys with 515 passed" if that was a test? 
        // User pointed to "Debug Lost Item Fixed" and "Debug Found Item Fixed".
        // The screenshot also showed "ID #113: room key / keys". The user said "remove these debug lsot item fixed founditem fixed".
        // I will stick to "Debug%" for now to be safe, unless user confirms otherwise. 
        // The "room key" might be a real user test.

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

cleanup();
