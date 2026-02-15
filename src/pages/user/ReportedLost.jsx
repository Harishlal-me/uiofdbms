import { Card, Badge, Button } from '../../components/ui/Primitives';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function ReportedLost() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reported Lost Items</h1>
                    <p className="text-slate-500 text-sm">Track the status of items you have reported lost.</p>
                </div>
            </div>

            <div className="grid gap-4">
                <Card className="p-0 overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-48 md:h-auto bg-slate-200 relative">
                        <img src="https://placehold.co/400x400/e2e8f0/64748b?text=MacBook" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Silver MacBook Pro</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> Library</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Oct 25, 2023</span>
                                </div>
                            </div>
                            <Badge variant="success">Ready for Pickup</Badge>
                        </div>
                        <div className="mt-4 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            Item located! Please visit <strong>Security Main Office</strong> with your ID.
                        </div>
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden flex flex-col md:flex-row opacity-80">
                    <div className="w-full md:w-48 h-48 md:h-auto bg-slate-200">
                        <img src="https://placehold.co/400x400/e2e8f0/64748b?text=Wallet" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-900">Black Leather Wallet</h3>
                            <Badge variant="warning">Searching</Badge>
                        </div>
                        <div className="mt-4 text-sm text-slate-500 italic">
                            We are currently scanning for matches...
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
