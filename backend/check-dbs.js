
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

async function checkDatabases() {
    let output = '';
    output += `DB Config Host: ${dbConfig.host}\n`;
    output += `DB Config User: ${dbConfig.user}\n`;

    const databases = ['lost_found_system_2028', 'lost_found_system', 'lost_found_systemm'];

    for (const dbName of databases) {
        output += `\n--- Checking ${dbName} ---\n`;
        try {
            const connection = await mysql.createConnection({ ...dbConfig, database: dbName });
            output += `Connected to ${dbName}. Querying users...\n`;
            const [rows] = await connection.execute('SELECT email, role FROM Users');
            output += `Users in ${dbName}: ${JSON.stringify(rows, null, 2)}\n`;
            await connection.end();
        } catch (error) {
            output += `Error with ${dbName}: ${error.code} - ${error.message}\n`;
        }
    }

    fs.writeFileSync('db-check-results.txt', output);
    console.log("Check complete. Results written to db-check-results.txt");
}

checkDatabases();
