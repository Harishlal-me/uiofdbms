require('dotenv').config();
const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login with hakar@srm.edu...\n');

        const response = await axios.post('http://localhost:5000/api/users/login', {
            email: 'hakar@srm.edu',
            password: 'pass-hakar123'
        });

        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('User:', JSON.stringify(response.data.user, null, 2));
        console.log('Token:', response.data.token.substring(0, 30) + '...');

    } catch (error) {
        console.error('❌ LOGIN FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received from server');
            console.error('Request:', error.request);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
