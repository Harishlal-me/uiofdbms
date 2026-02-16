require('dotenv').config();
const db = require('./config/db');

async function checkSchema() {
    try {
        const [rows] = await db.execute('DESCRIBE ItemClaims');
        console.log('\nItemClaims Table Schema:\n');
        console.log('Column               Type                 Null  Key   Default');
        console.log('-------------------------------------------------------------------');
        rows.forEach(r => {
            const field = r.Field.padEnd(20);
            const type = r.Type.padEnd(20);
            const nullable = r.Null.padEnd(5);
            const key = r.Key.padEnd(5);
            const def = r.Default || 'NULL';
            console.log(`${field} ${type} ${nullable} ${key} ${def}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkSchema();
