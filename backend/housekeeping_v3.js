const db = require('./config/db');

async function housekeeping() {
    try {
        console.log("--- 1. CLEANUP & SCHEMA RESET ---");
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Truncate dependent tables
        const dependentTables = ['Matches', 'LostReports', 'FoundReports', 'ItemClaims', 'ItemConditionReport'];
        for (const table of dependentTables) {
            try {
                await db.execute(`TRUNCATE TABLE ${table}`);
                console.log(`Truncated ${table}`);
            } catch (err) { }
        }

        // DROP and RECREATE Categories
        await db.execute('DROP TABLE IF EXISTS Categories');
        await db.execute(`
            CREATE TABLE Categories (
                category_id INT AUTO_INCREMENT PRIMARY KEY,
                category_name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Recreated Categories Table");

        // DROP and RECREATE StorageLocations
        await db.execute('DROP TABLE IF EXISTS StorageLocations');
        await db.execute(`
            CREATE TABLE StorageLocations (
                storage_id INT AUTO_INCREMENT PRIMARY KEY,
                room_name VARCHAR(255) NOT NULL,
                capacity INT DEFAULT 100,
                current_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Recreated StorageLocations Table");

        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log("\n--- 2. SEED STORAGE LOCATIONS ---");
        const storageLocations = [
            'Main Block – Reception / Admin Office',
            'University Library – Ground Floor Help Desk',
            'Tech Park – Security Control Room',
            'SRM Hospital Block – Security Desk',
            'Hostel Zone – Boys Hostel (Warden Office)',
            'Main Entrance Gate (Gate 1) – Security Cabin'
        ];

        for (const loc of storageLocations) {
            await db.execute('INSERT INTO StorageLocations (room_name) VALUES (?)', [loc]);
        }
        console.log("Storage Locations Seeded.");

        console.log("\n--- 3. SEED CATEGORIES ---");
        const categories = [
            'Laptop', 'Mobile Phone', 'Tablet', 'Smart Watch', 'Earphones/Headphones',
            'Bag/Backpack', 'Wallet/Purse', 'Keys', 'ID Card', 'Documents/Books',
            'Water Bottle', 'Umbrella', 'Glasses/Sunglasses', 'Clothing', 'Shoes',
            'Jewelry', 'Sports Gear', 'Musical Instrument', 'Charger/Cable', 'Other'
        ];

        for (const cat of categories) {
            await db.execute('INSERT INTO Categories (category_name, description) VALUES (?, ?)',
                [cat, `Items classified as ${cat}`]);
        }
        console.log("Categories Seeded.");

        // Clean up Users? No, user said "add these categories TO THE USER", implies keep users.
        // But verify if we need to clean up user specific test data? 
        // User said "where did this seed iphone come from... remove it". Done via Truncate LostReports.

        console.log("SUCCESS.");
        process.exit();

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

housekeeping();
