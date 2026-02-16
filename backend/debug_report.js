const db = require('./config/db');
const { createLostReport } = require('./controllers/lostController');

// Mock Req/Res
const req = {
    body: {
        user_id: 1,
        item_name: "Debug Item",
        category_id: 1,
        location_id: 1,
        description: "Debug Description",
        lost_date: "2026-02-16",
        color: "Black",
        photo_url: "",
        // specific_location intentionally undefined to test robustness
    }
};

const res = {
    status: (code) => ({
        json: (data) => console.log(`Status ${code}:`, data)
    }),
    json: (data) => console.log("Response:", data)
};

async function test() {
    try {
        console.log("Testing createLostReport...");
        await createLostReport(req, res);
        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error("CRASH:", e);
        process.exit(1);
    }
}

test();
