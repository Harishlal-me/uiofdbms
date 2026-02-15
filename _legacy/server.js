const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route helper
const sendHtml = (res, filename) => {
    res.sendFile(path.join(__dirname, 'views', filename));
};

// Routes
app.get('/', (req, res) => sendHtml(res, 'index.html'));
app.get('/login', (req, res) => sendHtml(res, 'login.html'));
app.get('/register', (req, res) => sendHtml(res, 'register.html'));
app.get('/dashboard', (req, res) => sendHtml(res, 'dashboard.html'));
app.get('/report-lost', (req, res) => sendHtml(res, 'report-lost.html'));
app.get('/report-found', (req, res) => sendHtml(res, 'report-found.html'));
app.get('/browse', (req, res) => sendHtml(res, 'browse.html'));
app.get('/match-details', (req, res) => sendHtml(res, 'match-details.html'));
app.get('/claim', (req, res) => sendHtml(res, 'claim.html'));
app.get('/admin', (req, res) => sendHtml(res, 'admin.html'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
