require('dotenv').config();
const axios = require('axios');

async function testCompleteFlow() {
    try {
        console.log('=== TESTING COMPLETE COLLECTION VERIFICATION FLOW ===\n');

        // Step 1: Login as admin
        console.log('1. Logging in as admin (hakar@srm.edu)...');
        const loginRes = await axios.post('http://localhost:5000/api/users/login', {
            email: 'hakar@srm.edu',
            password: 'pass-hakar123'
        });

        const token = loginRes.data.token;
        const user = loginRes.data.user;
        console.log('✅ Login successful!');
        console.log('   User ID:', user.id);
        console.log('   Name:', user.name);
        console.log('   Role:', user.role);

        // Step 2: Get claim details for match_id 2
        console.log('\n2. Fetching claim details for match_id 2...');
        try {
            const claimRes = await axios.get('http://localhost:5000/api/claims/match/2', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('✅ Claim data received:');
            console.log('   Claimer:', claimRes.data.claimer_name);
            console.log('   Item:', claimRes.data.found_item_name);
            console.log('   Finder photo:', claimRes.data.finder_photo || '(none)');
            console.log('   Owner photo:', claimRes.data.owner_collection_photo || '(none)');
        } catch (e) {
            console.log('⚠️  Could not fetch claim (may not exist):', e.response?.data?.message);
        }

        // Step 3: Submit condition report
        console.log('\n3. Submitting condition report...');
        const conditionRes = await axios.post('http://localhost:5000/api/claims/condition', {
            match_id: 2,
            damage_found: false,
            damage_notes: null
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('\n✅✅✅ SUCCESS! CONDITION REPORT SUBMITTED ✅✅✅');
        console.log('Response:', conditionRes.data);
        console.log('\n🎉 ALL SYSTEMS WORKING! 🎉');

    } catch (error) {
        console.error('\n❌ ERROR OCCURRED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data.message || error.response.data.error);
            if (error.response.data.error) {
                console.error('Details:', error.response.data.error);
            }
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
    process.exit(0);
}

testCompleteFlow();
