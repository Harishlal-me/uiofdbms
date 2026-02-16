
const axios = require('axios');

async function testUserFlow() {
    const email = `testuser_${Date.now()}@srm.edu`;
    const password = 'password123';

    try {
        // 1. Register
        console.log(`Registering ${email}...`);
        await axios.post('http://localhost:5000/api/users/register', {
            name: 'Test Student',
            email: email,
            password: password,
            role: 'student', // or 'user' depending on schema
            phone: '1234567890'
        });
        console.log('✅ Registration Successful');

        // 2. Login
        console.log('Testing Login...');
        const res = await axios.post('http://localhost:5000/api/users/login', {
            email: email,
            password: password
        });

        console.log('✅ Login Successful');
        console.log('Role:', res.data.user.role);

        if (res.data.user.role !== 'admin') {
            console.log('✅ Verified as Non-Admin User');
        } else {
            console.log('❌ Unexpected role:', res.data.user.role);
        }

    } catch (error) {
        console.error('❌ Failed:', error.response?.data || error.message);
    }
}

testUserFlow();
