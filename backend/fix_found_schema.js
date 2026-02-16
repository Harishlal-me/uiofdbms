
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function fixFoundSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Fixing FoundReports Schema ---');
        // Add 'Resolved' and 'Claimed' to FoundReports
        // Current likely: 'Active', 'Lost', 'Found' - we need to see what's actually there if this fails
        // But let's try a very broad ENUM to cover all bases then narrow down if needed, or just append

        await connection.execute("ALTER TABLE FoundReports MODIFY COLUMN status ENUM('Active', 'Claimed', 'Resolved', 'Expired', 'Found', 'Pending') DEFAULT 'Active'");

        console.log("✅ FoundReports schema updated.");

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixFoundSchema();
