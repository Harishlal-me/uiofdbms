
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'lost_found_system_2028'
};

async function cleanup() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        console.log("Cleaning up database...");

        // Keep users 8 (shamili) and 9 (hakar)
        const keepIds = [8, 9];
        const keepIdsStr = keepIds.join(',');

        // 1. Delete Reports
        const [delLost] = await connection.execute(`DELETE FROM lostreports WHERE user_id NOT IN (${keepIdsStr})`);
        console.log(`Deleted ${delLost.affectedRows} lost reports.`);

        const [delFound] = await connection.execute(`DELETE FROM foundreports WHERE user_id NOT IN (${keepIdsStr})`);
        console.log(`Deleted ${delFound.affectedRows} found reports.`);

        // 2. Delete Users (Constraint Safety: Reports must be gone first)
        const [delUsers] = await connection.execute(`DELETE FROM users WHERE user_id NOT IN (${keepIdsStr})`);
        console.log(`Deleted ${delUsers.affectedRows} users.`);

        console.log("Cleanup complete. Only 'shamili' and 'hakar' remain.");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("Cleanup Error:", error);
        process.exit(1);
    }
}

cleanup();
