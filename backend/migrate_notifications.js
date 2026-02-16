const db = require('./config/db');

async function migrate() {
    console.log("Checking Notifications table schema...");
    try {
        const [rows] = await db.execute('DESCRIBE Notifications');
        const columns = rows.map(r => r.Field);
        console.log("Existing columns:", columns);

        if (!columns.includes('is_read')) {
            console.log("Adding is_read column...");
            await db.execute('ALTER TABLE Notifications ADD COLUMN is_read BOOLEAN DEFAULT FALSE');
        }

        if (!columns.includes('match_id')) {
            console.log("Adding match_id column...");
            await db.execute('ALTER TABLE Notifications ADD COLUMN match_id INT DEFAULT NULL');
        }

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
