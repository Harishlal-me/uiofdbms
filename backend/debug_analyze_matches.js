
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function analyzeMatches() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lost_found_system_2028'
        });

        console.log('--- Analyzing Matches & Participants ---');

        const [rows] = await connection.execute(`
            SELECT 
                m.match_id, 
                m.match_status,
                l.user_id as owner_id, 
                u_l.email as owner_email,
                f.user_id as finder_id,
                u_f.email as finder_email
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            LEFT JOIN Users u_l ON l.user_id = u_l.user_id
            LEFT JOIN Users u_f ON f.user_id = u_f.user_id
            LIMIT 10
        `);

        console.log(JSON.stringify(rows, null, 2));

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

analyzeMatches();
