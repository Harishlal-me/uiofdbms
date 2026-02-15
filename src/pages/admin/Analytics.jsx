import { Card, Badge, Button } from '../../components/ui/Primitives';
import { TrendingUp, PieChart, Activity, Calendar, Download, Users, Package } from 'lucide-react';

export default function Analytics() {
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
                        <div className="text-xl font-bold text-slate-900">76.4%</div>
                        <div className="text-xs text-emerald-600 font-bold">+5.2%</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Package size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Items Processed</div>
                        <div className="text-xl font-bold text-slate-900">1,240</div>
                        <div className="text-xs text-slate-400">Total Lifetime</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Users size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Active Finders</div>
                        <div className="text-xl font-bold text-slate-900">856</div>
                        <div className="text-xs text-emerald-600 font-bold">+12%</div>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><Activity size={24} /></div>
                    <div>
                        <div className="text-sm text-slate-500">Avg. Return Time</div>
                        <div className="text-xl font-bold text-slate-900">2.5 Days</div>
                        <div className="text-xs text-emerald-600 font-bold">-0.5 Days</div>
                    </div>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Visual Chart Mock for Recovery */}
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6">Monthly Recovery Trends</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {[40, 60, 45, 70, 55, 80, 65, 85, 90, 75, 80, 95].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-50 rounded-t-md relative group">
                                <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                        <span>Jan</span><span>Dec</span>
                    </div>
                </Card>

                {/* Visual donut chart mock */}
                <Card className="p-6 h-80 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6">Lost Item Categories</h3>
                    <div className="flex-1 flex items-center justify-center gap-8">
                        {/* CSS Donut Chart */}
                        <div className="w-40 h-40 rounded-full border-[16px] border-indigo-500 border-r-emerald-400 border-b-amber-400 border-l-rose-400 rotate-45 relative shadow-lg">
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-600 text-lg">
                                Diff
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 bg-indigo-500 rounded-full"></span> Electronics (45%)</div>
                            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 bg-emerald-400 rounded-full"></span> Documents (25%)</div>
                            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 bg-amber-400 rounded-full"></span> Clothing (20%)</div>
                            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 bg-rose-400 rounded-full"></span> Others (10%)</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
