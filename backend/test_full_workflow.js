require('dotenv').config();
const axios = require('axios');

async function testFullWorkflow() {
    try {
        console.log('=== TESTING COMPLETE WORKFLOW ===\n');

        // Step 1: Login as admin
        console.log('1. Logging in as admin...');
        const loginRes = await axios.post('http://localhost:5000/api/users/login', {
            email: 'admin@example.com',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        const user = loginRes.data.user;
        console.log('✓ Logged in as:', user.name, `(user_id: ${user.id}, role: ${user.role})`);

        // Step 2: Get claim details for match_id 2
        console.log('\n2. Fetching claim details for match_id 2...');
        const claimRes = await axios.get('http://localhost:5000/api/claims/match/2', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('✓ Claim data received:');
        console.log('  - Claimer:', claimRes.data.claimer_name);
        console.log('  - Item:', claimRes.data.found_item_name);
        console.log('  - Finder photo:', claimRes.data.finder_photo || '(none)');
        console.log('  - Owner photo:', claimRes.data.owner_collection_photo || '(none)');

        // Step 3: Submit condition report
        console.log('\n3. Submitting condition report...');
        const conditionRes = await axios.post('http://localhost:5000/api/claims/condition', {
            match_id: 2,
            damage_found: false,
            damage_notes: null
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', conditionRes.data);

    } catch (error) {
        console.error('\n❌ ERROR OCCURRED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error message:', error.response.data.message || error.response.data.error);
            console.error('Full error data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
    process.exit(0);
}

testFullWorkflow();
