import { Card } from '../../components/ui/Primitives';
import { User, Shield } from 'lucide-react';

export default function Users() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <Card className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                <User size={20} className="text-slate-500" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-900">Student User {i}</div>
                                <div className="text-xs text-slate-500">ra2111003010{i}@srm.edu.in</div>
                            </div>
                        </div>
                        <div className="text-sm text-slate-500">Active</div>
                    </div>
                ))}
            </Card>
        </div>
    );
}
