import { Card, Badge } from '../../components/ui/Primitives';
import { Award, CircleCheck, TrendingUp, Star, Shield, Gift } from 'lucide-react';

export default function PointsPage() {
    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Karma Points</h1>
                <p className="text-slate-500 mt-2">Earn rewards for being a responsible campus citizen.</p>
            </div>

            {/* Hero Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-brand-gradient rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="text-indigo-100 font-medium mb-1">Total Impact Score</div>
                            <div className="text-5xl font-bold mb-4">450</div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                                <Shield size={16} /> Campus Guardian Level
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Award size={120} className="text-white opacity-20" />
                        </div>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <Card className="p-6 flex flex-col justify-center items-center text-center bg-amber-50 border-amber-100">
                    <Gift size={48} className="text-amber-500 mb-4" />
                    <h3 className="font-bold text-slate-900 text-lg">Next Reward</h3>
                    <p className="text-slate-600 text-sm mt-1 mb-4">Reach 500 points to unlock</p>
                    <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[90%]"></div>
                    </div>
                    <div className="text-xs text-amber-700 font-bold mt-2">450 / 500</div>
                    <div className="mt-4 text-xs font-semibold text-amber-800 bg-amber-200/50 px-3 py-1 rounded">
                        Free Coffee Voucher ☕
                    </div>
                </Card>
            </div>

            {/* History Timeline */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" /> Point History
                    </h2>
                    <Card className="divide-y divide-slate-100">
                        {[
                            { action: 'Item Returned to Owner', points: '+50', date: '2 days ago', icon: CircleCheck, color: 'text-emerald-600 bg-emerald-100' },
                            { action: 'Reported Found Item', points: '+15', date: 'Oct 24', icon: Star, color: 'text-amber-600 bg-amber-100' },
                            { action: 'Reported Lost Item', points: '+10', date: 'Oct 12', icon: Shield, color: 'text-blue-600 bg-blue-100' },
                            { action: 'Verified Identity', points: '+5', date: 'Sep 30', icon: Shield, color: 'text-slate-600 bg-slate-100' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-900">{item.action}</div>
                                    <div className="text-xs text-slate-500">{item.date}</div>
                                </div>
                                <div className="font-bold text-green-600">{item.points}</div>
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Earning Rules */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">How to Earn</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Return an Item', points: 50 },
                            { label: 'Recover your Item', points: 20 },
                            { label: 'Report Found', points: 15 },
                            { label: 'Report Lost', points: 10 },
                        ].map((rule, i) => (
                            <Card key={i} className="p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                                <span className="font-medium text-slate-700">{rule.label}</span>
                                <Badge variant="success">+{rule.points}</Badge>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
