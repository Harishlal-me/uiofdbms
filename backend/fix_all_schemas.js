
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function fixAllSchemas() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Fixing Database Schemas ---');

        // 1. Update ItemClaims (add 'Collected')
        console.log('Updating ItemClaims...');
        await connection.execute("ALTER TABLE ItemClaims MODIFY COLUMN claim_status ENUM('Pending', 'Approved', 'Rejected', 'Collected', 'Cancelled') DEFAULT 'Pending'");

        // 2. Update LostReports (add 'Resolved')
        console.log('Updating LostReports...');
        await connection.execute("ALTER TABLE LostReports MODIFY COLUMN status ENUM('Active', 'Found', 'Resolved', 'Expired') DEFAULT 'Active'");

        // 3. Update FoundReports (add 'Resolved')
        console.log('Updating FoundReports...');
        await connection.execute("ALTER TABLE FoundReports MODIFY COLUMN status ENUM('Active', 'Claimed', 'Resolved', 'Expired') DEFAULT 'Active'");

        console.log("✅ All schemas updated successfully.");

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixAllSchemas();
