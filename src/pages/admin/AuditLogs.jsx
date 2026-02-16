import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '../../components/ui/Primitives';
import { FileText, Shield, User, Database, LogIn, Search, LoaderCircle } from 'lucide-react';
import api from '../../services/api';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/audit-logs');
                if (Array.isArray(res.data)) {
                    setLogs(res.data);
                } else {
                    console.error("Audit Logs API response is not an array:", res.data);
                    setLogs([]);
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getTypeIcon = (type) => {
        // Simple mapping based on table name or action if type is not explicit in DB
        // The DB `table_name` can serve as type proxy
        if (!type) return <FileText size={14} />;
        const t = String(type); // Ensure string
        if (t.includes('User')) return <User size={14} className="text-indigo-500" />;
        if (t.includes('Report')) return <FileText size={14} className="text-emerald-500" />;
        if (t.includes('Match')) return <Shield size={14} className="text-amber-500" />;
        return <Database size={14} className="text-slate-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search logs..." className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm w-64 focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
            </div>

            <Card className="overflow-hidden border border-slate-200 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Context</th>
                            <th className="px-6 py-4 font-mono">ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-6 text-center">Loading logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="5" className="p-6 text-center">No audit logs found.</td></tr>
                        ) : logs.map((log) => (
                            <tr key={log.log_id} className="hover:bg-slate-50 group transition-colors cursor-default">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {new Date(log.changed_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                            {log.user_name ? log.user_name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="text-slate-700">{log.user_name || 'System Auto'}</span>
                                        {log.user_role && <Badge variant="neutral" className="text-[10px]">{log.user_role}</Badge>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={
                                        log.action === 'INSERT' ? 'success' :
                                            log.action === 'UPDATE' ? 'warning' :
                                                log.action === 'DELETE' ? 'danger' : 'neutral'
                                    }>
                                        {log.action === 'INSERT' ? 'Created New' :
                                            log.action === 'UPDATE' ? 'Updated' :
                                                log.action === 'DELETE' ? 'Deleted' : log.action}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        {getTypeIcon(log.table_name)}
                                        <span className="capitalize">
                                            {log.table_name === 'LostReports' ? 'Lost Item Report' :
                                                log.table_name === 'FoundReports' ? 'Found Item Report' :
                                                    log.table_name === 'Matches' ? 'Match Record' :
                                                        log.table_name === 'Users' ? 'User Profile' :
                                                            log.table_name === 'ItemClaims' ? 'Item Claim' :
                                                                log.table_name === 'StorageLocations' ? 'Storage Location' :
                                                                    log.table_name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                    #{log.record_id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-slate-100 text-center">
                    <Button variant="ghost" size="sm" className="text-slate-500">Load Older Logs</Button>
                </div>
            </Card>
        </div>
    );
}
