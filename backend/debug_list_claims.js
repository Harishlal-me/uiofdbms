
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function listClaims() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Listing Pending Claims ---');
        const [claims] = await connection.execute("SELECT * FROM ItemClaims WHERE claim_status = 'Pending' LIMIT 5");
        console.log(JSON.stringify(claims, null, 2));
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listClaims();
