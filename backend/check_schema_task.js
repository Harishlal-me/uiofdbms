const db = require('./config/db');

async function checkSchema() {
    try {
        console.log("--- Matches ---");
        const [matches] = await db.execute('SHOW COLUMNS FROM Matches');
        matches.forEach(c => console.log(c.Field));

        console.log("\n--- Users ---");
        const [users] = await db.execute('SHOW COLUMNS FROM Users');
        users.forEach(c => console.log(c.Field));

        console.log("\n--- Notifications ---");
        try {
            const [notifs] = await db.execute('SHOW COLUMNS FROM Notifications');
            notifs.forEach(c => console.log(c.Field));
        } catch (e) {
            console.log("Notifications table likely missing: " + e.message);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkSchema();
