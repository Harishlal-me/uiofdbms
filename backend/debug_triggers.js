
const db = require('./config/db');

async function showTriggers() {
    try {
        console.log('--- Checking Triggers ---');
        const [triggers] = await db.execute('SHOW TRIGGERS');
        console.log(JSON.stringify(triggers, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

showTriggers();
