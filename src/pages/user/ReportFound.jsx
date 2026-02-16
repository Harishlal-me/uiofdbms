import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, TriangleAlert, Hash, Phone } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button } from '../../components/ui/Primitives';

export default function ReportFound() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [storageLocations, setStorageLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/categories'),
            api.get('/storage')
        ]).then(([catRes, storeRes]) => {
            const cats = Array.isArray(catRes.data) ? catRes.data : [];
            const stores = Array.isArray(storeRes.data) ? storeRes.data : [];

            setCategories(cats);
            setStorageLocations(stores);

            if (cats.length > 0) setFormData(p => ({ ...p, category: cats[0].category_id }));
            // Optional: Default storage? User must select it, so maybe leave empty.

            setLoading(false);
        }).catch(err => {
            console.error("Error fetching report found data:", err);
            setLoading(false);
        });
    }, []);

    const [formData, setFormData] = useState({
        itemName: '',
        category: '', // ID
        description: '',
        raNumber: '',
        phoneNumber: '',
        dateFound: '',
        locationFound: '',
        storageLocation: '', // ID
        image: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataObj = new FormData();
            formDataObj.append('item_name', formData.itemName);
            formDataObj.append('category_id', formData.category);
            formDataObj.append('location_id', 1);
            formDataObj.append('storage_location_id', formData.storageLocation);
            formDataObj.append('description', formData.description);
            formDataObj.append('found_date', formData.dateFound);
            formDataObj.append('contact_phone', formData.phoneNumber);
            formDataObj.append('ra_reg_no', formData.raNumber);
            formDataObj.append('specific_location', formData.locationFound);
            formDataObj.append('color', 'Unknown');

            if (formData.image) {
                formDataObj.append('image', formData.image);
            }

            await api.post('/found', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert(`Report Submitted! You earned +10 CS Credits. Please ensure the item is at: ${formData.storageLocation}`);
            navigate('/reported-found');
        } catch (error) {
            console.error(error);
            alert("Failed to submit: " + (error.response?.data?.message || error.message));
        }
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
                            <Package size={18} /> Item Information
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
                                <select
                                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={formData.category} // ID
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    disabled={loading}
                                >
                                    {loading ? <option>Loading...</option> : categories.map(cat => (
                                        <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                    ))}
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
                            <Input
                                label="Date Found"
                                type="date"
                                required
                                value={formData.dateFound}
                                onChange={e => setFormData({ ...formData, dateFound: e.target.value })}
                            />
                            <Input
                                label="Distinct Location Found"
                                placeholder="e.g. Under Table 4 in Java Canteen"
                                required
                                value={formData.locationFound}
                                onChange={e => setFormData({ ...formData, locationFound: e.target.value })}
                            />
                        </div>
                        <div className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:bg-emerald-50 transition-colors cursor-pointer group relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={e => {
                                    if (e.target.files[0]) {
                                        setFormData({ ...formData, image: e.target.files[0] });
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center">
                                <span className="text-emerald-600 font-medium mb-1">
                                    {formData.image ? formData.image.name : "+ Upload Photo (Optional)"}
                                </span>
                                <span className="text-xs text-slate-400">Helps user verify ownership</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Storage & Handover (CRITICAL) */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                        <h3 className="text-emerald-800 font-semibold mb-2 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Where is the item currently kept?
                        </h3>
                        <div className="flex gap-3 mb-4 bg-white/60 p-3 rounded-lg border border-emerald-100">
                            <TriangleAlert className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p className="text-sm text-emerald-800 leading-tight">
                                <strong>Important:</strong> Please select the exact location where you have deposited or are keeping the item. This cannot be changed later.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-900 mb-1.5">Select Storage Location</label>
                            <select
                                className="w-full h-10 px-3 rounded-lg border border-emerald-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-900"
                                value={formData.storageLocation} // ID
                                onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
                                required
                                disabled={loading}
                            >
                                <option value="" disabled>Select a location...</option>
                                {storageLocations.map(loc => (
                                    <option key={loc.storage_id} value={loc.storage_id}>{loc.room_name}</option>
                                ))}
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
                                required
                                value={formData.raNumber}
                                onChange={e => setFormData({ ...formData, raNumber: e.target.value.toUpperCase() })}
                            />
                            <Input
                                label="Phone Number"
                                placeholder="9876543210"
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
