require('dotenv').config();
const db = require('./config/db');

async function checkAdminUser() {
    try {
        console.log('=== CHECKING ADMIN USER ===\n');

        // Check for admin users
        const [admins] = await db.execute("SELECT user_id, name, email, role FROM Users WHERE role = 'admin'");

        console.log('Admin Users:');
        if (admins.length === 0) {
            console.log('  ❌ NO ADMIN USERS FOUND!');
        } else {
            admins.forEach(u => {
                console.log(`  ✓ user_id: ${u.user_id}, name: ${u.name}, email: ${u.email}`);
            });
        }

        // Check all users
        console.log('\nAll Users:');
        const [allUsers] = await db.execute('SELECT user_id, name, email, role FROM Users LIMIT 10');
        allUsers.forEach(u => {
            console.log(`  user_id: ${u.user_id}, name: ${u.name}, email: ${u.email}, role: ${u.role}`);
        });

        console.log('\n=== SOLUTION ===');
        console.log('The error is: Foreign key constraint on verified_by column');
        console.log('verified_by must reference an existing user_id in Users table');
        console.log('\nIf no admin exists, we need to either:');
        console.log('1. Create an admin user');
        console.log('2. Make verified_by nullable (allow NULL)');
        console.log('3. Use a valid existing user_id');

    } catch (error) {
        console.error('Error:', error.message);
    }
    process.exit(0);
}

checkAdminUser();
