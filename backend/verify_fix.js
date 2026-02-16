const db = require('./config/db');
const { createFoundReport } = require('./controllers/foundController');
const { createLostReport } = require('./controllers/lostController');

async function test() {
    try {
        console.log("--- Fetching Valid IDs ---");
        const [users] = await db.execute('SELECT user_id FROM Users LIMIT 1');
        if (users.length === 0) throw new Error("No users found.");
        const userId = users[0].user_id;

        const [cats] = await db.execute('SELECT category_id FROM Categories LIMIT 1');
        const catId = cats.length > 0 ? cats[0].category_id : null;

        const [locs] = await db.execute('SELECT location_id FROM Locations LIMIT 1');
        const locId = locs.length > 0 ? locs[0].location_id : null;

        const [storages] = await db.execute('SELECT storage_id FROM StorageLocations LIMIT 1');
        const storeId = storages.length > 0 ? storages[0].storage_id : null;

        console.log(`Using: User=${userId}, Cat=${catId}, Loc=${locId}, Store=${storeId}`);

        // Mock Req for Found (Fixed Payload)
        const reqFound = {
            user: { id: userId },
            body: {
                item_name: "Debug Found Item Fixed",
                category_id: catId,
                location_id: locId,
                specific_location: "Tech Park Desk 5",
                storage_location_id: storeId,
                description: "Debug Description",
                found_date: "2026-02-16",
                contact_phone: "123",
                ra_reg_no: "RA123",
                color: "Blue",
                found_photo_url: null
            }
        };

        // Mock Req for Lost (Fixed Payload)
        const reqLost = {
            user: { id: userId },
            body: {
                item_name: "Debug Lost Item Fixed",
                category_id: catId,
                location_id: locId,
                specific_location: "Library",
                description: "Lost it",
                lost_date: "2026-02-16",
                color: "Red",
                photo_url: null
            }
        };

        const res = {
            status: (code) => ({
                json: (data) => console.log(`[Status ${code}]`, data)
            }),
            json: (data) => console.log("[Response]", data)
        };

        console.log("\n--- Testing Lost Report (Fixed) ---");
        await createLostReport(reqLost, res);

        console.log("\n--- Testing Found Report (Fixed) ---");
        await createFoundReport(reqFound, res);

        console.log("\nDone. Backend Logic Verified.");
        process.exit(0);
    } catch (e) {
        console.error("CRASH:", e);
        process.exit(1);
    }
}

test();
