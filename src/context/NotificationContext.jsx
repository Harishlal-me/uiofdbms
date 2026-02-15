import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([
        { id: 1, text: "New Lost Item Report: Silver MacBook", time: "2 mins ago", read: false, type: "alert" },
        { id: 2, text: "Match Verified: Blue Bag", time: "1 hour ago", read: false, type: "success" },
        { id: 3, text: "Storage at 85% Capacity", time: "3 hours ago", read: true, type: "warning" },
        { id: 4, text: "System Audit Completed", time: "Yesterday", read: true, type: "info" },
        { id: 5, text: "You earned +10 CS Credits", time: "2 days ago", read: true, type: "credit" }
    ]);

    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (notif) => {
        setNotifications(prev => [{ id: Date.now(), read: false, time: "Just now", ...notif }, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isOpen,
            toggleDropdown,
            closeDropdown,
            markAsRead,
            markAllAsRead,
            addNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
