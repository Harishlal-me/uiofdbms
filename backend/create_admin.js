require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function createAdmin() {
    try {
        console.log('=== CREATING ADMIN USER ===\n');

        // Step 1: Check current users
        const [existingUsers] = await db.execute('SELECT user_id, name, email, role FROM Users');
        console.log('Current users in database:');
        existingUsers.forEach(u => {
            console.log(`  ID: ${u.user_id}, Email: ${u.email}, Role: ${u.role}`);
        });

        // Step 2: Delete existing admin users
        await db.execute("DELETE FROM Users WHERE role = 'admin'");
        console.log('\n✓ Removed existing admin users');

        // Step 3: Create new admin user
        const hashedPassword = await bcrypt.hash('pass-hakar123', 10);
        const [result] = await db.execute(
            'INSERT INTO Users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['Admin Hakar', 'hakar@srm.edu', hashedPassword, 'admin', '9876543210']
        );

        console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY!');
        console.log('   user_id:', result.insertId);
        console.log('   email: hakar@srm.edu');
        console.log('   password: pass-hakar123');
        console.log('   role: admin');

        // Step 4: Verify creation
        const [newUsers] = await db.execute('SELECT user_id, name, email, role FROM Users WHERE email = ?', ['hakar@srm.edu']);
        if (newUsers.length > 0) {
            console.log('\n✓ Verification successful! Admin user exists in database.');
        } else {
            console.log('\n❌ ERROR: Admin user not found after creation!');
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

createAdmin();
