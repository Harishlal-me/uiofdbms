const axios = require('axios');
const db = require('./config/db');

const API_URL = 'http://localhost:5014/api';

async function run() {
    try {
        console.log("--- Starting Claim Workflow Verification ---");

        const timestamp = Date.now();
        const studentEmail = `student_claim_${timestamp}@srm.edu.in`;
        const adminEmail = `admin_claim_${timestamp}@srm.edu.in`;
        const password = 'password123';

        // 1. Setup Data: Create New Users
        console.log(`Creating Student: ${studentEmail}`);
        await axios.post(`${API_URL}/users/register`, {
            name: 'Claim Student',
            email: studentEmail,
            password: password,
            role: 'student',
            ra_reg_no: `RA${timestamp}`,
            mobile: '1234567890'
        });

        // Login Student
        const sLogin = await axios.post(`${API_URL}/users/login`, { email: studentEmail, password: password });
        const userToken = sLogin.data.token;
        console.log("Student Logged In");

        // Create Admin
        console.log(`Creating Admin: ${adminEmail}`);
        await axios.post(`${API_URL}/users/register`, {
            name: 'Claim Admin',
            email: adminEmail,
            password: password,
            role: 'admin',
            ra_reg_no: `AD${timestamp}`,
            mobile: '0987654321'
        });

        // Login Admin
        const aLogin = await axios.post(`${API_URL}/users/login`, { email: adminEmail, password: password });
        const adminToken = aLogin.data.token;
        console.log("Admin Logged In");

        // 2. Create Reports & Match directly in DB to simulate "Verified" state
        // Get User IDs
        const [users] = await db.execute('SELECT user_id, email FROM Users WHERE email IN (?, ?)', [studentEmail, adminEmail]);
        const studentId = users.find(u => u.email === studentEmail).user_id;
        const adminId = users.find(u => u.email === adminEmail).user_id;

        // Create Lost Report (by Student)
        // Create Dependencies if needed (Location/Category)
        // Assuming table names 'Locations' or 'StorageLocations' and 'Categories'
        // Try to insert valid dummy data or fetch existing.
        // Or simply use '1' if we assume generic seed data exists.
        // We will TRY catch the insert in case they failed due to existing.

        try {
            await db.execute('INSERT IGNORE INTO Categories (category_id, name) VALUES (1, "Electronics")');
            await db.execute('INSERT IGNORE INTO StorageLocations (storage_id, room_name, capacity) VALUES (1, "Library", 100)');
            // Also Locations if distinct? Assume logic handles it or foreign key is just generic.
        } catch (e) { console.log("Skipping seed data insert:", e.message); }

        // Create Lost Report (by Student)
        const [lRes] = await db.execute(
            'INSERT INTO LostReports (user_id, item_name, description, lost_date, status, contact_phone, ra_reg_no, specific_location, location_id, category_id) VALUES (?, "Lost Item Test", "Verification Test Item", NOW(), "Resolved", "1234567890", "RA123456", "Library", 1, 1)',
            [studentId]
        );

        // Create Found Report (by Admin/Finder)
        const [fRes] = await db.execute(
            'INSERT INTO FoundReports (user_id, item_name, description, found_date, status, contact_phone, ra_reg_no, specific_location, storage_location_id, category_id) VALUES (?, "Found Item Test", "Verification Test Item", NOW(), "Resolved", "0987654321", "AD123456", "Library Entrance", 1, 1)',
            [adminId]
        );
        const foundId = fRes.insertId;

        // Create Verified Match
        const [mRes] = await db.execute(
            'INSERT INTO Matches (lost_id, found_id, confidence_score, match_status, admin_verified, verified_at, created_at) VALUES (?, ?, 95, "Verified", 1, NOW(), NOW())',
            [lostId, foundId]
        );
        const matchId = mRes.insertId;
        console.log(`Created Verified Match ID: ${matchId}`);

        // 3. User Submits Claim
        console.log("\n--- User Submitting Claim ---");
        try {
            const claimRes = await axios.post(
                `${API_URL}/claims`,
                {
                    match_id: matchId,
                    proof_description: "Unique sticket verified.",
                    proof_photo_url: "http://example.com/receipt.jpg"
                },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            console.log("Claim Response:", claimRes.data);
        } catch (e) {
            console.error("Claim Failed:", e.response?.data || e.message);
            process.exit(1);
        }

        // 4. Admin View Claims
        console.log("\n--- Admin Fetching Claims ---");
        try {
            const listRes = await axios.get(`${API_URL}/claims`, { headers: { Authorization: `Bearer ${adminToken}` } });
            const myClaim = listRes.data.find(c => c.found_id === foundId); // match_id joined now
            if (myClaim) {
                console.log("Admin found the claim:", myClaim.proof_description);
                if (myClaim.match_id !== matchId) console.warn("WARNING: match_id mismatch in list response!");
            } else {
                console.error("Admin could not find the new claim!");
                process.exit(1);
            }
        } catch (e) {
            console.error("Fetch Claims Failed:", e.response?.data || e.message);
            process.exit(1);
        }

        // 5. Admin Submit Condition Report
        console.log("\n--- Admin Submitting Condition Report ---");
        try {
            const reportRes = await axios.post(
                `${API_URL}/claims/condition`,
                {
                    match_id: matchId,
                    collection_photo_url: "http://example.com/handover.jpg",
                    damage_found: false,
                    damage_notes: ""
                },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            console.log("Condition Report Response:", reportRes.data);
        } catch (e) {
            console.error("Condition Report Failed:", e.response?.data || e.message);
            process.exit(1);
        }

        // 6. Verify Final DB State
        console.log("\n--- Verifying Database State ---");
        const [claims] = await db.execute('SELECT * FROM ItemClaims WHERE found_id = ?', [foundId]);
        const [reports] = await db.execute('SELECT * FROM ItemConditionReport WHERE match_id = ?', [matchId]);

        console.log(`Claim Status: ${claims[0].claim_status} (Expected: Approved)`);
        console.log(`Condition Report Created: ${reports.length > 0}`);

        process.exit(0);
    } catch (e) {
        console.error("Script Error:", e.response?.data || e.message);
        process.exit(1);
    }
}

run();
