require('dotenv').config();
const db = require('./config/db');

async function run() {
    try {
        console.log("--- Debug Script Started ---");

        // 1. DELETE FAKE DATA
        console.log("Deleting fake users...");
        const [fakeUsers] = await db.execute('SELECT user_id, email FROM Users WHERE email LIKE "student_claim_%" OR email LIKE "admin_claim_%"');
        console.log(`Found ${fakeUsers.length} fake users.`);

        if (fakeUsers.length > 0) {
            const ids = fakeUsers.map(u => u.user_id);
            // Delete dependent data (Cascading might handle this, but to be safe)
            // Or just try deleting users
            for (const id of ids) {
                await db.execute('DELETE FROM Users WHERE user_id = ?', [id]);
            }
            console.log("Deleted fake users.");
        }

        // 2. CORERCT CS CREDITS
        console.log("Fixing CS Credits...");
        // Set NULL to 0
        await db.execute('UPDATE Users SET cs_credits = 0 WHERE cs_credits IS NULL');
        // Check "Shamili" (assuming user exists, or just verify update ran)
        console.log("CS Credits fixed (NULLs set to 0).");

        // 3. CHECK AUDIT LOGS
        console.log("Checking Audit Logs...");
        const [logs] = await db.execute('SELECT COUNT(*) as count FROM AuditLogs');
        console.log(`Audit Logs Count: ${logs[0].count}`);

        const [recent] = await db.execute('SELECT * FROM AuditLogs ORDER BY changed_at DESC LIMIT 1');
        console.log("Recent Log:", JSON.stringify(recent[0]));

        // 4. CHECK USER SCHEMA
        console.log("Checking User Schema...");
        const [columns] = await db.execute('DESCRIBE Users');
        const csCol = columns.find(c => c.Field === 'cs_credits');
        console.log("CS Credits Column:", JSON.stringify(csCol));

        console.log("--- Debug Script Finished ---");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

run();
