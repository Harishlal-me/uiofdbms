require('dotenv').config();
const db = require('./config/db');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testClaimSubmission() {
    try {
        // Get a verified match
        const [matches] = await db.execute(`
            SELECT m.match_id, l.user_id as owner_id
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            WHERE m.match_status = 'Verified' OR m.admin_verified = 1
            LIMIT 1
        `);

        if (matches.length === 0) {
            console.log('No verified matches found');
            return;
        }

        const match = matches[0];
        console.log(`Testing with match_id: ${match.match_id}, owner: ${match.owner_id}`);

        // Generate token for owner
        const token = jwt.sign({ id: match.owner_id }, process.env.JWT_SECRET || 'secret123');

        // Create form data
        const formData = new FormData();
        formData.append('match_id', match.match_id);
        formData.append('proof_description', 'Test claim - this is my item!');

        // Test submission
        console.log('\nSubmitting claim...');
        const response = await axios.post('http://localhost:5013/api/claims', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

        console.log('\n✅ SUCCESS!');
        console.log('Response:', response.data);

    } catch (error) {
        console.log('\n❌ ERROR:');
        console.log('Message:', error.response?.data?.message || error.message);
        console.log('Details:', error.response?.data);
    }
    process.exit(0);
}

testClaimSubmission();
