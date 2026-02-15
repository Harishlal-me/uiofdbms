import { Card, Badge, Button } from '../../components/ui/Primitives';
import { Search, MapPin, Calendar, ArrowRight, Eye } from 'lucide-react';

export default function MyLostItems() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Lost Reports</h1>
                    <p className="text-slate-500 text-sm">Track the status of items you have reported lost.</p>
                </div>
                <Button variant="secondary" className="hidden md:flex">
                    <Search className="w-4 h-4 mr-2" /> Search History
                </Button>
            </div>

            <div className="grid gap-4">
                {/* Item 1: Ready for Pickup */}
                <Card className="p-0 overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-48 md:h-auto bg-slate-200 relative">
                        <img src="https://placehold.co/400x400/e2e8f0/64748b?text=MacBook" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                            Electronics
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Silver MacBook Pro</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> Library 2nd Floor</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Oct 25, 2023</span>
                                </div>
                            </div>
                            <Badge variant="success" className="animate-pulse">Ready for Pickup</Badge>
                        </div>

                        <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Item Located</div>
                                <div className="text-sm text-emerald-900">
                                    Please collect from <strong>Security Main Office</strong> with your ID Card.
                                </div>
                            </div>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 border-0 text-white">
                                View Match
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Item 2: Searching */}
                <Card className="p-0 overflow-hidden flex flex-col md:flex-row opacity-80">
                    <div className="w-full md:w-48 h-48 md:h-auto bg-slate-200">
                        <img src="https://placehold.co/400x400/e2e8f0/64748b?text=Wallet" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-slate-900">Black Leather Wallet</h3>
                                <Badge variant="warning">Searching</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                <span className="flex items-center gap-1"><MapPin size={14} /> Cafeteria</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Oct 28, 2023</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 italic">
                            AI is currently scanning new found reports for potential matches...
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
