
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'lost_found_system_2028'
};

async function listItems() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT i.item_id, i.item_name, i.status, u.email as reporter_email 
            FROM Items i 
            LEFT JOIN Users u ON i.user_id = u.user_id
        `);
        console.log("Items:", JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (error) {
        console.error("Error:", error);
    }
}

listItems();
