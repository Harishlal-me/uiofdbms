import { Card, Badge, Button } from '../../components/ui/Primitives';
import { FileText, Shield, User, Database, LogIn, Search } from 'lucide-react';

export default function AuditLogs() {
    const logs = [
        { id: 'LOG-9921', time: '10:42:15 AM', user: 'Admin', role: 'Super Admin', action: 'Verified Match #2938', type: 'System', ip: '192.168.1.1' },
        { id: 'LOG-9920', time: '10:30:00 AM', user: 'System', role: 'Bot', action: 'Daily Database Backup Completed', type: 'Maintenance', ip: 'localhost' },
        { id: 'LOG-9919', time: '09:15:22 AM', user: 'Student_01', role: 'User', action: 'Failed Login Attempt (Password)', type: 'Auth', ip: '10.0.0.45' },
        { id: 'LOG-9918', time: '09:12:10 AM', user: 'Guard_John', role: 'Admin', action: 'Updated Storage Location: Library', type: 'Data', ip: '192.168.1.12' },
        { id: 'LOG-9917', time: '08:45:00 AM', user: 'Admin', role: 'Super Admin', action: 'Exported Monthly Report.csv', type: 'System', ip: '192.168.1.1' },
        { id: 'LOG-9916', time: 'Yesterday', user: 'System', role: 'Bot', action: 'Cleared Temporary Cache', type: 'Maintenance', ip: 'localhost' },
        { id: 'LOG-9915', time: 'Yesterday', user: 'NewUser_99', role: 'User', action: 'Account Created', type: 'Auth', ip: '10.0.0.88' },
        { id: 'LOG-9914', time: 'Yesterday', user: 'Admin', role: 'Super Admin', action: 'Rejected Claim #CLM-004', type: 'System', ip: '192.168.1.1' },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Auth': return <LogIn size={14} className="text-amber-500" />;
            case 'System': return <Shield size={14} className="text-indigo-500" />;
            case 'Data': return <Database size={14} className="text-emerald-500" />;
            case 'Maintenance': return <FileText size={14} className="text-slate-500" />;
            default: return <FileText size={14} />;
        }
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
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 font-mono">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 group transition-colors cursor-default">
                                <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.time}</td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {log.user[0].toUpperCase()}
                                        </div>
                                        <span className="font-medium text-slate-900">{log.user}</span>
                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{log.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 font-medium text-slate-700">{log.action}</td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2 border border-slate-100 bg-white px-2 py-1 rounded w-fit">
                                        {getTypeIcon(log.type)}
                                        <span className="text-xs">{log.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-400 font-mono">{log.ip}</td>
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
