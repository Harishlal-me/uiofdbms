const axios = require('axios');

async function testEndpoints() {
    const baseURL = 'http://localhost:5000/api';

    console.log("Testing /matches...");
    try {
        const res = await axios.get(`${baseURL}/matches`);
        console.log("Matches Status:", res.status);
        if (res.data.length > 0) {
            console.log("First Match Data:", JSON.stringify(res.data[0], null, 2));
        } else {
            console.log("No matches found.");
        }
    } catch (error) {
        console.error("Matches Error:", error.message);
        if (error.response) console.error("Matches Response:", error.response.data);
    }
}

testEndpoints();
