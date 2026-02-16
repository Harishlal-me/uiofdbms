import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui/Primitives';
import {
    CircleCheck, CircleX, MapPin,
    User, ArrowRight, Search, Info, Settings, Package
} from 'lucide-react';

import api from '../../services/api';

export default function VerificationQueue() {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [filter, setFilter] = useState('all'); // all, high_conf, low_conf
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Matches
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await api.get('/matches');
                // Store ALL matches, filter in render
                setMatches(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching matches:", error);
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const filteredMatches = matches.filter(m => {
        // Resolved Tab: Show Verified/Rejected matches OR matches where items are resolved/matched
        if (filter === 'resolved') {
            return m.status === 'Verified' || m.status === 'Rejected' || m.lost.status === 'Resolved' || m.found.status === 'Resolved';
        }

        // Pending Views:
        // Exclude matches if the underlying items are already resolved/matched/returned
        // If an item is 'Resolved', it shouldn't appear in pending queue for *any* match.
        if (m.lost.status !== 'Pending' || m.found.status !== 'Pending') return false;

        // Ensure match itself is Pending
        if (m.status !== 'Pending') return false;

        if (filter === 'high_conf') return m.confidence >= 80;
        if (filter === 'med_conf') return m.confidence >= 30 && m.confidence < 80;
        if (filter === 'low_conf') return m.confidence < 30;

        return true; // filter === 'all'
    });

    const handleApprove = async () => {
        try {
            await api.put(`/matches/${selectedMatch.id}/verify`, {
                admin_id: 9, // TODO: Get from AuthContext
                action: 'approve',
                notes: 'Verified via Queue'
            });
            alert("Match Verified! +50 CS Credits awarded to Finder. Owner notified.");

            // Refresh logic: Update local state to 'Verified'
            setMatches(prev => prev.map(m =>
                m.id === selectedMatch.id ? { ...m, status: 'Verified' } : m
            ));
            setSelectedMatch(null);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleReject = async (matchId) => {
        if (!confirm("Are you sure you want to flag/ignore this match?")) return;
        try {
            await api.put(`/matches/${matchId}/verify`, {
                admin_id: 9,
                action: 'reject',
                notes: 'Flagged/Ignored by Admin'
            });

            // Refresh logic: Update local state to 'Rejected'
            setMatches(prev => prev.map(m =>
                m.id === matchId ? { ...m, status: 'Rejected' } : m
            ));
            if (selectedMatch?.id === matchId) setSelectedMatch(null);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
                    <p className="text-slate-500">Review and validate potential item matches detected by the system.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search ID or Item..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64"
                        />
                    </div>
                    <Button variant="secondary" className="gap-2">
                        <Settings size={16} /> Filters
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 border-b border-slate-200 pb-1">
                {['all', 'high_conf', 'med_conf', 'low_conf', 'resolved'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${filter === f
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {f === 'all' ? 'All Pending' :
                            f === 'high_conf' ? 'High Confidence (>80%)' :
                                f === 'med_conf' ? 'Needs Review (30-79%)' :
                                    f === 'low_conf' ? 'Low Confidence (<30%)' :
                                        'Resolved / History'}
                    </button>
                ))}
            </div>

            {/* Queue List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading matches...</div>
                ) : filteredMatches.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500">
                        {matches.length === 0 ? "No matches found." : "No matches fit current filter."}
                    </div>
                ) : filteredMatches.map(match => (
                    <div key={match.id} className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${match.confidence >= 90 ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>

                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            {/* Images Comparison */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="relative">
                                    <img src={match.lost?.img || 'https://placehold.co/100x100?text=No+Img'} className="w-24 h-24 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                    <div className="absolute -top-2 -left-2 bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200 shadow-sm">LOST</div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2">
                                    <ArrowRight size={24} className="text-slate-300" />
                                    <div className={`text-xs font-bold px-2 py-1 rounded mt-1 ${match.confidence >= 90 ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {match.confidence}%
                                    </div>
                                </div>
                                <div className="relative">
                                    <img src={match.found?.img || 'https://placehold.co/100x100?text=No+Img'} className="w-24 h-24 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                    <div className="absolute -top-2 -right-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 shadow-sm">FOUND</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 py-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 truncate">
                                        ID #{match.id}: {match.lost?.name || 'Unknown'} <span className="text-slate-300 mx-2">/</span> {match.found?.name || 'Unknown'}
                                    </h3>
                                    <span className="text-xs text-slate-400 font-mono">{match.lost?.date ? new Date(match.lost.date).toLocaleDateString() : 'N/A'}</span>
                                </div>

                                <div className="space-y-1 mb-4">
                                    {match.reasons?.map((r, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                            <CircleCheck size={12} className={match.confidence >= 90 ? "text-indigo-500" : "text-amber-500"} />
                                            {r.text}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 text-sm text-slate-500 pt-3 border-t border-slate-50">
                                    <span className="flex items-center gap-2"><MapPin size={14} className="text-red-400" /> Lost: <span className="font-medium text-slate-700">{match.lost?.desc || 'No desc'}</span></span>
                                    <span className="flex items-center gap-2"><MapPin size={14} className="text-emerald-400" /> Found: <span className="font-medium text-slate-700">{match.found?.desc || 'No desc'}</span></span>
                                    <span className="flex items-center gap-2"><Package size={14} className="text-indigo-400" /> Stored: <span className="font-medium text-slate-700">{match.found?.storage_kept || 'N/A'}</span></span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-center gap-3 border-l border-slate-100 pl-6 shrink-0 min-w-[140px]">
                                {match.status === 'Pending' ? (
                                    <>
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-full" onClick={() => setSelectedMatch(match)}>
                                            Review Match
                                        </Button>
                                        <Button size="sm" variant="secondary" className="w-full text-slate-500" onClick={() => handleReject(match.id)}>
                                            Flag / Ignore
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className={`text-xs font-bold uppercase px-2 py-1 rounded-full mb-2 ${match.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {match.status}
                                        </div>
                                        <Button size="sm" variant="ghost" className="w-full text-xs text-slate-400" onClick={() => setSelectedMatch(match)}>
                                            View Details
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* VERIFICATION MODAL (Reused logic) */}
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
                                <CircleX size={24} />
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
                                            <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Confidence Score</div>
                                            <div className="text-5xl font-bold mb-4">{selectedMatch.confidence}%</div>
                                            <div className="h-1.5 bg-indigo-800 rounded-full overflow-hidden mb-4">
                                                <div className="h-full bg-indigo-400" style={{ width: `${selectedMatch.confidence}%` }}></div>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedMatch.reasons.map((r, i) => (
                                                    <div key={i} className="flex gap-2 text-xs text-indigo-100">
                                                        <CircleCheck size={12} className="shrink-0 mt-0.5" />
                                                        <span>{r.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-4">Storage Verification</h4>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                                            <div className="text-xs text-slate-500 uppercase mb-1">Item currently stored at</div>
                                            <div className="font-bold text-lg text-indigo-700 flex items-center gap-2">
                                                <Package size={18} /> {selectedMatch.found.storage_kept}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                                <Info size={12} /> Finder has deposited or kept the item at this location.
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleReject(selectedMatch.id)}>Reject</Button>
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
