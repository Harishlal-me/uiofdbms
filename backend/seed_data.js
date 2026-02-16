const db = require('./config/db');

async function seedData() {
    try {
        console.log("1. Getting Valid IDs...");

        // Ensure User
        let [users] = await db.execute('SELECT user_id FROM Users LIMIT 1');
        let userId;
        if (users.length === 0) {
            console.log("No users found. Creating Admin...");
            // Added phone number '1234567890'
            const [res] = await db.execute("INSERT INTO Users (name, email, phone, password, role) VALUES ('Admin', 'admin@campus.safe', '1234567890', 'hashedpass', 'super_admin')");
            userId = res.insertId;
        } else {
            userId = users[0].user_id;
        }
        console.log(`Using User ID: ${userId}`);

        // Get Category
        const [cats] = await db.execute('SELECT category_id FROM Categories LIMIT 1');
        if (cats.length === 0) throw new Error("No Categories found! Run migration.");
        const catId = cats[0].category_id;

        // Get Location
        const [locs] = await db.execute('SELECT location_id FROM Locations LIMIT 1');
        if (locs.length === 0) throw new Error("No Locations found! Run migration.");
        const locId = locs[0].location_id;

        // Get Storage Location
        let storageId = 1;
        const [storage] = await db.execute('SELECT storage_id FROM StorageLocations LIMIT 1');
        if (storage.length > 0) {
            storageId = storage[0].storage_id;
        } else {
            console.log("No Storage found, using ID 1 (risk of FK failure if strictly enforced)");
        }

        console.log(`Using Cat: ${catId}, Loc: ${locId}, Storage: ${storageId}`);

        console.log("2. Creating Lost Report...");
        const [lostRes] = await db.execute(
            'INSERT INTO LostReports (user_id, item_name, category_id, location_id, description, lost_date, color, photo_url, status) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
            [userId, 'Seed iPhone', catId, locId, 'Lost black iPhone via seed script', 'Black', 'https://placehold.co/400?text=Seed+Lost', 'Pending']
        );
        const lostId = lostRes.insertId;

        console.log(`Lost Report ID: ${lostId}`);

        console.log("3. Creating Found Report...");
        // Ensure location_id and category_id match Lost Report for potential auto-match
        // storage_location_id might be needed if schema has it?
        // foundController uses it, but let's check FoundReports table columns later if this fails.
        // For now, standardize standard columns.
        const [foundRes] = await db.execute(
            'INSERT INTO FoundReports (user_id, item_name, category_id, location_id, description, found_date, color, found_photo_url, status) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
            [userId, 'Seed Found iPhone', catId, locId, 'Found black iPhone matching seed', 'Black', 'https://placehold.co/400?text=Seed+Found', 'Pending']
        );
        const foundId = foundRes.insertId;
        console.log(`Found Report ID: ${foundId}`);

        console.log("4. Inserting Match...");
        // Check if created_at exists in Matches, if not remove it. 
        // Safer to let DB handle default timestamp if possible, but let's try with it first as prompt Schema imply it.
        await db.execute(
            'INSERT INTO Matches (lost_id, found_id, match_status, confidence_score) VALUES (?, ?, ?, ?)',
            [lostId, foundId, 'Pending', 88]
        );

        console.log("SUCCESS: Match Created.");
        process.exit();

    } catch (error) {
        console.error("Error Detail:", error.message);
        process.exit(1);
    }
}

seedData();
