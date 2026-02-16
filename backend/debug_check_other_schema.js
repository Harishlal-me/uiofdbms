
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkOtherSchemas() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- ItemClaims (claim_status) ---');
        const [claimCols] = await connection.execute("SHOW COLUMNS FROM ItemClaims LIKE 'claim_status'");
        console.log(JSON.stringify(claimCols, null, 2));

        console.log('\n--- LostReports (status) ---');
        const [lostCols] = await connection.execute("SHOW COLUMNS FROM LostReports LIKE 'status'");
        console.log(JSON.stringify(lostCols, null, 2));

        console.log('\n--- FoundReports (status) ---');
        const [foundCols] = await connection.execute("SHOW COLUMNS FROM FoundReports LIKE 'status'");
        console.log(JSON.stringify(foundCols, null, 2));

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkOtherSchemas();
