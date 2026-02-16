const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.execute('SHOW CREATE TABLE Categories');
        console.log("Categories:", rows[0]['Create Table']);
        const [locs] = await db.execute('SHOW CREATE TABLE StorageLocations');
        console.log("Storage:", locs[0]['Create Table']);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
