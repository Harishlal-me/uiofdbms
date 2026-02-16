
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lost_found_system_2028'
};

async function checkData() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to DB.");

        // Check Tables exist
        const [tables] = await connection.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0].toLowerCase());
        console.log("Tables:", tableNames);

        // Check if StorageLocations has data
        if (tableNames.includes('storagelocations')) {
            const [locs] = await connection.execute('SELECT * FROM StorageLocations');
            console.log("Storage Locations:", locs);
        } else {
            console.log("StorageLocations table missing!");
        }

        // Check AuditLog
        if (tableNames.includes('auditlog')) {
            const [logs] = await connection.execute('SELECT * FROM AuditLog ORDER BY created_at DESC LIMIT 5');
            console.log("Audit Logs:", logs);
        } else {
            console.log("AuditLog table missing!");
        }

        await connection.end();
    } catch (error) {
        console.error("Error:", error);
    }
}

checkData();
