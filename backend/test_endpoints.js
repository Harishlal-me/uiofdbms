const axios = require('axios');

async function test() {
    const baseUrl = 'http://localhost:5000/api';
    try {
        console.log("Testing Categories...");
        const cats = await axios.get(`${baseUrl}/categories`);
        console.log(`Categories: ${cats.data.length} items`);

        console.log("Testing Storage...");
        const storage = await axios.get(`${baseUrl}/storage`);
        console.log(`Storage: ${storage.data.length} items`);

        console.log("Testing Audit Logs...");
        const audits = await axios.get(`${baseUrl}/audit-logs`);
        console.log(`Audit Logs: ${audits.data.length} items`);

    } catch (error) {
        console.error("API Error:", error.message);
        if (error.response) console.error("Status:", error.response.status);
    }
}

test();
