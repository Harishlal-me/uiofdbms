const db = require('./config/db');

async function checkIDs() {
    try {
        const [users] = await db.execute('SELECT user_id, name FROM Users LIMIT 5');
        console.log("Users:", users);

        const [categories] = await db.execute('SELECT category_id, category_name FROM Categories LIMIT 5');
        console.log("Categories:", categories);

        const [locations] = await db.execute('SELECT location_id, area_name FROM Locations LIMIT 5');
        console.log("Locations:", locations);

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkIDs();
