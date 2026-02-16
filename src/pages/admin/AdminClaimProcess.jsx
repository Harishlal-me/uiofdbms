import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '../../components/ui/Primitives';
import { ArrowLeft, CircleCheck, Upload, AlertCircle, User, Calendar } from 'lucide-react';
import api from '../../services/api';

export default function AdminClaimProcess() {
    const { matchId } = useParams();
    const navigate = useNavigate();

    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [collectionPhoto, setCollectionPhoto] = useState('');
    const [damageFound, setDamageFound] = useState(false);
    const [damageNotes, setDamageNotes] = useState('');

    useEffect(() => {
        const fetchClaimDetails = async () => {
            try {
                // Fetch claim details with complete information including both photos
                const claimRes = await api.get(`/claims/match/${matchId}`);
                if (!claimRes.data) {
                    setError("No claim found for this match.");
                    setLoading(false);
                    return;
                }

                setClaim(claimRes.data);

            } catch (err) {
                console.error("Failed to load details", err);
                setError("Failed to load claim details.");
            } finally {
                setLoading(false);
            }
        };

        if (matchId) fetchClaimDetails();
    }, [matchId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            console.log('Submitting condition report for match_id:', matchId);
            console.log('damage_found:', damageFound);
            console.log('damage_notes:', damageFound ? damageNotes : null);

            // Send JSON data - no file upload needed
            const response = await api.post('/claims/condition', {
                match_id: matchId,
                damage_found: damageFound,
                damage_notes: damageFound ? damageNotes : null
            });

            console.log('Condition report submitted successfully:', response.data);
            setSuccess(true);
        } catch (err) {
            console.error('Failed to submit condition report:', err);
            console.error('Error response:', err.response?.data);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit condition report';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;

    if (success) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-8 text-center space-y-4 border-l-4 border-l-green-500">
                    <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CircleCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Collection Verified!</h2>
                    <p className="text-slate-600">
                        The collection has been verified and the case is now closed. All related records have been marked as Resolved.
                    </p>
                    <div className="pt-4">
                        <Button variant="outline" onClick={() => navigate('/admin/claims')}>
                            Back to Claims List
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!claim) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Collection Verification</h1>
                    <p className="text-slate-500">Verify item condition after owner collection and close case.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Info Column */}
                <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 border-b pb-2">Claim Information</h3>

                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Claimant Proof</span>
                            <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 italic border border-slate-100">
                                "{claim.proof_description}"
                            </div>
                        </div>

                        {claim.proof_photo_url && (
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Proof Photo</span>
                                <img src={claim.proof_photo_url} alt="Proof" className="w-full h-48 object-cover rounded-lg border border-slate-200" />
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t">
                            <Calendar size={14} /> Claimed on: {new Date(claim.claim_date).toLocaleDateString()}
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 border-b pb-2">Photo Comparison</h3>
                        <p className="text-xs text-slate-500 mb-4">
                            Compare the finder's photo (when found) with the owner's pickup photo (after collection from storage) to verify item condition.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Finder Photo */}
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                    Finder Photo (When Found)
                                </span>
                                {claim.finder_photo ? (
                                    <img
                                        src={claim.finder_photo}
                                        alt="Finder's photo when item was found"
                                        className="w-full h-48 object-cover rounded-lg border-2 border-slate-200"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                                        <p className="text-sm text-slate-400">No image uploaded</p>
                                    </div>
                                )}
                            </div>

                            {/* Owner Collection Photo */}
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                    Owner Pickup Photo (After Collection)
                                </span>
                                {claim.owner_collection_photo ? (
                                    <img
                                        src={claim.owner_collection_photo}
                                        alt="Owner's photo at collection"
                                        className="w-full h-48 object-cover rounded-lg border-2 border-indigo-200"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                                        <p className="text-sm text-slate-400">No image uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 border-b pb-2">Item Details</h3>
                        <div>
                            <h4 className="font-medium text-slate-900">{claim.found_item_name || "Found Item"}</h4>
                            <p className="text-sm text-slate-500">{claim.found_item_desc || "No description"}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant="info">Stored: {claim.storage_location || "Unknown"}</Badge>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Form Column */}
                <Card className="p-6 space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                        <CircleCheck size={20} className="text-indigo-600" />
                        Condition Verification
                    </h3>
                    <p className="text-sm text-slate-500">
                        Review the photos above and indicate if any damage was detected during owner collection.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Removed Collection Photo upload section entirely */}

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={damageFound}
                                    onChange={(e) => setDamageFound(e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="font-medium text-slate-900">Damage Detected?</span>
                            </label>

                            {damageFound && (
                                <div className="pl-2 border-l-2 border-red-200">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Damage Notes
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                                        placeholder="Describe the damage..."
                                        value={damageNotes}
                                        onChange={(e) => setDamageNotes(e.target.value)}
                                        rows={3}
                                        required={damageFound}
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            disabled={submitting}
                        >
                            {submitting ? 'Closing Case...' : 'Confirm Collection & Close Case'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
