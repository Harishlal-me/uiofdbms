
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function fixLostSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Fixing LostReports Schema ---');
        // Add 'Resolved' and 'Found' to LostReports
        await connection.execute("ALTER TABLE LostReports MODIFY COLUMN status ENUM('Active', 'Found', 'Resolved', 'Expired', 'Lost', 'Pending') DEFAULT 'Active'");

        console.log("✅ LostReports schema updated.");

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixLostSchema();
