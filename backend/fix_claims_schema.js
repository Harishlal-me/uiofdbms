
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function fixClaimsSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Fixing ItemClaims Schema ---');
        // Add 'Collected' to ItemClaims
        await connection.execute("ALTER TABLE ItemClaims MODIFY COLUMN claim_status ENUM('Pending', 'Approved', 'Rejected', 'Collected', 'Cancelled', 'Verified') DEFAULT 'Pending'");

        console.log("✅ ItemClaims schema updated.");

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixClaimsSchema();
