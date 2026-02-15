import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui/Primitives';
import { MapPin, Box, Hash, Phone, AlertTriangle, FileText, Info } from 'lucide-react';
import { useState } from 'react';

export default function ReportFound() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'Electronics',
        description: '',
        raNumber: '',
        phoneNumber: '',
        dateFound: '',
        locationFound: '',
        storageLocation: '', // Default empty to force selection
        nearbyLocation: '',
        customLocation: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Found Report:", formData);

        // Simulate API
        setTimeout(() => {
            alert(`Report Submitted! You earned +10 CS Credits. Please ensure the item is at: ${formData.storageLocation}`);
            navigate('/dashboard');
        }, 500);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Found an Item?</h1>
                <p className="text-slate-500 mt-2">Report it to help return it to its owner and earn <span className="font-bold text-indigo-600">CS Credits</span>.</p>
            </div>

            <Card className="p-8 border-t-4 border-t-emerald-500 shadow-xl shadow-emerald-50/50">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Item Details */}
                    <div className="space-y-6">
                        <h3 className="text-emerald-800 font-semibold border-b border-emerald-100 pb-2 flex items-center gap-2">
                            <Box size={18} /> Item Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Item Name"
                                placeholder="e.g. Blue Jansport Backpack"
                                required
                                value={formData.itemName}
                                onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option>Electronics</option>
                                    <option>Clothing / Accessories</option>
                                    <option>Books / Stationery</option>
                                    <option>IDs / Cards</option>
                                    <option>Keys</option>
                                    <option>Others</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea
                                className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px]"
                                placeholder="Describe distinguishing features (scratches, stickers, contents)..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input label="Date Found" type="date" required />
                            <Input label="Distinct Location Found" placeholder="e.g. Under Table 4 in Java Canteen" required icon={MapPin} />
                        </div>
                    </div>

                    {/* Section 2: Storage & Handover (CRITICAL) */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                        <h3 className="text-emerald-800 font-semibold mb-2 flex items-center gap-2">
                            <Box className="w-4 h-4" /> Where is the item currently kept?
                        </h3>
                        <div className="flex gap-3 mb-4 bg-white/60 p-3 rounded-lg border border-emerald-100">
                            <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p className="text-sm text-emerald-800 leading-tight">
                                <strong>Important:</strong> Please select the exact location where you have deposited or are keeping the item. This cannot be changed later.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-900 mb-1.5">Select Storage Location</label>
                            <select
                                className="w-full h-10 px-3 rounded-lg border border-emerald-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-900"
                                value={formData.storageLocation}
                                onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select a location...</option>
                                <option>Security Main Office</option>
                                <option>Library Help Desk</option>
                                <option>Hostel Office (Girls)</option>
                                <option>Hostel Office (Boys)</option>
                                <option>Admin Block</option>
                                <option>Student Center</option>
                            </select>
                        </div>
                    </div>

                    {/* Section 3: Reporter Info */}
                    <div className="space-y-6">
                        <h3 className="text-slate-800 font-semibold border-b border-slate-100 pb-2">Your Details</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="RA Number"
                                placeholder="RA21..."
                                icon={Hash}
                                required
                                value={formData.raNumber}
                                onChange={e => setFormData({ ...formData, raNumber: e.target.value.toUpperCase() })}
                            />
                            <Input
                                label="Phone Number"
                                placeholder="9876543210"
                                icon={Phone}
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setFormData({ ...formData, phoneNumber: val });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Cancel</Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 px-8">
                            Submit & Earn Credits
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    );
}
