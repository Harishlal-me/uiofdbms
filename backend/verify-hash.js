
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'lost_found_system_2028'
};

async function verify() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT password FROM Users WHERE email = ?', ['hakar@srm.edu']);
        const hash = rows[0].password;

        console.log("Hash from DB:", hash);
        const match = await bcrypt.compare("hakar123", hash);
        console.log("Does 'hakar123' match?", match);

        await connection.end();
    } catch (error) {
        console.error("Error:", error);
    }
}

verify();
