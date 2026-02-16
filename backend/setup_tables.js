require('dotenv').config();
const db = require('./config/db');

async function run() {
    try {
        console.log("--- Setup Tables Started ---");

        // 1. AuditLogs
        console.log("Creating AuditLogs...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS AuditLogs (
                log_id INT AUTO_INCREMENT PRIMARY KEY, 
                action VARCHAR(50), 
                table_name VARCHAR(50), 
                record_id INT, 
                changed_by INT, 
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                FOREIGN KEY (changed_by) REFERENCES Users(user_id) ON DELETE SET NULL
            )
        `);
        console.log("AuditLogs created.");

        // 2. Notifications
        console.log("Creating Notifications...");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Notifications (
                notification_id INT AUTO_INCREMENT PRIMARY KEY, 
                user_id INT, 
                match_id INT, 
                message TEXT, 
                type VARCHAR(20) DEFAULT 'info', 
                is_read BOOLEAN DEFAULT FALSE, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE, 
                FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE SET NULL
            )
        `);
        console.log("Notifications created.");

        console.log("--- Setup Tables Finished ---");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

run();
