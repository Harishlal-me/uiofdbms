const db = require('./config/db');

async function check() {
    try {
        console.log("--- Categories Columns ---");
        const [cols] = await db.execute(`
            SELECT COLUMN_NAME, EXTRA, COLUMN_DEFAULT, IS_NULLABLE 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = 'uiofdbms' AND TABLE_NAME = 'Categories'
        `);
        console.log(cols);

        console.log("\n--- Current Storage Locations ---");
        const [locs] = await db.execute('SELECT * FROM StorageLocations');
        console.log(locs);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
