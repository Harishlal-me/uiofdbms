const db = require('./config/db');
async function run() {
    try {
        const [rows] = await db.execute('SELECT user_id, email, role, password IS NOT NULL as has_password FROM Users');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
