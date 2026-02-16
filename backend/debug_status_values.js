
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkStatusValues() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Checking Existing Status Values ---');

        const [distinctLost] = await connection.execute("SELECT DISTINCT status FROM LostReports");
        console.log('LostReports Statuses:', JSON.stringify(distinctLost, null, 2));

        const [distinctFound] = await connection.execute("SELECT DISTINCT status FROM FoundReports");
        console.log('FoundReports Statuses:', JSON.stringify(distinctFound, null, 2));

        const [distinctClaims] = await connection.execute("SELECT DISTINCT claim_status FROM ItemClaims");
        console.log('ItemClaims Statuses:', JSON.stringify(distinctClaims, null, 2));

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkStatusValues();
