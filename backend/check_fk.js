const db = require('./config/db');

async function checkFK() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                TABLE_NAME, 
                COLUMN_NAME, 
                CONSTRAINT_NAME, 
                REFERENCED_TABLE_NAME, 
                REFERENCED_COLUMN_NAME
            FROM
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE
                REFERENCED_TABLE_SCHEMA = 'lost_found_system_2028' 
                AND TABLE_NAME = 'Matches';
        `);
        console.table(rows);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkFK();
