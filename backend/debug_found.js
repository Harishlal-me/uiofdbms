const db = require('./config/db');
const { createFoundReport } = require('./controllers/foundController');

// Mock Req/Res mimicking ReportFound.jsx payload
const req = {
    body: {
        user_id: 1,
        item_name: "Debug Found Item",
        category_id: 1,
        location_id: 1,
        // MIMIC THE FRONTEND MISTAKE:
        locationFound: "Some Tech Park", // Frontend sends this, Controller expects specific_location
        storage_location_id: "", // Frontend might send empty string if not selected? OR a valid string "1"
        description: "Debug Description",
        found_date: "2026-02-16",
        contact_phone: "1234567890",
        ra_reg_no: "RA123",
        color: "Unknown",
        found_photo_url: null
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
        console.log("Testing createFoundReport with mismatched payload...");
        await createFoundReport(req, res);
        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error("CRASH:", e);
        process.exit(1);
    }
}

test();
