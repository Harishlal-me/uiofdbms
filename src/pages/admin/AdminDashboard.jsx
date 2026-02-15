import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui/Primitives';
import {
    CheckCircle, XCircle, AlertTriangle, MapPin, Calendar,
    BrainCircuit, Box, User, ArrowRight, FileText, Activity,
    Clock, Search, Filter, Download, Database, Shield,
    BarChart3, RefreshCw, Zap
} from 'lucide-react';

export default function AdminDashboard() {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Live Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- MOCK DATA ---

    const kpiStats = [
        { label: 'Pending Verifications', value: '14', change: '+2', icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Matches Today', value: '8', change: '+15%', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Resolved Cases', value: '1,240', change: '+5%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Storage', value: '45', change: '-2%', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Damage Flags', value: '3', change: '0%', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Total Users', value: '8,450', change: '+120', icon: User, color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    const liveActivity = [
        { id: 1, text: 'Match #2940 Detected', time: 'Just now', status: 'pending', conf: 92 },
        { id: 2, text: 'Item #8821 Verified', time: '5 mins ago', status: 'verified', conf: 98 },
        { id: 3, text: 'Match #2935 Rejected', time: '12 mins ago', status: 'rejected', conf: 45 },
        { id: 4, text: 'New Lost Report #8825', time: '20 mins ago', status: 'info', conf: 0 },
        { id: 5, text: 'Storage Alert: Library', time: '1 hr ago', status: 'warning', conf: 0 },
    ];

    const storageStats = [
        { name: 'Security Main Office', used: 45, capacity: 50, status: 'Critical' },
        { name: 'Library Help Desk', used: 12, capacity: 40, status: 'Good' },
        { name: 'Hostel Office (A)', used: 28, capacity: 35, status: 'Warning' },
        { name: 'Student Center', used: 5, capacity: 100, status: 'Good' },
    ];

    const matchQueue = [
        {
            id: 2938,
            confidence: 94,
            lost: { name: 'Silver MacBook Air', loc: 'Library 2nd Floor', date: 'Oct 25', img: 'https://placehold.co/400x300/fee2e2/991b1b?text=Lost+MacBook', desc: 'Has NASA sticker on lid. Serial #A123.', user: 'Alex (Student)' },
            found: { name: 'Apple Laptop', loc: 'Cafeteria', date: 'Oct 26', img: 'https://placehold.co/400x300/dcfce7/166534?text=Found+Laptop', desc: 'Silver, found on table. Has sticker.', user: 'Guard John', storage_kept: 'Security Main Office' },
            reasons: [
                { text: 'High Text Similarity ("MacBook" ≈ "Apple Laptop")', score: 92 },
                { text: 'Description Match ("Sticker")', score: 98 },
                { text: 'Time Proximity (Found 1 day after Lost)', score: 95 }
            ]
        },
        {
            id: 2939,
            confidence: 88,
            lost: { name: 'Blue Backpack', loc: 'Gym', date: 'Oct 26', img: 'https://placehold.co/400x300/fee2e2/991b1b?text=Lost+Bag', desc: 'Jansport brand.', user: 'Sarah (Staff)' },
            found: { name: 'Blue Bag', loc: 'Locker Room', date: 'Oct 26', img: 'https://placehold.co/400x300/dcfce7/166534?text=Found+Bag', desc: 'Contains gym clothes.', user: 'Student Mike', storage_kept: 'Hostel Office (Block A)' },
            reasons: [
                { text: 'Category Match (Bags)', score: 100 },
                { text: 'Location Proximity (Gym <-> Locker Room)', score: 90 },
                { text: 'Color Match (Blue)', score: 85 }
            ]
        }
    ];

    const handleApprove = () => {
        alert("Match Verified! +50 CS Credits awarded to Finder. Owner notified.");
        setSelectedMatch(null);
    };

    // --- RENDER HELPERS ---

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
            warning: 'bg-amber-100 text-amber-700 border-amber-200',
            info: 'bg-slate-100 text-slate-700 border-slate-200',
        };
        return (
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${styles[status] || styles.info}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8 min-h-screen pb-10 font-sans text-slate-900">

            {/* 1. TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-indigo-50 shadow-sm sticky top-2 z-10">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Shield className="text-indigo-600" size={24} /> Security Operations Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 font-medium ml-8">Live monitoring of Lost & Found ecosystem</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-lg font-mono font-bold text-slate-700 leading-none">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">A</div>
                            <div className="hidden md:block">
                                <div className="text-sm font-bold text-slate-700 leading-none">Admin</div>
                                <div className="text-[10px] text-slate-500">Super User</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. KPI GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {kpiStats.map((stat, i) => (
                    <div key={i} className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={18} />
                            </div>
                            {stat.change !== '0%' && (
                                <span className={`text-[10px] font-bold ${stat.change.includes('+') ? 'text-emerald-600' : 'text-red-600'} bg-slate-50 px-1.5 py-0.5 rounded`}>
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                        <div className="text-xs text-slate-500 font-medium truncate">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN (2/3) - QUEUE & ACTIVITY */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Live Match Activity */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Activity size={18} className="text-indigo-500" /> Live Match Activity
                            </h3>
                            <button className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                <RefreshCw size={12} /> Auto-refresh
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {liveActivity.map((item) => (
                                <div key={item.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'verified' ? 'bg-emerald-500' : item.status === 'pending' ? 'bg-indigo-500' : item.status === 'info' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-700">{item.text}</div>
                                            <div className="text-[10px] text-slate-400">{item.time}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {item.conf > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.conf}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{item.conf}%</span>
                                            </div>
                                        )}
                                        <StatusBadge status={item.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verification Queue header */}
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Verification Queue</h2>
                            <p className="text-sm text-slate-500">Review AI-suggested object matches.</p>
                        </div>
                        <div className="flex gap-2 text-xs">
                            <Button size="sm" variant="secondary"><Filter size={14} className="mr-1" /> Filter</Button>
                            <Button size="sm" variant="secondary">Sort by: Confidence</Button>
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="space-y-4">
                        {matchQueue.map(match => (
                            <div key={match.id} className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                    {/* Images Comparison */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="relative">
                                            <img src={match.lost.img} className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                            <div className="absolute -top-2 -left-2 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200 shadow-sm">LOST</div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-2">
                                            <ArrowRight size={20} className="text-slate-300" />
                                            <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1">{match.confidence}%</div>
                                        </div>
                                        <div className="relative">
                                            <img src={match.found.img} className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                            <div className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 shadow-sm">FOUND</div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-bold text-slate-900 truncate">
                                                ID #{match.id}: {match.lost.name} <span className="text-slate-300 mx-2">|</span> {match.found.name}
                                            </h3>
                                            <span className="text-xs text-slate-400 font-mono">{match.lost.date}</span>
                                        </div>

                                        <div className="space-y-1 mb-3">
                                            {match.reasons.slice(0, 2).map((r, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                                    <CheckCircle size={12} className="text-indigo-500" />
                                                    {r.text}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-50">
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {match.lost.loc}</span>
                                            <ArrowRight size={12} className="text-slate-300" />
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {match.found.loc}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-2 border-l border-slate-100 pl-6 shrink-0">
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-full" onClick={() => setSelectedMatch(match)}>Review</Button>
                                        <Button size="sm" variant="ghost" className="w-full text-xs text-slate-400">Dimiss</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN (1/3) - WIDGETS */}
                <div className="space-y-6">

                    {/* 3. QUICK ACTIONS */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="h-auto py-3 flex-col gap-2 text-xs hover:border-indigo-200 hover:text-indigo-700">
                            <Database size={18} /> Export Data
                        </Button>
                        <Button variant="secondary" className="h-auto py-3 flex-col gap-2 text-xs hover:border-indigo-200 hover:text-indigo-700">
                            <Box size={18} /> Add Storage
                        </Button>
                    </div>

                    {/* 4. STORAGE OVERVIEW WIDGET */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Box size={18} className="text-indigo-600" /> Storage Overview
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-5">
                                {storageStats.map((loc, i) => {
                                    const percentage = Math.round((loc.used / loc.capacity) * 100);
                                    let color = 'bg-emerald-500';
                                    if (percentage > 85) color = 'bg-red-500';
                                    else if (percentage > 70) color = 'bg-amber-500';

                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-slate-700">{loc.name}</span>
                                                <span className="text-slate-500 text-xs">{loc.used}/{loc.capacity} items</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 5. ANALYTICS PREVIEW WIDGET */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-600" /> 7-Day Trend
                        </h3>
                        {/* CSS-only Chart */}
                        <div className="flex items-end justify-between h-32 gap-2 mt-2">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-600"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono uppercase">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Lost
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-200"></span> Found
                            </div>
                            <button className="text-indigo-600 font-medium hover:underline">View Report</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL: VERIFICATION DETAIL (Enhanced) */}
            {selectedMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Verify Match ID #{selectedMatch.id}</h3>
                                <p className="text-xs text-slate-500">Review textual and metadata similarities.</p>
                            </div>
                            <button onClick={() => setSelectedMatch(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                            <div className="grid grid-cols-3 gap-6">
                                {/* Lost */}
                                <Card className="p-4 border-l-4 border-l-red-500">
                                    <Badge variant="danger" className="mb-2">LOST ITEM</Badge>
                                    <h4 className="font-bold text-lg">{selectedMatch.lost.name}</h4>
                                    <p className="text-sm text-slate-600 mt-2 mb-4 bg-slate-50 p-2 rounded border border-slate-100 italic">"{selectedMatch.lost.desc}"</p>
                                    <img src={selectedMatch.lost.img} className="w-full h-40 object-cover rounded-lg mb-4" />
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-slate-500">Reporter</span>
                                            <span className="font-medium">{selectedMatch.lost.user}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-slate-500">Location</span>
                                            <span className="font-medium">{selectedMatch.lost.loc}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Date</span>
                                            <span className="font-medium">{selectedMatch.lost.date}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Found */}
                                <Card className="p-4 border-l-4 border-l-emerald-500">
                                    <Badge variant="success" className="mb-2">FOUND ITEM</Badge>
                                    <h4 className="font-bold text-lg">{selectedMatch.found.name}</h4>
                                    <p className="text-sm text-slate-600 mt-2 mb-4 bg-slate-50 p-2 rounded border border-slate-100 italic">"{selectedMatch.found.desc}"</p>
                                    <img src={selectedMatch.found.img} className="w-full h-40 object-cover rounded-lg mb-4" />
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-slate-500">Reporter</span>
                                            <span className="font-medium">{selectedMatch.found.user}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                                            <span className="text-slate-500">Location</span>
                                            <span className="font-medium">{selectedMatch.found.loc}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Date</span>
                                            <span className="font-medium">{selectedMatch.found.date}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Analysis */}
                                <div className="space-y-6">
                                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Rule-Based Similarity Score</div>
                                            <div className="text-5xl font-bold mb-4">{selectedMatch.confidence}%</div>
                                            <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden mb-4">
                                                <div className="h-full bg-indigo-400" style={{ width: `${selectedMatch.confidence}%` }}></div>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedMatch.reasons.map((r, i) => (
                                                    <div key={i} className="flex gap-2 text-xs text-indigo-100">
                                                        <CheckCircle size={12} className="shrink-0 mt-0.5" />
                                                        <span>{r.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4">Storage Verification</h4>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                                            <div className="text-xs text-slate-500 uppercase mb-1">Item currently at</div>
                                            <div className="font-bold text-lg text-indigo-700 flex items-center gap-2">
                                                <Box size={18} /> {selectedMatch.found.storage_kept}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">Reject</Button>
                                            <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 text-white">
                                                Confirm Match
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
