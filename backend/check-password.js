
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'lost_found_system_2028'
};

async function checkPassword() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT email, password FROM Users WHERE email = ?', ['hakar@srm.edu']);
        console.log("User Data:", rows[0]);
        await connection.end();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkPassword();
