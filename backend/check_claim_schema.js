const db = require('./config/db');

async function check() {
    try {
        console.log("--- ItemClaims Schema ---");
        const [claims] = await db.execute('DESCRIBE ItemClaims');
        claims.forEach(c => console.log(`${c.Field} (${c.Type})`));

        console.log("\n--- ItemConditionReport Schema ---");
        const [conditions] = await db.execute('DESCRIBE ItemConditionReport');
        conditions.forEach(c => console.log(`${c.Field} (${c.Type})`));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
