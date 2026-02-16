import { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../../components/ui/Primitives';
import { CircleCheck, MapPin, Calendar, User, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MyMatches = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                console.log("Fetching matches...");
                const res = await api.get('/matches/user');
                console.log("Matches fetched:", res.data);

                // Ensure response is array
                if (Array.isArray(res.data)) {
                    setMatches(res.data);
                    setError(null);
                } else {
                    console.error("Matches response is not an array:", res.data);
                    setMatches([]);
                    setError(null); // Not an error, just empty
                }
            } catch (err) {
                console.error("Failed to fetch matches:", err);
                const errorMsg = err.response?.data?.message || err.message || "Failed to load matches";
                setError(errorMsg);
                setMatches([]); // Ensure matches is always an array
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-slate-500">Loading your matches...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-8">
                <Card className="p-6 border-l-4 border-l-red-500">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-bold text-red-900">Error Loading Matches</h3>
                            <p className="text-red-700 mt-1">{error}</p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="mt-4"
                                variant="secondary"
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Verified Matches</h1>
                    <p className="text-slate-500 text-sm">Review matches confirmed by Admins and proceed with claims.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {(!matches || matches.length === 0) ? (
                    <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CircleCheck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No matches yet</h3>
                        <p className="text-slate-500 mt-2">When items you lost or found are verified as matches, they will appear here.</p>
                    </div>
                ) : (
                    matches.map((match, index) => {
                        // Safety checks for each match
                        if (!match || !match.id) {
                            console.warn("Skipping invalid match at index", index, match);
                            return null;
                        }

                        return (
                            <Card key={match.id} className="p-0 overflow-hidden border-l-4 border-l-green-500">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                                        {/* Found Item Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="success" className="px-3 py-1">VERIFIED MATCH</Badge>
                                                <span className="text-xs text-slate-400">
                                                    ID: #{match.id} • {match.verified_at ? new Date(match.verified_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>

                                            <div className="flex gap-4">
                                                <img
                                                    src={match.found?.img || `https://placehold.co/100x100?text=${encodeURIComponent(match.found?.name || 'Item')}`}
                                                    alt="Found Item"
                                                    className="w-20 h-20 rounded-lg object-cover bg-slate-100"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                                />
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-900">{match.found?.name || 'Unknown Item'}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                                        <MapPin size={14} className="text-indigo-500" />
                                                        Stored at: <span className="font-medium text-indigo-700">{match.found?.storage || 'N/A'}</span>
                                                    </div>
                                                    {match.role === 'loser' && (
                                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                            <User size={14} />
                                                            Found by: {match.found?.user || 'Unknown'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="flex flex-col items-end justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Role</div>
                                                <div className="font-medium text-slate-700">
                                                    {match.role === 'loser' ? 'Owner (Lost Item)' : 'Finder (Found Item)'}
                                                </div>
                                            </div>

                                            {match.role === 'loser' ? (
                                                <Button
                                                    onClick={() => navigate(`/claim/${match.id}`)}
                                                    className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                                                >
                                                    Claim Item <ArrowRight size={16} className="ml-2" />
                                                </Button>
                                            ) : (
                                                <div className="text-sm text-slate-500 text-right bg-slate-50 p-2 rounded">
                                                    Waiting for owner to claim.
                                                    <br />You've earned <b>+50 CS Credits</b>!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default MyMatches;
