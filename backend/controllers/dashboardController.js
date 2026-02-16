
const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Counts
        const [lost] = await db.execute('SELECT COUNT(*) as count FROM LostReports WHERE status="Pending"');
        const [found] = await db.execute('SELECT COUNT(*) as count FROM FoundReports WHERE status="Pending"');
        const [matches] = await db.execute('SELECT COUNT(*) as count FROM Matches WHERE match_status="Pending"');
        const [resolved] = await db.execute('SELECT COUNT(*) as count FROM Matches WHERE match_status="Resolved"');
        const [users] = await db.execute('SELECT COUNT(*) as count FROM Users');
        const [storage] = await db.execute('SELECT SUM(current_count) as count FROM StorageLocations');

        // 2. Recent Activity (Audit Log)
        const [activity] = await db.execute(`
            SELECT a.log_id, a.action, a.table_name, a.changed_at, u.name as user_name
            FROM AuditLog a
            LEFT JOIN Users u ON a.changed_by = u.user_id
            ORDER BY a.changed_at DESC LIMIT 5
        `);

        res.json({
            kpi: {
                pendingLost: lost[0].count,
                pendingFound: found[0].count,
                pendingMatches: matches[0].count,
                casesResolved: resolved[0].count,
                totalUsers: users[0].count,
                activeStorage: storage[0].count || 0
            },
            activity: activity
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        // 1. Recovery Rate (Resolved Matches / Total Unique Lost Items)
        // Approximate: Resoved Matches / Total Lost
        const [lostCount] = await db.execute('SELECT COUNT(*) as c FROM LostReports');
        const [resolvedCount] = await db.execute('SELECT COUNT(*) as c FROM Matches WHERE match_status="Resolved"');

        const totalLost = lostCount[0].c || 1; // Avoid divide by zero
        const resolved = resolvedCount[0].c || 0;
        const recoveryRate = ((resolved / totalLost) * 100).toFixed(1);

        // 2. Items Processed (Total Lost + Total Found)
        const [foundCount] = await db.execute('SELECT COUNT(*) as c FROM FoundReports');
        const itemsProcessed = (lostCount[0].c || 0) + (foundCount[0].c || 0);

        // 3. Active Finders (Distinct Users who reported found items)
        const [findersCount] = await db.execute('SELECT COUNT(DISTINCT user_id) as c FROM FoundReports');
        const activeFinders = findersCount[0].c || 0;

        // 4. Category Distribution
        const [categories] = await db.execute(`
            SELECT c.category_name, COUNT(*) as count
            FROM LostReports l
            JOIN Categories c ON l.category_id = c.category_id
            GROUP BY c.category_name
        `);

        // 5. Monthly Trends (Mock logic for now as we don't have historical data spread over months)
        // We will just return 0s if empty, or current month data.
        // For now, let's return the real counts.

        res.json({
            recoveryRate,
            itemsProcessed,
            activeFinders,
            avgReturnTime: "0 Days", // Hard to calc without resolved_date column in Matches (assuming created_at update)
            categories
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
