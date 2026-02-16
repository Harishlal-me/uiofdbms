const db = require('./config/db');

async function debugVerify() {
    console.log("Starting Debug Verify...");
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        console.log("Transaction Started");

        const id = 1; // Match ID
        const admin_id = 1;
        const notes = 'Debug Verify';
        const action = 'approve';

        const status = action === 'approve' ? 'Verified' : 'Rejected';
        const adminVerified = action === 'approve' ? 1 : 0;

        console.log("1. Updating Match Status...");
        await connection.execute(
            'UPDATE Matches SET match_status = ?, admin_verified = ?, admin_id = ?, verification_notes = ?, verified_at = NOW() WHERE match_id = ?',
            [status, adminVerified, admin_id, notes, id]
        );
        console.log("Match Status Updated");

        if (action === 'approve') {
            console.log("2. Fetching Match Details...");
            const [matchRows] = await connection.execute('SELECT lost_id, found_id FROM Matches WHERE match_id = ?', [id]);

            if (matchRows.length > 0) {
                const { lost_id, found_id } = matchRows[0];
                console.log(`Match Found: Lost=${lost_id}, Found=${found_id}`);

                console.log("3. Fetching User IDs...");
                const [lostRows] = await connection.execute('SELECT user_id, item_name FROM LostReports WHERE lost_id = ?', [lost_id]);
                const [foundRows] = await connection.execute('SELECT user_id, item_name FROM FoundReports WHERE found_id = ?', [found_id]);

                const loser = lostRows[0];
                const finder = foundRows[0];

                console.log(`Loser: ${JSON.stringify(loser)}`);
                console.log(`Finder: ${JSON.stringify(finder)}`);

                if (finder && finder.user_id) {
                    console.log("4. Awarding Credits...");
                    await connection.execute('UPDATE Users SET cs_credits = cs_credits + 50 WHERE user_id = ?', [finder.user_id]);
                    console.log("Credits Awarded");

                    console.log("5. Notifying Finder...");
                    await connection.execute(
                        'INSERT INTO Notifications (user_id, message, type) VALUES (?, ?, ?)',
                        [finder.user_id, `Your found item report for "${finder.item_name}" has been verified! You earned +50 CS Credits.`, 'success']
                    );
                    console.log("Finder Notified");
                } else {
                    console.log("WARNING: Finder user_id is missing/null");
                }

                if (loser && loser.user_id) {
                    console.log("6. Notifying Loser...");
                    await connection.execute(
                        'INSERT INTO Notifications (user_id, message, type) VALUES (?, ?, ?)',
                        [loser.user_id, `Good news! A potential match for your "${loser.item_name}" has been verified. Please visit the admin office to claim it.`, 'info']
                    );
                    console.log("Loser Notified");
                }
            } else {
                console.log("No Match Found with ID " + id);
            }
        }

        await connection.commit();
        console.log("Transaction Committed Successfully");

    } catch (error) {
        await connection.rollback();
        console.error("Transaction Error:", error);
    } finally {
        connection.release();
        process.exit();
    }
}

debugVerify();
