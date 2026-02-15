import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, FileSearch, FilePlus, LogOut, Menu, X, Bell, User, CheckCircle, Award, MapPin, FileText } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../ui/Logo';
import NotificationBell from '../ui/NotificationBell';

export default function AppLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('userRole') || 'user';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) => clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
            onClick={() => setSidebarOpen(false)}
        >
            <Icon size={20} />
            <span>{label}</span>
            {/* Active Indicator Line */}
            {location.pathname === to && <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full" />}
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2 font-bold text-lg text-indigo-600">
                    <Menu className="cursor-pointer" onClick={() => setSidebarOpen(true)} />
                    CampusSafe
                </div>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                    {userRole[0].toUpperCase()}
                </div>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar Navigation */}
            <aside className={clsx(
                "fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-200 flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Logo />
                    <button className="ml-auto md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="text-slate-400" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 pt-2">Menu</div>

                    {userRole === 'admin' ? (
                        <>
                            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem to="/admin/verification-queue" icon={CheckCircle} label="Verification Queue" />
                            <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Management</div>
                            <NavItem to="/admin/items" icon={FileSearch} label="Item Database" />
                            <NavItem to="/admin/users" icon={User} label="Users" />
                            <NavItem to="/admin/storage" icon={MapPin} label="Storage Locations" />


                            <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">System</div>
                            <NavItem to="/admin/audit-logs" icon={FileText} label="Audit Logs" />
                            <NavItem to="/admin/analytics" icon={Award} label="Analytics" />
                        </>
                    ) : (
                        <>
                            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                            <div className="mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Actions</div>
                            <NavItem to="/report-lost" icon={FileSearch} label="Report Lost" />
                            <NavItem to="/report-found" icon={FilePlus} label="Report Found" />

                            <div className="mt-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">My Activity</div>
                            <NavItem to="/reported-lost" icon={Search} label="Reported Lost" />
                            <NavItem to="/reported-found" icon={CheckCircle} label="Reported Found" />
                            <NavItem to="/cs-credits" icon={Award} label="CS Credits" />
                        </>
                    )}


                </nav>

                {/* User Profile Snippet (Sidebar Footer) */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            {userRole === 'admin' ? 'AD' : 'ST'}
                        </div>
                        <div className="flex-1 min-w-0">
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header (Desktop) */}
                <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-10">
                    <div className="text-slate-500 text-sm">
                        Welcome back, <span className="font-semibold text-slate-900">{userRole === 'admin' ? 'Admin' : 'Alex'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />

                        <div className="w-px h-6 bg-slate-200 mx-2"></div>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold ring-2 ring-white shadow-sm">
                                {userRole[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
