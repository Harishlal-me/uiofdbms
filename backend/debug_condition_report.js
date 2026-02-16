
const axios = require('axios');

async function testConditionReport() {
    try {
        console.log('--- Debugging Item Condition Report ---');

        // 1. Login as Admin to get Token
        console.log('Logging in as Admin...');
        const loginRes = await axios.post('http://localhost:5000/api/users/login', {
            email: 'hakar@srm.edu',
            password: 'pass-hakar123'
        });
        const adminToken = loginRes.data.token;
        console.log('✅ Admin Logged In');

        // 2. Use a match ID that has a claim 
        // We need a match that has been claimed but not verified
        // For testing, we might need to create one, but let's try a likely ID or just check 
        const matchId = 2;

        console.log(`Testing verification for match ${matchId}...`);

        const response = await axios.post(
            'http://localhost:5000/api/claims/condition',
            {
                match_id: matchId,
                damage_found: false,
                damage_notes: "Verified safely via debug script."
            },
            {
                headers: { Authorization: `Bearer ${adminToken}` }
            }
        );

        console.log('✅ Response:', response.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testConditionReport();
