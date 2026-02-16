require('dotenv').config();
const axios = require('axios');

async function testConditionReportAPI() {
    try {
        console.log('=== TESTING CONDITION REPORT API ===\n');

        // Step 1: Login as admin to get token
        console.log('1. Logging in as admin...');
        const loginRes = await axios.post('http://localhost:5013/api/users/login', {
            email: 'admin@example.com',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        const user = loginRes.data.user;
        console.log('✓ Logged in as:', user.name, `(user_id: ${user.id}, role: ${user.role})`);
        console.log('✓ Token received');

        // Step 2: Submit condition report
        console.log('\n2. Submitting condition report...');
        const conditionRes = await axios.post('http://localhost:5013/api/claims/condition', {
            match_id: 2,
            damage_found: false,
            damage_notes: null
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', conditionRes.data);

    } catch (error) {
        console.error('\n❌ ERROR OCCURRED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testConditionReportAPI();
