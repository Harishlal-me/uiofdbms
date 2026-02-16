const db = require('./config/db');

async function describeTable() {
    try {
        const [rows] = await db.execute('DESCRIBE FoundReports');
        console.table(rows);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

describeTable();
