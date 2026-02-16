const db = require('./config/db');

async function updateStorage() {
    try {
        console.log("Clearing old storage locations...");
        await db.execute('DELETE FROM StorageLocations');

        const locations = [
            ['Main Block – Reception / Admin Office', 100],
            ['University Library – Ground Floor Help Desk', 50],
            ['Tech Park – Security Control Room', 75],
            ['SRM Hospital Block – Security Desk', 40],
            ['Hostel Zone – Boys Hostel (Warden Office)', 200],
            ['Main Entrance Gate (Gate 1) – Security Cabin', 30]
        ];

        console.log("Inserting new locations...");
        for (const [name, cap] of locations) {
            await db.execute('INSERT INTO StorageLocations (room_name, capacity, current_count) VALUES (?, ?, 0)', [name, cap]);
        }

        console.log("Storage Locations Updated!");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

updateStorage();
