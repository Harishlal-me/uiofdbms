
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

async function auditData() {
    let output = '';
    try {
        const connection = await mysql.createConnection(dbConfig);

        // 1. Get Users
        const [users] = await connection.execute('SELECT user_id, name, email, role FROM users');
        output += '--- USERS ---\n' + JSON.stringify(users, null, 2) + '\n\n';

        // 2. Get Lost Reports
        const [lost] = await connection.execute('SELECT * FROM lostreports');
        output += '--- LOST REPORTS ---\n' + JSON.stringify(lost, null, 2) + '\n\n';

        // 3. Get Found Reports
        const [found] = await connection.execute('SELECT * FROM foundreports');
        output += '--- FOUND REPORTS ---\n' + JSON.stringify(found, null, 2) + '\n\n';

        fs.writeFileSync('db_audit.txt', output);
        await connection.end();
    } catch (error) {
        console.error(error);
        fs.writeFileSync('db_audit.txt', 'Error: ' + error.message);
    }
}

auditData();
