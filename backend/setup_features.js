const db = require('./config/db');

async function setupDB() {
    try {
        // 1. Check Users Schema
        console.log("--- Users Schema ---");
        const [usersCols] = await db.execute('SHOW COLUMNS FROM Users');
        const hasCredits = usersCols.some(c => c.Field === 'cs_credits');
        console.log(`Has cs_credits: ${hasCredits}`);

        if (!hasCredits) {
            console.log("Adding cs_credits to Users...");
            await db.execute('ALTER TABLE Users ADD COLUMN cs_credits INT DEFAULT 0');
        }

        // 2. Create Notifications Table
        console.log("--- Creating Notifications Table ---");
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Notifications (
                notification_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        `);
        console.log("Notifications table ready.");

        // 3. Check Matches Schema for verification columns
        console.log("--- Matches Schema ---");
        const [matchCols] = await db.execute('SHOW COLUMNS FROM Matches');
        // Ensure admin_verified, admin_id, verification_notes, verified_at exist
        const fields = matchCols.map(c => c.Field);
        const missing = ['admin_verified', 'admin_id', 'verification_notes', 'verified_at'].filter(f => !fields.includes(f));

        if (missing.length > 0) {
            console.log(`Missing Matches columns: ${missing.join(', ')}`);
            // Add them if missing
            await db.execute(`
                ALTER TABLE Matches 
                ADD COLUMN admin_verified BOOLEAN DEFAULT FALSE,
                ADD COLUMN admin_id INT,
                ADD COLUMN verification_notes TEXT,
                ADD COLUMN verified_at TIMESTAMP NULL
            `);
            console.log("Added missing Matches columns.");
        } else {
            console.log("Matches table has all verification columns.");
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

setupDB();
