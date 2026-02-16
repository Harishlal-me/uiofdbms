
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'lost_found_system_2028'
};

async function listTables() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SHOW TABLES');

        const output = JSON.stringify(rows, null, 2);
        fs.writeFileSync('tables.txt', output);

        await connection.end();
        process.exit(0);
    } catch (error) {
        fs.writeFileSync('tables.txt', 'Error: ' + error.message);
        process.exit(1);
    }
}

listTables();
