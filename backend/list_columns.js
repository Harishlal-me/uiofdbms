const db = require('./config/db');

async function listColumns() {
    try {
        const [rows] = await db.execute('SHOW COLUMNS FROM FoundReports');
        console.log("COLUMNS IN FoundReports:");
        rows.forEach(r => console.log(`- ${r.Field}`));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listColumns();
