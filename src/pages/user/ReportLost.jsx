import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui/Primitives';
import { ChevronRight, ChevronLeft, Upload, Check, MapPin, Phone, Hash, AlertTriangle, FileText } from 'lucide-react';

export default function ReportLost() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [formData, setFormData] = useState({
        itemName: '',
        category: 'electronics',
        raNumber: '',
        phoneNumber: '',
        dateLost: '',
        location: '',
        description: '',
        image: null
    });

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Trigger generic modal or logic here if needed, but we will use a specific confirmation dialog in the UI
        setIsConfirmOpen(true);
    };

    const confirmSubmit = () => {
        setIsSubmitting(true);
        console.log("Submitting Lost Report:", formData);

        // Simulate API
        setTimeout(() => {
            // No need to set submitting false if we navigate away, but good practice if nav fails
            // setIsSubmitting(false); 
            alert("Report Submitted Successfully! You earned +5 CS Credits.");
            navigate('/dashboard');
        }, 1500);
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className={`flex items-center ${i < 3 ? 'w-full' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= i ? 'bg-indigo-600 text-white scale-110 shadow-md shadow-indigo-200' : 'bg-slate-200 text-slate-500'
                        }`}>
                        {step > i ? <Check size={16} /> : i}
                    </div>
                    {i < 3 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${step > i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">Report Lost Item</h1>
                <p className="text-slate-500 mt-2">Help us find your item by providing accurate details.</p>
            </div>

            <StepIndicator />

            <Card className="p-8 border-t-4 border-t-indigo-500 shadow-xl shadow-indigo-50/50">
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">Item & Contact Details</h2>

                            <Input
                                label="What did you lose?"
                                placeholder="e.g. Silver MacBook Pro 13-inch"
                                value={formData.itemName}
                                onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                                autoFocus
                                required
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="RA Number (Registration)"
                                    placeholder="RA2111003010..."
                                    icon={Hash}
                                    value={formData.raNumber}
                                    onChange={e => setFormData({ ...formData, raNumber: e.target.value.toUpperCase() })}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    placeholder="9876543210"
                                    icon={Phone}
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setFormData({ ...formData, phoneNumber: val });
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                                <select
                                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="keys">Keys / ID</option>
                                    <option value="books">Books</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">Location & Date</h2>
                            <Input
                                label="Where was it likely lost?"
                                placeholder="e.g. Library 2nd Floor"
                                icon={MapPin}
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                autoFocus
                                required
                            />
                            <Input
                                label="Date Lost"
                                type="date"
                                value={formData.dateLost}
                                onChange={e => setFormData({ ...formData, dateLost: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (Optional)</label>
                                <textarea
                                    className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                    placeholder="Any distinguishing marks, stickers, or serial numbers?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <div className="text-sm font-medium text-slate-900">Upload a reference photo</div>
                                <div className="text-xs text-slate-500 mt-1">If you have an old picture of the item</div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-semibold mb-4 text-slate-800 border-b pb-2">Review & Submit</h2>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <FileText size={16} /> Item
                                    </div>
                                    <div className="font-bold text-slate-900">{formData.itemName}</div>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Hash size={16} /> RA Number
                                    </div>
                                    <div className="font-medium text-slate-900">{formData.raNumber}</div>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Phone size={16} /> Contact
                                    </div>
                                    <div className="font-medium text-slate-900">{formData.phoneNumber}</div>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <MapPin size={16} /> Location
                                    </div>
                                    <div className="font-medium text-slate-900">{formData.location}</div>
                                </div>
                            </div>

                            <div className="flex gap-3 bg-indigo-50 p-4 rounded-lg text-indigo-800 text-sm items-start">
                                <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                                <p>Please confirm all details are correct. Inaccurate information may delay the manual verification process.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
                        {step > 1 ? (
                            <Button type="button" variant="secondary" onClick={handlePrev} disabled={isSubmitting}>
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                        ) : <div />}

                        {step < 3 ? (
                            <Button type="button" onClick={handleNext}>
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 px-6" isLoading={isSubmitting}>
                                Submit Report <Check className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </form>
            </Card>

            {/* Confirmation Modal */}
            {isConfirmOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !isSubmitting && setIsConfirmOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-50/50">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Submit Lost Report?</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Once submitted, this report will be reviewed by <strong>campus administrators</strong>.
                                Admins will manually verify possible matches and contact you if your item is identified.
                                <br /><br />
                                <span className="text-slate-400 text-xs">You may not edit this report immediately after submission.</span>
                            </p>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsConfirmOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmSubmit}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                                    isLoading={isSubmitting}
                                >
                                    Confirm & Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
