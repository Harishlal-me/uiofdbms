
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lost_found_system_2028'
};

async function checkSchema() {
    let output = '';
    try {
        const connection = await mysql.createConnection(dbConfig);

        // AuditLog
        try {
            const [cols] = await connection.execute('DESCRIBE AuditLog');
            output += '--- AuditLog ---\n' + JSON.stringify(cols, null, 2) + '\n\n';
        } catch (e) { output += 'AuditLog Error: ' + e.message + '\n'; }

        // StorageLocations
        try {
            const [cols] = await connection.execute('DESCRIBE StorageLocations');
            output += '--- StorageLocations ---\n' + JSON.stringify(cols, null, 2) + '\n\n';
        } catch (e) { output += 'StorageLocations Error: ' + e.message + '\n'; }

        fs.writeFileSync('schema.txt', output);
        await connection.end();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkSchema();
