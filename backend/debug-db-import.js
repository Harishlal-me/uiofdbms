
const fs = require('fs');
const util = require('util');
const logFile = fs.createWriteStream('debug-result.txt', { flags: 'w' });
const logStdout = process.stdout;

console.log = function (...args) {
    const output = util.format(...args) + '\n';
    logFile.write(output);
    logStdout.write(output);
};

const dotenv = require('dotenv');
const db = require('./config/db'); // This will trigger db.js console.log too? No, unless db.js uses MY overridden console.log?
// db.js runs before I override console.log if I require it first?
// Wait, require is synchronous. db.js runs immediately.
// I should override console.log BEFORE requiring db.js.

dotenv.config();

// ... But db.js is already required in cache? No, this is a fresh run.

async function test() {
    try {
        console.log("Testing DB Query via config/db.js...");
        // db.execute might log something?
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', ['hakar@srm.edu']);
        console.log(`User found? ${rows.length > 0}`);
        if (rows.length > 0) console.log("User:", rows[0].email);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}
test();
