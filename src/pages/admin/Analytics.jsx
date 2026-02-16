import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../components/ui/Primitives';
import { TrendingUp, PieChart, Activity, Calendar, Download, Users, Package } from 'lucide-react';
import api from '../../services/api';

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/dashboard/analytics');
                setData(res.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;
    if (!data) return <div className="p-8 text-center text-slate-500">No data available</div>;

    const { recoveryRate, itemsProcessed, activeFinders, avgReturnTime, categories } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Platform Analytics</h1>
                    <p className="text-slate-500">Insights into item recovery details.</p>
                </div>
                <Button variant="secondary"><Download size={16} className="mr-2" /> Export Report</Button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><TrendingUp size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Recovery Rate</div>
                        <div className="text-xl font-bold text-slate-900">{recoveryRate}%</div>
                        <div className="text-xs text-emerald-600 font-bold">Real-time</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Package size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Items Processed</div>
                        <div className="text-xl font-bold text-slate-900">{itemsProcessed}</div>
                        <div className="text-xs text-slate-400">Total Lifetime</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Users size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Active Finders</div>
                        <div className="text-xl font-bold text-slate-900">{activeFinders}</div>
                        <div className="text-xs text-emerald-600 font-bold">Total Users</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><Activity size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Avg. Return Time</div>
                        <div className="text-xl font-bold text-slate-900">{avgReturnTime}</div>
                        <div className="text-xs text-emerald-600 font-bold">Estimated</div>
                    </div>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Visual Chart Mock for Recovery */}
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6">Monthly Recovery Trends</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {/* Placeholder for now as we don't have historical data */}
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm italic">
                            Not enough historical data
                        </div>
                    </div>
                </Card>

                {/* Categories */}
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6">Lost Item Categories</h3>
                    <div className="flex-1 flex items-center justify-center gap-8">
                        {categories.length === 0 ? (
                            <div className="text-slate-400">No categories recorded</div>
                        ) : (
                            <div className="w-full space-y-2">
                                {categories.map((cat, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-1">
                                        <span className="text-slate-600">{cat.category_name}</span>
                                        <span className="font-bold text-indigo-600">{cat.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
