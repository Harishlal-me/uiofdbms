import { Card, Badge, Button } from '../../components/ui/Primitives';
import { MapPin, Calendar, Award, CheckCircle } from 'lucide-react';

export default function MyFoundItems() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reports Submitted</h1>
                    <p className="text-slate-500 text-sm">Items you found and handed over to security.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {/* Item 1: Returned (Points Awarded) */}
                <Card className="p-6 border-l-4 border-l-amber-500">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                                <img src="https://placehold.co/200x200/dcfce7/166534?text=Bag" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Blue Jansport Bag</h3>
                                <div className="text-sm text-slate-500 mt-1">Submitted to: Library Help Desk</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="success">Returned to Owner</Badge>
                                    <span className="text-xs text-slate-400">• Oct 24, 2023</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                                <Award size={12} /> +50 Points
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Item 2: In Storage */}
                <Card className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                                <img src="https://placehold.co/200x200/dcfce7/166534?text=Keys" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Car Keys (Honda)</h3>
                                <div className="text-sm text-slate-500 mt-1">Submitted to: Security Main Office</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="info">In Secure Storage</Badge>
                                    <span className="text-xs text-slate-400">• Yesterday</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                                <CheckCircle size={12} /> Pending Verification
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
