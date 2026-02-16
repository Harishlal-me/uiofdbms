const db = require('../config/db');

exports.getAllAuditLogs = async (req, res) => {
    try {
        const [logs] = await db.execute(`
            SELECT 
                a.log_id, 
                a.action, 
                a.table_name, 
                a.record_id, 
                a.changed_at, 
                a.changed_by,
                u.name as user_name,
                u.role as user_role
            FROM auditlog a
            LEFT JOIN Users u ON a.changed_by = u.user_id
            ORDER BY a.changed_at DESC
            LIMIT 100
        `);

        res.json(logs);
    } catch (error) {
        console.error("Audit Log Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
