const db = require('./config/db');

async function alterTable() {
    try {
        console.log("Adding storage_location_id to FoundReports...");

        // Add column if not exists (using try-catch as IF NOT EXISTS for ADD COLUMN is version dependent or complex)
        try {
            await db.execute('ALTER TABLE FoundReports ADD COLUMN storage_location_id INT DEFAULT NULL');
            console.log("Column added.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Column already exists.");
            } else {
                throw e;
            }
        }

        // Add FK constraint? Maybe skip for speed and to avoid strict constraint errors if data is messy, 
        // but good practice. Let's skip constraint for now to avoid "Cannot add foreign key constraint" if IDs mismatch.
        // Just column is enough for the JOIN to work.

        // Update existing report #1
        console.log("Updating FoundReport #1...");
        await db.execute('UPDATE FoundReports SET storage_location_id = 1 WHERE found_id = 1');
        console.log("Updated FoundReport #1 to use Storage Location 1.");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

alterTable();
