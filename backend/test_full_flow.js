
const axios = require('axios');
const db = require('./config/db'); // Direct DB access

const API_URL = 'http://localhost:5000/api';

async function testFullFlow() {
    try {
        console.log('--- STARTING FULL SYSTEM FLOW TEST ---');

        // 1. Register Users
        const timestamp = Date.now();
        const ownerEmail = `owner_${timestamp}@test.com`;
        const finderEmail = `finder_${timestamp}@test.com`;
        const otherEmail = `other_${timestamp}@test.com`;
        const adminEmail = 'hakar@srm.edu'; // Existing admin
        const password = 'password123';

        console.log('1. Registering users...');
        await axios.post(`${API_URL}/users/register`, { name: 'Owner', email: ownerEmail, password, phone: '1111111111' });
        await axios.post(`${API_URL}/users/register`, { name: 'Finder', email: finderEmail, password, phone: '2222222222' });
        await axios.post(`${API_URL}/users/register`, { name: 'Other', email: otherEmail, password, phone: '3333333333' });

        // 2. Login & Get Tokens
        console.log('2. Logging in...');
        const ownerLogin = (await axios.post(`${API_URL}/users/login`, { email: ownerEmail, password })).data;
        const finderLogin = (await axios.post(`${API_URL}/users/login`, { email: finderEmail, password })).data;
        const otherLogin = (await axios.post(`${API_URL}/users/login`, { email: otherEmail, password })).data;
        const adminLogin = (await axios.post(`${API_URL}/users/login`, { email: adminEmail, password: 'pass-hakar123' })).data;

        console.log('DEBUG: Owner Login Response:', JSON.stringify(ownerLogin, null, 2));

        const ownerToken = ownerLogin.token;
        const finderToken = finderLogin.token;
        const otherToken = otherLogin.token;
        const adminToken = adminLogin.token;

        const ownerId = ownerLogin.user.id;
        const finderId = finderLogin.user.id;

        console.log(`   Owner ID: ${ownerId}, Finder ID: ${finderId}`);

        // Helper to check credits via DB
        async function getCredits(userId) {
            const [rows] = await db.execute('SELECT cs_credits FROM Users WHERE user_id = ?', [userId]);
            return rows[0] ? rows[0].cs_credits : 0;
        }

        const initialCredits = await getCredits(finderId);
        console.log(`   Finder Initial Credits: ${initialCredits}`);

        // Fetch valid IDs
        const [cats] = await db.execute('SELECT category_id FROM Categories LIMIT 1');
        const [locs] = await db.execute('SELECT location_id FROM Locations LIMIT 1');
        const validCatId = cats[0].category_id;
        const validLocId = locs[0].location_id;
        console.log(`   Using Category ID: ${validCatId}, Location ID: ${validLocId}`);

        // 3. Create Reports
        console.log('3. Creating Lost & Found Reports...');
        const lostRes = await axios.post(`${API_URL}/lost`, {
            item_name: `Lost Item ${timestamp}`,
            category_id: validCatId,
            lost_date: '2026-01-01',
            location_id: validLocId,
            description: 'Black Wallet'
        }, { headers: { Authorization: `Bearer ${ownerToken}` } });
        console.log('DEBUG: Lost Report Response:', JSON.stringify(lostRes.data, null, 2));
        const lostId = lostRes.data.lostId;

        const foundRes = await axios.post(`${API_URL}/found`, {
            item_name: `Found Item ${timestamp}`,
            category_id: validCatId,
            found_date: '2026-01-02',
            location_id: validLocId,
            description: 'Black Wallet found near cafe'
        }, { headers: { Authorization: `Bearer ${finderToken}` } });
        console.log('DEBUG: Found Report Response:', JSON.stringify(foundRes.data, null, 2));
        const foundId = foundRes.data.foundId;

        console.log(`   Lost ID: ${lostId}, Found ID: ${foundId}`);

        // 4. Create Match (Manually via DB to skip Python matching for now)
        console.log('4. Creating Match (Simulation)...');
        const [matchResult] = await db.execute(
            'INSERT INTO Matches (match_id, lost_id, found_id, confidence_score, match_status, created_at, admin_id, storage_id) VALUES (NULL, ?, ?, ?, ?, NOW(), NULL, NULL)',
            [lostId, foundId, 95.5, 'Pending']
        );
        const matchId = matchResult.insertId;
        console.log(`   Match Created! ID: ${matchId}`);

        // 5. Admin Verifies Match
        console.log('5. Admin Verifying Match...');
        await axios.put(`${API_URL}/matches/${matchId}/verify`, {
            admin_id: 1,
            action: 'approve',
            notes: 'Looks like a match'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('   Match Verified.');

        // --- CHECKPOINT 1: "MY MATCHES" LOGIC ---
        console.log('--- CHECKING "MY MATCHES" LOGIC ---');

        async function checkMatches(name, token, expectCount) {
            const res = await axios.get(`${API_URL}/matches/user`, { headers: { Authorization: `Bearer ${token}` } });
            const count = res.data.length;
            const hasMatch = res.data.some(m => m.id === matchId);
            console.log(`   ${name} sees ${count} matches. Has target match? ${hasMatch}`);

            if (expectCount > 0 && !hasMatch) console.error(`❌ ${name} SHOULD see the match but didn't!`);
            if (expectCount === 0 && hasMatch) console.error(`❌ ${name} SHOULD NOT see the match but did!`);
        }

        await checkMatches('Owner', ownerToken, 1);
        await checkMatches('Finder', finderToken, 1);
        await checkMatches('Random User', otherToken, 0);

        // --- CHECKPOINT 2: CS CREDITS (BEFORE COLLECTION) ---
        console.log('--- CHECKING CS CREDITS (Intermediate) ---');
        const finderCredits1 = await getCredits(finderId);
        console.log(`   Finder Credits (After Match Verify): ${finderCredits1} (Prev: ${initialCredits})`);

        // 6. Claim Item (Owner)
        console.log('6. Owner Claiming Item...');
        await axios.post(`${API_URL}/claims`, {
            match_id: matchId,
            proof_description: 'It is mine'
        }, { headers: { Authorization: `Bearer ${ownerToken}` } });

        // 7. Admin Verifies Collection (Closes Case)
        console.log('7. Admin Verifying Collection (Closing Case)...');
        await axios.post(`${API_URL}/claims/condition`, {
            match_id: matchId,
            damage_found: false,
            damage_notes: 'All good'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log('   Case Closed.');

        // --- CHECKPOINT 3: CS CREDITS (FINAL) ---
        console.log('--- CHECKING CS CREDITS (Final) ---');
        const finderCredits2 = await getCredits(finderId);
        console.log(`   Finder Credits (Final): ${finderCredits2}`);

        console.log('--- TEST COMPLETE ---');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        process.exit(1);
    }
}

testFullFlow();
