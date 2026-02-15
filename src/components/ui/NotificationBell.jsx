import { Bell, Check, Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

export default function NotificationBell() {
    const { notifications, unreadCount, isOpen, toggleDropdown, closeDropdown, markAsRead, markAllAsRead } = useNotifications();
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    // Close on click outside (Handling Portal)
    useEffect(() => {
        function handleClickOutside(event) {
            // If click is inside dropdown OR inside the toggle button, do nothing
            if (
                (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
                (buttonRef.current && buttonRef.current.contains(event.target))
            ) {
                return;
            }
            closeDropdown();
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, closeDropdown]);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-emerald-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
            case 'alert': return <Bell size={16} className="text-indigo-500" />;
            case 'credit': return <Zap size={16} className="text-yellow-500" />;
            default: return <Info size={16} className="text-slate-400" />;
        }
    };

    // Portal Content
    const dropdownContent = (
        <div
            ref={dropdownRef}
            className="fixed top-[70px] right-6 w-80 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right"
            style={{ position: 'fixed', top: '70px', right: '24px', zIndex: 9999 }}
        >
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700">
                        Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        <Bell className="mx-auto mb-2 opacity-20" />
                        No notifications
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={clsx(
                                    "p-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer",
                                    !notif.read ? "bg-indigo-50/30" : ""
                                )}
                            >
                                <div className="mt-0.5 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-slate-100 h-fit">
                                    {getIcon(notif.type)}
                                </div>
                                <div>
                                    <p className={clsx("text-sm", !notif.read ? "font-semibold text-slate-800" : "text-slate-600")}>
                                        {notif.text}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                </div>
                                {!notif.read && (
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-slate-100 text-center">
                <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">View All</button>
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                )}
            </button>

            {isOpen && createPortal(dropdownContent, document.body)}
        </>
    );
}
