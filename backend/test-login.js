
const axios = require('axios');

async function testLogin() {
    try {
        console.log("Attempting login for hakar@srm.edu...");
        const res = await axios.post('http://localhost:5000/api/users/login', {
            email: "hakar@srm.edu",
            password: "hakar123"
        });
        console.log("Login Success!");
        console.log("Token:", res.data.token ? "Received" : "Missing");
        console.log("User Role:", res.data.user.role);
    } catch (error) {
        if (error.response) {
            console.error("Login Failed:", error.response.status, error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testLogin();
