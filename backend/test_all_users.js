require('dotenv').config();
const db = require('./config/db');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testAllUsers() {
    try {
        // Get real users
        const [users] = await db.execute('SELECT user_id, name, email, role FROM Users WHERE role = ? LIMIT 3', ['student']);

        console.log(`Found ${users.length} users to test:\n`);

        for (const user of users) {
            console.log(`\n--- Testing User: ${user.name} (${user.email}) ---`);

            // Generate token
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET || 'secret123');

            try {
                const response = await axios.get('http://localhost:5013/api/matches/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                console.log(`✓ SUCCESS - ${response.data.length} matches found`);
                if (response.data.length > 0) {
                    console.log(`  First match:`, response.data[0].id, response.data[0].found?.name);
                }
            } catch (error) {
                console.log(`✗ ERROR:`, error.response?.data?.message || error.message);
            }
        }

        console.log('\n--- Test Complete ---');
        process.exit(0);

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

testAllUsers();
