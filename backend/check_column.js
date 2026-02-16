const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.execute("SHOW COLUMNS FROM FoundReports LIKE 'storage_location_id'");
        console.log("Exists:", rows.length > 0);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
