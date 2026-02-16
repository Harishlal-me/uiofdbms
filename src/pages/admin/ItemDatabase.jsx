import { useState, useEffect } from 'react';
import { Card, Badge, Button, Input } from '../../components/ui/Primitives';
import { FileSearch, Filter, Search, MoreVertical, Eye, Trash2, Edit } from 'lucide-react';
import api from '../../services/api';

export default function ItemDatabase() {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all'); // 'all' or 'verified'

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const [lostRes, foundRes, matchesRes] = await Promise.all([
                    api.get('/lost'),
                    api.get('/found'),
                    api.get('/matches')
                ]);

                // Normalize Reports
                const lostItems = lostRes.data.map(i => ({
                    id: i.lost_id,
                    name: i.item_name,
                    category: i.category_name,
                    type: 'Lost',
                    location: i.location_name,
                    date: new Date(i.lost_date).toLocaleDateString(),
                    status: i.status || 'Pending',
                    img: i.photo_url || 'https://placehold.co/100x100?text=No+Img'
                }));

                const foundItems = foundRes.data.map(i => ({
                    id: i.found_id,
                    name: i.item_name,
                    category: i.category_name,
                    type: 'Found',
                    location: i.location_name,
                    date: new Date(i.found_date).toLocaleDateString(),
                    status: i.status || 'Stored',
                    img: i.found_photo_url || 'https://placehold.co/100x100?text=No+Img'
                }));

                // Filter for Verified Matches for the second tab
                const verifiedMatches = matchesRes.data.filter(m => m.status === 'Verified' || m.status === 'Resolved');

                setItems([...lostItems, ...foundItems]);
                setMatches(verifiedMatches);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm)
    );

    const filteredMatches = matches.filter(m =>
        m.lost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toString().includes(searchTerm)
    );

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Stored': return 'info';
            case 'Resolved': return 'success';
            case 'Verified': return 'success';
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
                    <p className="text-slate-500">Centralized registry of all reported items & verified matches.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Export CSV</Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setTab('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    All Reports
                </button>
                <button
                    onClick={() => setTab('verified')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'verified' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Reviewed & Verified Items
                </button>
            </div>

            <Card className="overflow-hidden border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">{tab === 'all' ? 'Item Details' : 'Match Details'}</th>
                                <th className="px-6 py-4">{tab === 'all' ? 'Category' : 'Found By & Location'}</th>
                                <th className="px-6 py-4">{tab === 'all' ? 'Report Type' : 'Lost By & Location'}</th>
                                <th className="px-6 py-4">{tab === 'all' ? 'Location' : 'Storage'}</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-4 text-center">Loading data...</td></tr>
                            ) : tab === 'all' ? (
                                filteredItems.length === 0 ? (
                                    <tr><td colSpan="6" className="p-4 text-center">No items found.</td></tr>
                                ) : filteredItems.map((item) => (
                                    <tr key={`${item.type}-${item.id}`} className="hover:bg-slate-50/80 transition-colors group">
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
                                        <td className="px-6 py-3">
                                            <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredMatches.length === 0 ? (
                                    <tr><td colSpan="6" className="p-4 text-center">No verified matches yet.</td></tr>
                                ) : filteredMatches.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    <img src={m.lost.img} className="w-8 h-8 rounded-full border border-white bg-slate-200 object-cover" title="Lost Item" />
                                                    <img src={m.found.img} className="w-8 h-8 rounded-full border border-white bg-slate-200 object-cover" title="Found Item" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{m.lost.name}</div>
                                                    <div className="text-[10px] text-slate-400">Match ID: #{m.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-slate-700">{m.found.user}</div>
                                            <div className="text-[10px] text-slate-400">{m.found.loc}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-medium text-slate-700">{m.lost.user}</div>
                                            <div className="text-[10px] text-slate-400">{m.lost.loc}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="text-xs text-slate-500">{m.found.storage_kept}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant="success">Verified</Badge>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
