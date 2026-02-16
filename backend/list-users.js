
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lost_found_system_2028',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function listUsers() {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM Users');
        console.log('Users:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listUsers();
