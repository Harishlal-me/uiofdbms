import { Card, Badge } from '../../components/ui/Primitives';
import { Award, TrendingUp, Shield, Gift, Star, CheckCircle } from 'lucide-react';

export default function KarmaPoints() {
    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Karma Points</h1>
                <p className="text-slate-500 mt-1">Earn rewards for helping the campus community.</p>
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
                        <Award size={100} className="text-white opacity-20" />
                    </div>
                </div>

                <Card className="p-6 flex flex-col justify-center text-center bg-amber-50">
                    <Gift size={40} className="text-amber-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900">Next Reward</h3>
                    <p className="text-slate-600 text-sm mb-3">Reach 500 for Coffee Voucher</p>
                    <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[90%]"></div>
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" /> History
                    </h2>
                    <Card className="divide-y divide-slate-100">
                        {[
                            { action: 'Item Returned to Owner', points: '+50', date: '2 days ago', icon: CheckCircle },
                            { action: 'Reported Found Item', points: '+15', date: 'Oct 24', icon: Star },
                            { action: 'Reported Lost Item', points: '+10', date: 'Oct 12', icon: Shield },
                        ].map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <item.icon size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">{item.action}</div>
                                    <div className="text-xs text-slate-500">{item.date}</div>
                                </div>
                                <div className="font-bold text-emerald-600">{item.points}</div>
                            </div>
                        ))}
                    </Card>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Point Rules</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Return Verified', points: 50 },
                            { label: 'Owner Recovery', points: 20 },
                            { label: 'Report Found', points: 15 },
                            { label: 'Report Lost', points: 10 },
                        ].map((rule, i) => (
                            <Card key={i} className="p-3 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700">{rule.label}</span>
                                <Badge variant="success">+{rule.points}</Badge>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
