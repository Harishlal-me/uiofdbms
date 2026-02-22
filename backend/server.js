const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('CampusSafe Backend API is running...');
});

// Import Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/lost', require('./routes/lostRoutes'));
app.use('/api/found', require('./routes/foundRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/storage', require('./routes/storageRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/audit-logs', require('./routes/auditRoutes'));
app.use('/api/admin/reports', require('./routes/adminReportRoutes'));

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;