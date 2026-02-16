
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
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection and log status
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('\nPlease check:');
        console.error('1. MySQL server is running');
        console.error('2. Database credentials in .env file');
        console.error('3. Database "lost_found_system_2028" exists');
        process.exit(1); // Exit if DB connection fails
    } else {
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        connection.release();
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('❌ Database pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection lost. Attempting to reconnect...');
    }
});

module.exports = pool.promise();
