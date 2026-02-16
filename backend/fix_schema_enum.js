
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function updateSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Updating Matches Table Schema ---');
        // Add 'Resolved' to the ENUM list
        await connection.execute("ALTER TABLE Matches MODIFY COLUMN match_status ENUM('Pending', 'Verified', 'Rejected', 'Resolved') DEFAULT 'Pending'");
        console.log("✅ Schema updated successfully.");

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateSchema();
