require('dotenv').config();
const db = require('./config/db');

async function deleteTestClaims() {
    try {
        const [result] = await db.execute(
            "DELETE FROM ItemClaims WHERE proof_description LIKE '%Test claim%' OR proof_description LIKE '%automated verification%'"
        );
        console.log('✓ Deleted', result.affectedRows, 'test claim(s)');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

deleteTestClaims();
