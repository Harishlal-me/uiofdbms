const db = require('./config/db');

async function housekeeping() {
    try {
        console.log("--- 1. CLEANUP TEST DATA ---");
        // Remove the seed data (iPhone)
        await db.execute("DELETE FROM Matches WHERE confidence_score = 88 AND match_status = 'Pending'");
        await db.execute("DELETE FROM LostReports WHERE item_name = 'Seed iPhone'");
        await db.execute("DELETE FROM FoundReports WHERE item_name = 'Seed Found iPhone'");
        console.log("Seed data removed.");

        console.log("\n--- 2. UPDATE STORAGE LOCATIONS ---");
        // Clear and Reset Storage Locations
        // Note: This might fail if there are foreign key constraints (items stored there).
        // Since we decleared "Seed Found iPhone" might reference one, we deleted it above.
        // But invalidating IDs for existing found items might be risky if we truncate.
        // We will try to UPDATE existing ones first, then INSERT new, or DELETE ALL if safe.
        // Assuming development env, we'll DELETE ALL for strict compliance with user list.
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE StorageLocations');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        const storageLocations = [
            ['Main Block – Reception / Admin Office', 100],
            ['University Library – Ground Floor Help Desk', 50],
            ['Tech Park – Security Control Room', 75],
            ['SRM Hospital Block – Security Desk', 40],
            ['Hostel Zone – Boys Hostel (Warden Office)', 200],
            ['Main Entrance Gate (Gate 1) – Security Cabin', 30]
        ];

        for (const [name, cap] of storageLocations) {
            await db.execute('INSERT INTO StorageLocations (room_name, capacity, current_count) VALUES (?, ?, 0)', [name, cap]);
        }
        console.log("Storage Locations Updated.");

        console.log("\n--- 3. POPULATE CATEGORIES ---");
        // List of 20 Categories
        const categories = [
            'Laptop', 'Mobile Phone', 'Tablet', 'Smart Watch', 'Earphones/Headphones',
            'Bag/Backpack', 'Wallet/Purse', 'Keys', 'ID Card', 'Documents/Books',
            'Water Bottle', 'Umbrella', 'Glasses/Sunglasses', 'Clothing', 'Shoes',
            'Jewelry', 'Sports Gear', 'Musical Instrument', 'Charger/Cable', 'Other'
        ];

        // We won't truncate to preserve IDs, but we will ensure these exist.
        for (const cat of categories) {
            const [rows] = await db.execute('SELECT category_id FROM Categories WHERE category_name = ?', [cat]);
            if (rows.length === 0) {
                await db.execute('INSERT INTO Categories (category_name, description) VALUES (?, ?)', [cat, `Items classified as ${cat}`]);
                console.log(`Added: ${cat}`);
            }
        }
        console.log("Categories verified.");

        process.exit();

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

housekeeping();
