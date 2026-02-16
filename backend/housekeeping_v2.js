const db = require('./config/db');

async function housekeeping() {
    try {
        console.log("--- 1. TRUNCATE DATA ---");
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');

        const tables = ['Matches', 'LostReports', 'FoundReports', 'ItemClaims', 'ItemConditionReport', 'Categories', 'StorageLocations'];

        for (const table of tables) {
            try {
                await db.execute(`TRUNCATE TABLE ${table}`);
                console.log(`Truncated ${table}`);
            } catch (err) {
                console.log(`Skipped ${table} (maybe doesn't exist)`);
            }
        }

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

        for (let i = 0; i < storageLocations.length; i++) {
            // Using ID i+1 explicitly to prevent auto-inc gaps if any
            await db.execute('INSERT INTO StorageLocations (storage_id, room_name, capacity, current_count) VALUES (?, ?, ?, 0)',
                [i + 1, storageLocations[i], 100]);
        }
        console.log("Storage Locations Seeded.");

        console.log("\n--- 3. SEED CATEGORIES ---");
        const categories = [
            'Laptop', 'Mobile Phone', 'Tablet', 'Smart Watch', 'Earphones/Headphones',
            'Bag/Backpack', 'Wallet/Purse', 'Keys', 'ID Card', 'Documents/Books',
            'Water Bottle', 'Umbrella', 'Glasses/Sunglasses', 'Clothing', 'Shoes',
            'Jewelry', 'Sports Gear', 'Musical Instrument', 'Charger/Cable', 'Other'
        ];

        for (let i = 0; i < categories.length; i++) {
            await db.execute('INSERT INTO Categories (category_id, category_name, description) VALUES (?, ?, ?)',
                [i + 1, categories[i], `Items classified as ${categories[i]}`]);
        }
        console.log("Categories Seeded.");

        // Create Admin User if not exists? (Preserving Users table, so skipping)

        process.exit();

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

housekeeping();
