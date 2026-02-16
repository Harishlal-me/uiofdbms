
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        console.log('=== REGISTER USER REQUEST ===');
        console.log('Body:', req.body);

        const { name, email, password, role, ra_reg_no } = req.body;
        const phone = req.body.phone || req.body.mobile || null;

        // Validate required fields
        if (!name || !email || !password) {
            console.error('Validation failed: Missing required fields');
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['name', 'email', 'password']
            });
        }

        // Check if user exists
        const [existingUser] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            console.log('Registration failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert User
        const [result] = await db.execute(
            'INSERT INTO Users (name, email, phone, password, role, ra_reg_no) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone, hashedPassword, role || 'student', ra_reg_no ? ra_reg_no.toUpperCase() : null]
        );

        console.log('✅ User registered successfully:', result.insertId);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

    } catch (error) {
        console.error('❌ REGISTRATION ERROR:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('SQL State:', error.sqlState);
        console.error('SQL Message:', error.sqlMessage);

        res.status(500).json({
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        console.log('=== LOGIN REQUEST ===');
        console.log('Email:', req.body.email);

        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            console.error('Login failed: Missing credentials');
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Check user
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log('Login failed: User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Login failed: Invalid password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        console.log('✅ Login successful:', user.email);

        res.json({
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT user_id, name, email, phone, role, created_at FROM Users WHERE user_id = ?', [req.params.id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT user_id, name, email, phone, role, cs_credits, created_at FROM Users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// Get Current User Profile (Me)
exports.getMe = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT user_id, name, email, role, phone, cs_credits FROM Users WHERE user_id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
