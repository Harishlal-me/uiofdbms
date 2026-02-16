import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Primitives';
import { User, Shield } from 'lucide-react';
import api from '../../services/api';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-6 text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <Card className="divide-y divide-slate-100">
                {users.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">No users found.</div>
                ) : users.map(user => (
                    <div key={user.user_id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                <User size={20} className="text-slate-500" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                                    {user.role === 'student' && (
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded-full">
                                            {user.cs_credits || 0} CS Credits
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Active</div>
                    </div>
                ))}
            </Card>
        </div>
    );
}
