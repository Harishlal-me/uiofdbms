import { Card, Badge } from '../../components/ui/Primitives';
import { MapPin, Calendar, Award } from 'lucide-react';

export default function ReportedFound() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reported Found Items</h1>
                    <p className="text-slate-500 text-sm">Items you have found and submitted.</p>
                </div>
            </div>

            <div className="grid gap-4">
                <Card className="p-6 border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                                <img src="https://placehold.co/200x200/dcfce7/166534?text=Bag" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Blue Jansport Bag</h3>
                                <div className="text-sm text-slate-500 mt-1">Kept at: Library Help Desk</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="success">Returned to Owner</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                <Award size={12} /> +50 Points
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                                <img src="https://placehold.co/200x200/dcfce7/166534?text=Keys" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Car Keys</h3>
                                <div className="text-sm text-slate-500 mt-1">Kept at: Security Office</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="info">In Storage</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
