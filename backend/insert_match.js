const db = require('./config/db');

async function checkMatch() {
    try {
        const [match] = await db.execute('SELECT * FROM Matches WHERE lost_id = 1 AND found_id = 1');
        console.log("MATCH DETAILS:");
        console.table(match);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkMatch();
