
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

async function makeAdmin() {
    try {
        const email = 'hakar@srm.edu';
        console.log(`Promoting ${email} to admin...`);

        const [user] = await pool.promise().execute('SELECT * FROM Users WHERE email = ?', [email]);

        if (user.length === 0) {
            console.log('User not found!');
            process.exit(1);
        }

        await pool.promise().execute('UPDATE Users SET role = ? WHERE email = ?', ['admin', email]);
        console.log('Success! User is now an admin.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

makeAdmin();
