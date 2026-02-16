const db = require('./config/db');

async function applyFeatures() {
    try {
        console.log("Applying DBMS Features...");

        // 1. VIEW: Pending Matches View (Simplifies querying for admin)
        await db.execute(`DROP VIEW IF EXISTS PendingMatchesView`);
        await db.execute(`
            CREATE VIEW PendingMatchesView AS
            SELECT 
                m.match_id, 
                m.confidence_score as percentage, 
                l.item_name as lost_item, 
                f.item_name as found_item,
                m.created_at
            FROM Matches m
            JOIN LostReports l ON m.lost_id = l.lost_id
            JOIN FoundReports f ON m.found_id = f.found_id
            WHERE m.match_status = 'Pending'
        `);
        console.log("Created View: PendingMatchesView");

        // 2. STORED FUNCTION: Calculate Days Since Lost
        // Note: MySQL functions require DELIMITER in CLI, but in Node execute() it's tricky.
        // We'll try standard creation.
        // If this fails due to multiple statements, we might need a workaround.
        // Simple functions might work.
        try {
            await db.execute(`DROP FUNCTION IF EXISTS DaysSinceLost`);
            await db.execute(`
                CREATE FUNCTION DaysSinceLost(lostDate DATE) RETURNS INT
                DETERMINISTIC
                BEGIN
                    RETURN DATEDIFF(NOW(), lostDate);
                END
            `);
            console.log("Created Function: DaysSinceLost");
        } catch (e) {
            console.log("Skipping Function creation (might need root/DELIMITER support): " + e.message);
        }

        // 3. TRIGGER: Auto-Update Storage Count when Found Item added?
        // Actually, we do this in application logic, but a trigger is "Academic".
        // Let's create a trigger that logs to a separate specialized log table or just updates a timestamp.
        // Or better: Update 'current_count' in StorageLocations when a FoundReport is added.
        // Only if we have storage_location_id in FoundReports.
        // I added it to the insert payload in controller, but does the table have the column?
        // Let's check columns first.

        // 4. AGGREGATE QUERY Test (Just ensuring it works)
        const [stats] = await db.execute(`
            SELECT 
                (SELECT COUNT(*) FROM LostReports) as total_lost,
                (SELECT COUNT(*) FROM FoundReports) as total_found,
                (SELECT COUNT(*) FROM Matches WHERE match_status='Approved') as solved
        `);
        console.log("Aggregate Query Test:", stats[0]);

        console.log("Done.");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

applyFeatures();
