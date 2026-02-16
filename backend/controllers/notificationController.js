const db = require('../config/db');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute(
            'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [userId]
        );

        // Map to frontend expectation if needed (or just return as is if schema matches)
        // Frontend expects: { id, text, time, read, type }
        // DB has: notification_id, user_id, message, type, is_read, created_at

        const notifications = rows.map(n => ({
            id: n.notification_id,
            match_id: n.match_id,
            text: n.message,
            time: new Date(n.created_at).toLocaleString(), // Simple formatting
            read: n.is_read === 1,
            type: n.type || 'info'
        }));

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        await db.execute(
            'UPDATE Notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
            [notificationId, userId]
        );

        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.execute(
            'UPDATE Notifications SET is_read = 1 WHERE user_id = ?',
            [userId]
        );

        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
