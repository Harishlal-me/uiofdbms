require('dotenv').config();
const db = require('./config/db');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testMatchEndpoint() {
    try {
        // Get a real match ID
        const [matches] = await db.execute('SELECT match_id, lost_id, found_id FROM Matches LIMIT 1');

        if (matches.length === 0) {
            console.log('No matches found in database');
            return;
        }

        const matchId = matches[0].match_id;
        console.log(`Testing match ID: ${matchId}`);

        // Get user from lost report
        const [lostReports] = await db.execute('SELECT user_id FROM LostReports WHERE lost_id = ?', [matches[0].lost_id]);
        const userId = lostReports[0].user_id;

        // Generate token
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret123');

        // Test endpoint
        const response = await axios.get(`http://localhost:5013/api/matches/${matchId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('\n✓ Match Data Retrieved:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
    process.exit(0);
}

testMatchEndpoint();
