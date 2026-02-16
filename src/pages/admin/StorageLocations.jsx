import { Card, Button, Badge } from '../../components/ui/Primitives';
import { MapPin, Plus, Phone, Clock, Package } from 'lucide-react';

export default function StorageLocations() {
    const locations = [
        { name: 'Security Main Office', items: 34, contact: '+94 77 123 4567', hours: '24/7', status: 'Active' },
        { name: 'Library Help Desk', items: 25, contact: '+94 77 987 6543', hours: '8 AM - 8 PM', status: 'Active' },
        { name: 'Hostel Office (Girls)', items: 12, contact: 'Ext. 3033', hours: '9 AM - 5 PM', status: 'Active' },
        { name: 'Hostel Office (Boys)', items: 8, contact: 'Ext. 3034', hours: '9 AM - 5 PM', status: 'Inactive' },
        { name: 'Admin Block', items: 5, contact: 'Ext. 1000', hours: '8 AM - 4 PM', status: 'Active' },
        { name: 'Student Center', items: 0, contact: 'Ext. 2020', hours: '8 AM - 8 PM', status: 'Maintenance' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Storage Locations</h1>
                    <p className="text-slate-500">Manage physical locations where found items are stored.</p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700"><Plus size={16} className="mr-2" /> Add Location</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((loc, i) => (
                    <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-slate-200">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <MapPin size={24} />
                                </div>
                                <Badge variant={loc.status === 'Active' ? 'success' : 'warning'}>{loc.status}</Badge>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 mb-1">{loc.name}</h3>
                            <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                                <Package size={14} /> {loc.items} Items Stored
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone size={14} className="text-slate-400" /> {loc.contact}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Clock size={14} className="text-slate-400" /> {loc.hours}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">Manage Inventory</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
