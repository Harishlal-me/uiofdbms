
import axios from 'axios';

async function testRegister() {
    try {
        console.log("Attempting to register user...");
        const res = await axios.post('http://localhost:5000/api/users/register', {
            name: "Test User",
            email: "test" + Date.now() + "@example.com",
            phone: "1234567890",
            password: "password123",
            role: "student"
        });
        console.log("Success:", res.data);
    } catch (error) {
        if (error.response) {
            console.error("Server Error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Network Error (No Response):", error.message);
        } else {
            console.error("Config Error:", error.message);
        }
    }
}

testRegister();
