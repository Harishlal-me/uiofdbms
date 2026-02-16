const axios = require('axios');

async function createMatch() {
    const baseURL = 'http://localhost:5000/api';

    try {
        console.log("1. Creating Lost Report...");
        // User ID 8 is 'shamili' (Student) from previous context, or we can use 1.
        // Let's assume user_id 1 exists (Admin) or just use 1.
        // We need a valid category_id and location_id.
        // Assume Category 1 (Electronics) and Location 1 (Main Block).

        const lostRes = await axios.post(`${baseURL}/lost`, {
            user_id: 1,
            item_name: "Test iPhone 15",
            category_id: 1,
            location_id: 1,
            description: "Black iPhone 15 Pro, lost near reception",
            lost_date: "2023-10-27",
            color: "Black",
            photo_url: "https://placehold.co/400x300?text=Lost+iPhone"
        });
        console.log("Lost Report Created:", lostRes.data);

        console.log("\n2. Creating Found Report (Matching)...");
        const foundRes = await axios.post(`${baseURL}/found`, {
            user_id: 1,
            item_name: "Found iPhone 15",
            category_id: 1,      // Match
            location_id: 1,      // Match
            description: "Found a black iPhone near admin block",
            found_date: "2023-10-28", // After lost date
            color: "Black",      // Match
            found_photo_url: "https://placehold.co/400x300?text=Found+iPhone",
            storage_location_id: 1
        });
        console.log("Found Report Created:", foundRes.data);

        console.log("\n3. Checking for Matches...");
        const matchRes = await axios.get(`${baseURL}/matches`);
        console.log("Matches Found:", matchRes.data.length);
        if (matchRes.data.length > 0) {
            console.log("Match Data:", JSON.stringify(matchRes.data[0], null, 2));
        }

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) console.error("Response:", error.response.data);
    }
}

createMatch();
