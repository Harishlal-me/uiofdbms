import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/ui/Primitives';
import { Plus, Search, Award, Bell, CheckCircle, Shield } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, Student</h1>
                    <p className="text-slate-500">Here's what's happening with your items.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => navigate('/report-lost')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                        <Search size={18} className="mr-2" /> Report Lost
                    </Button>
                    <Button onClick={() => navigate('/report-found')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200">
                        <Plus size={18} className="mr-2" /> Report Found
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-indigo-500">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <Search size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">2</div>
                        <div className="text-sm text-slate-500">Active Lost Reports</div>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">12</div>
                        <div className="text-sm text-slate-500">Items Returned</div>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4 border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/cs-credits')}>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                        <Award size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900">450</div>
                        <div className="text-sm text-slate-500">CS Credits Earned</div>
                    </div>
                </Card>
            </div>

            {/* Notifications & Tips Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Live Notifications */}
                <Card className="p-6 h-full">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-indigo-600" /> Recent Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                            <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">Potential Match Found</p>
                                <p className="text-xs text-slate-500 mt-0.5">Your "Silver MacBook" matches a found item. Admin is verifying.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-2 h-2 mt-2 rounded-full bg-slate-400 shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">System Update</p>
                                <p className="text-xs text-slate-500 mt-0.5">Karma Points are now CS Credits! Check your balance.</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* CS Credits Preview */}
                <Card className="p-0 overflow-hidden relative bg-brand-gradient text-white">
                    <div className="p-6 relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Shield size={18} /> Campus Guardian</h3>
                            <p className="text-indigo-100 text-sm">Level 4 Contributor</p>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                                <span>Progress to Reward</span>
                                <span>450 / 500</span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full w-[90%]"></div>
                            </div>
                            <button onClick={() => navigate('/cs-credits')} className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/10">
                                View Credit History
                            </button>
                        </div>
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
                </Card>
            </div>
        </div>
    );
}
