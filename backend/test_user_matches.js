
const axios = require('axios');

async function testUserMatches() {
    try {
        console.log('--- Testing "My Matches" Logic ---');

        // 1. Login as a regular user (create one first if needed, or use existing)
        // I'll create a new user to be sure they have 0 matches initially
        const timestamp = Date.now();
        const email = `testuser_${timestamp}@example.com`;
        const password = 'password123';

        console.log(`Registering new user: ${email}`);
        await axios.post('http://localhost:5000/api/users/register', {
            name: 'Test User Matches',
            email: email,
            password: password,
            phone: '1234567890',
            ra_reg_no: 'RA123456'
        });

        // 2. Login to get token
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/users/login', {
            email: email,
            password: password
        });
        const token = loginRes.data.token;
        const userId = loginRes.data._id; // Adjust if structure is different
        console.log('User logged in. Token received.');

        // 3. Fetch My Matches - Should be empty
        console.log('Fetching /api/matches/user (Expect empty)...');
        const matchesRes = await axios.get('http://localhost:5000/api/matches/user', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Matches found: ${matchesRes.data.length}`);
        if (matchesRes.data.length === 0) {
            console.log('✅ Correct: New user sees 0 matches.');
        } else {
            console.error('❌ BUG: New user sees matches they should not see!');
            console.log('First match:', matchesRes.data[0]);
        }

        // 4. (Optional) Login as Admin/Owner of an existing match and check they DO see it
        // This requires knowing credentials of a user with matches. 
        // For now, testing the "foreign user sees nothing" case is the most critical proof of isolation.

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testUserMatches();
