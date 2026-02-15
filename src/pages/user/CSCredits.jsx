import { Card, Badge } from '../../components/ui/Primitives';
import { Award, TrendingUp, Shield, Gift, Star, CheckCircle, Zap } from 'lucide-react';

export default function CSCredits() {
    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">CS Credits</h1>
                <p className="text-slate-500 mt-1">CampusSafe Contribution Credits - Earn rewards for helping the community.</p>
            </div>

            {/* Hero Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-brand-gradient rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <div className="text-indigo-100 font-medium mb-1">Total Contribution Score</div>
                            <div className="text-5xl font-bold mb-4">450</div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                                <Shield size={16} /> Campus Guardian Level
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Zap size={120} className="text-white opacity-20" />
                        </div>
                    </div>
                </div>

                <Card className="p-6 flex flex-col justify-center text-center bg-amber-50 border-amber-100">
                    <Gift size={40} className="text-amber-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900">Next Reward</h3>
                    <p className="text-slate-600 text-sm mb-3">Reach 500 Credits for Coffee Voucher</p>
                    <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[90%]"></div>
                    </div>
                    <div className="text-xs text-amber-700 font-bold mt-2">450 / 500 CS Credits</div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" /> Credit History
                    </h2>
                    <Card className="divide-y divide-slate-100">
                        {[
                            { action: 'Item Returned to Owner', points: '+50', date: '2 days ago', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
                            { action: 'Reported Found Item', points: '+10', date: 'Oct 24', icon: Star, color: 'text-amber-600 bg-amber-100' },
                            { action: 'Owner Confirmation', points: '+20', date: 'Oct 20', icon: Award, color: 'text-blue-600 bg-blue-100' },
                            { action: 'Reported Lost Item', points: '+5', date: 'Oct 12', icon: Shield, color: 'text-slate-600 bg-slate-100' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                                    <item.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-900">{item.action}</div>
                                    <div className="text-xs text-slate-500">{item.date}</div>
                                </div>
                                <div className="font-bold text-emerald-600">{item.points}</div>
                            </div>
                        ))}
                    </Card>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Earning Rules</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Unverified Match Resolution', points: 50 },
                            { label: 'Owner Confirmation', points: 20 },
                            { label: 'Report Found Item', points: 10 },
                            { label: 'Report Lost Item', points: 5 },
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
