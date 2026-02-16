require('dotenv').config();
const db = require('./config/db');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');

async function testClaimFlow() {
    try {
        console.log('=== TESTING CLAIM FLOW ===\n');

        // 1. Get a verified match
        const [matches] = await db.execute(`
            SELECT m.match_id, l.user_id as owner_id, u.name as owner_name
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN Users u ON l.user_id = u.user_id
            WHERE (m.match_status = 'Verified' OR m.admin_verified = 1)
            AND m.match_id NOT IN (SELECT match_id FROM ItemClaims WHERE match_id IS NOT NULL)
            LIMIT 1
        `);

        if (matches.length === 0) {
            console.log('❌ No unclaimed verified matches found');
            return;
        }

        const match = matches[0];
        console.log(`✓ Found match: ID=${match.match_id}, Owner=${match.owner_name} (ID=${match.owner_id})`);

        // 2. Generate token for owner
        const token = jwt.sign({ id: match.owner_id }, process.env.JWT_SECRET || 'secret123');
        console.log('✓ Generated auth token');

        // 3. Create form data
        const formData = new FormData();
        formData.append('match_id', match.match_id);
        formData.append('proof_description', 'Test claim - automated verification');

        console.log('\n📤 Submitting claim...');
        console.log('  match_id:', match.match_id);
        console.log('  proof_description: Test claim - automated verification');
        console.log('  proof_photo: (none)');

        // 4. Submit claim
        const response = await axios.post('http://localhost:5013/api/claims', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        console.log('\n✅ CLAIM SUBMITTED SUCCESSFULLY!');
        console.log('Response:', response.data);

        // 5. Verify in database
        const [claims] = await db.execute('SELECT * FROM ItemClaims WHERE claim_id = ?', [response.data.claim_id]);
        if (claims.length > 0) {
            console.log('\n✅ VERIFIED IN DATABASE:');
            console.log('  claim_id:', claims[0].claim_id);
            console.log('  match_id:', claims[0].match_id);
            console.log('  claimed_by:', claims[0].claimed_by);
            console.log('  claim_date:', claims[0].claim_date);
            console.log('  claim_status:', claims[0].claim_status);
            console.log('  proof_description:', claims[0].proof_description);
        }

        console.log('\n🎉 CLAIM FLOW TEST PASSED!');

    } catch (error) {
        console.log('\n❌ CLAIM FLOW TEST FAILED');
        console.log('Error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.log('Server response:', JSON.stringify(error.response.data, null, 2));
        }
    }
    process.exit(0);
}

testClaimFlow();
