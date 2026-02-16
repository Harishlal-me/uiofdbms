const db = require('./config/db');

async function checkState() {
    try {
        console.log("--- DEBUG DB STATE ---");

        const [lost] = await db.execute('SELECT COUNT(*) as c FROM LostReports WHERE status = "Pending"');
        console.log(`Lost Pending: ${lost[0].c}`);

        const [found] = await db.execute('SELECT COUNT(*) as c FROM FoundReports WHERE status = "Pending"');
        console.log(`Found Pending: ${found[0].c}`);

        const [matches] = await db.execute('SELECT COUNT(*) as c FROM Matches WHERE match_status = "Pending"');
        console.log(`Matches Pending: ${matches[0].c}`);

        const [allMatches] = await db.execute('SELECT * FROM Matches');
        console.log("ALL MATCHES DUMP:");
        console.table(allMatches);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkState();
