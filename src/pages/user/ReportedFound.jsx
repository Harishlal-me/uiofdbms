import { useEffect, useState } from 'react';
import { Card, Badge } from '../../components/ui/Primitives';
import { MapPin, Calendar, Award } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ReportedFound() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/found');
                const myReports = user ? res.data.filter(r => r.user_id == user.id) : res.data;
                setReports(myReports);
            } catch (error) {
                console.error("Failed to fetch found reports:", error);
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
                    <h1 className="text-2xl font-bold text-slate-900">Reported Found Items</h1>
                    <p className="text-slate-500 text-sm">Items you have found and submitted.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {reports.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No items reported yet.
                    </div>
                ) : (
                    reports.map(report => (
                        <Card key={report.found_id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={report.found_photo_url || `https://placehold.co/200x200/dcfce7/166534?text=${report.item_name}`}
                                            className="w-full h-full object-cover"
                                            alt={report.item_name}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{report.item_name}</h3>
                                        <div className="text-sm text-slate-500 mt-1">{new Date(report.found_date).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={report.status === 'Resolved' ? 'success' : 'info'}>
                                                {report.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                        <Award size={12} /> +10 Credits
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
