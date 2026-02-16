const db = require('./config/db');
const fs = require('fs');

async function dump() {
    try {
        const [users] = await db.execute('SELECT user_id, name, email FROM Users');
        const [lost] = await db.execute('SELECT * FROM LostReports ORDER BY lost_id DESC LIMIT 5');
        const [found] = await db.execute('SELECT * FROM FoundReports ORDER BY found_id DESC LIMIT 5');
        const [matches] = await db.execute('SELECT * FROM Matches ORDER BY match_id DESC LIMIT 10');

        const dumpData = {
            users,
            lost,
            found,
            matches
        };

        fs.writeFileSync('debug_reports.json', JSON.stringify(dumpData, null, 2));
        console.log('Dumped to debug_reports.json');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
dump();
