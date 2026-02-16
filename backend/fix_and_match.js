const db = require('./config/db');

async function fixAndMatch() {
    try {
        const [recentLost] = await db.execute('SELECT lost_id, item_name FROM LostReports ORDER BY lost_id DESC LIMIT 5');
        console.log("LOST REPORTS:");
        recentLost.forEach(i => console.log(`L#${i.lost_id}: ${i.item_name}`));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

fixAndMatch();
