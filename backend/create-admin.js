
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

async function createAdmin() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const name = "Admin Hakar";
        const email = "hakar@srm.edu";
        const phone = "9999999999";
        const rawPassword = "hakar123";
        const role = "admin";

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        console.log(`Creating admin user ${email}...`);

        // Check availability
        const [existing] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log("User already exists. Promoting to admin...");
            await connection.execute('UPDATE Users SET role = ? WHERE email = ?', ['admin', email]);
        } else {
            console.log("Inserting new admin user...");
            await connection.execute(
                'INSERT INTO Users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone, hashedPassword, role]
            );
        }

        console.log("Success! Account is ready.");
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();
