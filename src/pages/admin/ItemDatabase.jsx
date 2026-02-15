import { useState } from 'react';
import { Card, Badge, Button, Input } from '../../components/ui/Primitives';
import { FileSearch, Filter, Search, MoreVertical, Eye, Trash2, Edit } from 'lucide-react';

export default function ItemDatabase() {
    const [searchTerm, setSearchTerm] = useState('');

    const mockItems = [
        { id: '8821', name: 'MacBook Pro', type: 'Found', category: 'Electronics', location: 'Library', date: 'Oct 26, 2023', status: 'Stored', img: 'https://placehold.co/100x100/dcfce7/166534?text=Mac' },
        { id: '8820', name: 'Blue Jansport Bag', type: 'Found', category: 'Bags', location: 'Cafeteria', date: 'Oct 26, 2023', status: 'Claimed', img: 'https://placehold.co/100x100/dcfce7/166534?text=Bag' },
        { id: '8819', name: 'IPhone 13', type: 'Lost', category: 'Electronics', location: 'Gym', date: 'Oct 25, 2023', status: 'Pending', img: 'https://placehold.co/100x100/fee2e2/991b1b?text=Phone' },
        { id: '8818', name: 'Car Keys (Toyota)', type: 'Found', category: 'Keys', location: 'Parking Lot A', date: 'Oct 25, 2023', status: 'Stored', img: 'https://placehold.co/100x100/dcfce7/166534?text=Keys' },
        { id: '8817', name: 'Water Bottle (Yeti)', type: 'Found', category: 'Others', location: 'Auditorium', date: 'Oct 24, 2023', status: 'Disposed', img: 'https://placehold.co/100x100/dcfce7/166534?text=Bottle' },
        { id: '8816', name: 'Calculus Textbook', type: 'Lost', category: 'Books', location: 'Room 304', date: 'Oct 24, 2023', status: 'Found', img: 'https://placehold.co/100x100/fee2e2/991b1b?text=Book' },
        { id: '8815', name: 'Black Wallet', type: 'Found', category: 'Wallet', location: 'Main Hall', date: 'Oct 23, 2023', status: 'Stored', img: 'https://placehold.co/100x100/dcfce7/166534?text=Wallet' },
        { id: '8814', name: 'Lab Coat', type: 'Lost', category: 'Clothing', location: 'Chem Lab', date: 'Oct 22, 2023', status: 'Pending', img: 'https://placehold.co/100x100/fee2e2/991b1b?text=Coat' },
        { id: '8813', name: 'AirPods Case', type: 'Found', category: 'Electronics', location: 'Library', date: 'Oct 22, 2023', status: 'Stored', img: 'https://placehold.co/100x100/dcfce7/166534?text=AirPods' },
        { id: '8812', name: 'Student ID (John D)', type: 'Found', category: 'Documents', location: 'Security Gate', date: 'Oct 21, 2023', status: 'Returned', img: 'https://placehold.co/100x100/dcfce7/166534?text=ID' },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Stored': return 'info';
            case 'Claimed': return 'success';
            case 'Found': return 'success';
            case 'Returned': return 'success';
            case 'Pending': return 'warning';
            case 'Disposed': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Item Database</h1>
                    <p className="text-slate-500">Centralized registry of all reported items.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search database..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary"><Filter size={16} className="mr-2" /> Filter</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Export CSV</Button>
                </div>
            </div>

            <Card className="overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Item Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Report Type</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={item.img} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                                            <div>
                                                <div className="font-bold text-slate-900">{item.name}</div>
                                                <div className="text-[10px] text-slate-400">ID: #{item.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{item.category}</td>
                                    <td className="px-6 py-3">
                                        <Badge variant={item.type === 'Lost' ? 'danger' : 'success'}>{item.type}</Badge>
                                    </td>
                                    <td className="px-6 py-3">{item.location}</td>
                                    <td className="px-6 py-3">{item.date}</td>
                                    <td className="px-6 py-3">
                                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Eye size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>Showing 1-10 of 1,240 items</span>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" disabled>Previous</Button>
                        <Button variant="secondary" size="sm">Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
