const db = require('./config/db');

async function checkStorage() {
    try {
        const [rows] = await db.execute('SELECT * FROM StorageLocations');
        console.table(rows);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkStorage();
