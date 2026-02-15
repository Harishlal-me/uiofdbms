import { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui/Primitives';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';

export default function BrowseItems() {
    const [filterOpen, setFilterOpen] = useState(false);

    // Mock Items
    const items = [
        { id: 1, name: 'Silver MacBook Air', loc: 'Library', date: 'Oct 25', status: 'lost', img: 'https://placehold.co/400x300/e2e8f0/64748b?text=MacBook' },
        { id: 2, name: 'Blue Jansport Bag', loc: 'Gym', date: 'Oct 24', status: 'found', img: 'https://placehold.co/400x300/e2e8f0/64748b?text=Bag' },
        { id: 3, name: 'Car Keys (Toyota)', loc: 'Parking Lot B', date: 'Oct 26', status: 'lost', img: 'https://placehold.co/400x300/e2e8f0/64748b?text=Keys' },
        { id: 4, name: 'Calculus Textbook', loc: 'Room 304', date: 'Oct 23', status: 'found', img: 'https://placehold.co/400x300/e2e8f0/64748b?text=Book' },
        { id: 5, name: 'Hydro Flask', loc: 'Field', date: 'Oct 27', status: 'lost', img: 'https://placehold.co/400x300/e2e8f0/64748b?text=Bottle' },
        { id: 6, name: 'Black Umbrella', loc: 'Main Entrance', date: 'Oct 25', status: 'found', img: 'https://placehold.co/400x300/e2e8f0/64748b?text=Umbrella' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Filters Sidebar (Sticky on Desktop) */}
            <div className="w-full md:w-64 bg-white rounded-xl border border-slate-200 p-6 md:sticky top-24">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2"><Filter size={18} /> Filters</h2>
                    <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Reset</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Lost Items
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Found Items
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Category</label>
                        <select className="w-full h-9 rounded-lg border-slate-200 text-sm focus:ring-indigo-500">
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Clothing</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Date Range</label>
                        <input type="date" className="w-full h-9 rounded-lg border-slate-200 text-sm mb-2" />
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 w-full">
                {/* Search Bar */}
                <div className="mb-6 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search items by name, description, or location..."
                            className="pl-10 w-full h-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <Button>Search</Button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <Card key={item.id} className="group cursor-pointer hover:shadow-md transition-all">
                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3">
                                    <Badge variant={item.status === 'lost' ? 'danger' : 'success'}>
                                        {item.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {item.loc}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    );
}
