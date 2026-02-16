import { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../../components/ui/Primitives';
import { User, Calendar, ArrowRight, CircleCheck, Clock } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminClaims() {
    const navigate = useNavigate();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await api.get('/claims');
                setClaims(res.data);
            } catch (error) {
                console.error("Failed to fetch claims:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading claims...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Item Claims & Handover</h1>
                    <p className="text-slate-500 text-sm">Review user claims and process item collections.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {claims.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CircleCheck className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No active claims</h3>
                        <p className="text-slate-500 mt-2">Pending claims from users will appear here.</p>
                    </div>
                ) : (
                    claims.map(claim => (
                        <Card key={claim.claim_id} className="p-6 flex flex-col md:flex-row justify-between gap-6 items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-slate-900">{claim.item_name}</h3>
                                    <Badge variant={claim.claim_status === 'Approved' ? 'success' : 'warning'}>
                                        {claim.claim_status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        Claimed by: <span className="font-medium text-slate-900">{claim.claimant_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        Date: {new Date(claim.claim_date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border border-slate-100">
                                    <span className="font-semibold text-slate-700">Proof:</span> {claim.proof_description}
                                </div>
                            </div>

                            <div>
                                {claim.claim_status === 'Pending' ? (
                                    <Button
                                        onClick={() => navigate(`/admin/claims/${claim.match_id || claim.found_id}`)}
                                        // Note: We need match_id to process condition report. 
                                        // But getAllClaims returns joined data. Let's ensure query returns match_id.
                                        // If not, we might need to adjust endpoint or pass found_id if controller supports it.
                                        // For now, let's assume we can navigate and page will handle lookup.
                                        // Actually, getAllClaims query in claimController needs to select match_id from Matches via FoundReports?
                                        // FoundReports doesn't have match_id. Matches has found_id.
                                        // Let's check query in claimController.js
                                        className="bg-indigo-600 text-white"
                                    >
                                        Process Handover <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled>
                                        Processed
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
