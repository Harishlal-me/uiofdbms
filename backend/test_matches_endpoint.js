require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testMatchesEndpoint() {
    try {
        // Generate test token for user_id = 1
        const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret123');

        console.log("Testing /api/matches/user endpoint...");
        console.log("Token:", token.substring(0, 20) + "...");

        const response = await axios.get('http://localhost:5013/api/matches/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("\n✓ SUCCESS");
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log("\n✗ ERROR");
        console.log("Status:", error.response?.status);
        console.log("Message:", error.response?.data?.message || error.message);
        console.log("Full error:", error.response?.data);
    }
}

testMatchesEndpoint();
