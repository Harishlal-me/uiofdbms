
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkMatchesSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Matches Table Schema (match_status) ---');
        const [cols] = await connection.execute("SHOW COLUMNS FROM Matches LIKE 'match_status'");
        console.log(JSON.stringify(cols, null, 2));
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkMatchesSchema();
