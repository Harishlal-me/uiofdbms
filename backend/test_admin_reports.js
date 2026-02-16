
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

async function testAdminReports() {
    try {
        console.log('--- TEST ADMIN REPORTS ---');
        const timestamp = Date.now();
        const adminEmail = `admin_test_${timestamp}@campussafe.com`;

        // 0. Register Admin
        console.log('0. Registering new Admin...');
        try {
            await axios.post(`${API_URL}/users/register`, {
                name: 'Test Admin',
                email: adminEmail,
                password: 'password123',
                role: 'admin',
                phone: '1234567890' // Crucial for NOT NULL constraint
            });
            console.log('   Admin registered.');
        } catch (regError) {
            console.log('   Registration skipped (maybe exists or error):', regError.response?.data || regError.message);
        }

        // 1. Login as Admin
        console.log('1. Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/users/login`, {
            email: adminEmail,
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('   Admin logged in.');

        // 2. Fetch Closed Cases
        console.log('2. Fetching Closed Cases...');
        const reportsRes = await axios.get(`${API_URL}/admin/reports/closed`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   Found ${reportsRes.data.length} closed cases.`);

        if (reportsRes.data.length === 0) {
            console.log('   ⚠️ No closed cases found. Cannot test PDF generation.');
            return;
        }

        const caseId = reportsRes.data[0].match_id;
        console.log(`   Testing PDF generation for Case ID: ${caseId}`);

        // 3. Download PDF
        console.log('3. Downloading PDF...');
        const pdfRes = await axios.get(`${API_URL}/admin/reports/${caseId}/pdf`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer' // Important
        });

        console.log(`   PDF Size: ${pdfRes.data.length} bytes`);

        // Save to file
        const outputPath = path.join(__dirname, `test_report_${caseId}.pdf`);
        fs.writeFileSync(outputPath, pdfRes.data);
        console.log(`   PDF saved to ${outputPath}`);
        console.log('✅ TEST PASSED');

    } catch (error) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
    }
}

testAdminReports();
