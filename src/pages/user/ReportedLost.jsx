import { useEffect, useState } from 'react';
import { Card, Badge, Button } from '../../components/ui/Primitives';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ReportedLost() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/lost');
                // Filter for current user
                // const myReports = res.data.filter(r => r.user_id === user?.id); 
                // For now, let's show ALL reports to debugging easier, or if auth user id mismatch. 
                // Actually, let's filter if user is logged in.
                const myReports = user ? res.data.filter(r => r.user_id == user.id) : res.data;
                setReports(myReports);
            } catch (error) {
                console.error("Failed to fetch lost reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reported Lost Items</h1>
                    <p className="text-slate-500 text-sm">Track the status of items you have reported lost.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {reports.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No items reported yet.
                    </div>
                ) : (
                    reports.map(report => (
                        <Card key={report.lost_id} className="p-0 overflow-hidden flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-48 md:h-auto bg-slate-200 relative flex-shrink-0">
                                <img
                                    src={report.photo_url || `https://placehold.co/400x400/e2e8f0/64748b?text=${report.item_name}`}
                                    className="w-full h-full object-cover"
                                    alt={report.item_name}
                                />
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{report.item_name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {report.location_name || 'Campus'}</span>
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(report.lost_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Badge variant={report.status === 'Resolved' ? 'success' : 'warning'}>
                                        {report.status}
                                    </Badge>
                                </div>
                                <div className="mt-4 text-sm text-slate-600">
                                    {report.description}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
