import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '../../components/ui/Primitives';
import { ArrowLeft, CircleCheck, Upload, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ItemClaim() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [proofDesc, setProofDesc] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await api.get(`/matches/${matchId}`);
                setMatch(res.data);

                // Check if already claimed
                try {
                    const claimRes = await api.get(`/claims/match/${matchId}`);
                    if (claimRes.data) {
                        setSuccess(true);
                    }
                } catch (err) {
                    // Ignore 404/400 - means not claimed yet
                }

            } catch (err) {
                console.error("Failed to load match", err);
                setError("Failed to load match details. It may not exist or you don't have permission.");
            } finally {
                setLoading(false);
            }
        };

        if (matchId) fetchMatch();
    }, [matchId]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        setError('');

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        // Debug logging
        console.log('=== CLAIM SUBMISSION DEBUG ===');
        console.log('matchId from params:', matchId);
        console.log('proofDesc:', proofDesc);
        console.log('selectedFile:', selectedFile);

        if (!matchId) {
            setError('Match ID is missing. Please go back and try again.');
            setSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('match_id', matchId);
            formData.append('proof_description', proofDesc);
            if (selectedFile) {
                formData.append('proof_photo', selectedFile);
            }

            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await api.post('/claims', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Claim response:', response.data);
            setSuccess(true);
        } catch (err) {
            console.error('Claim submission error:', err);
            console.error('Error response:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to submit claim');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading match details...</div>;

    if (success) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-8 text-center space-y-4 border-l-4 border-l-green-500">
                    <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CircleCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Claim Submitted!</h2>
                    <p className="text-slate-600">
                        Your claim has been recorded. The admin will review your proof and facilitate the Item Collection.
                    </p>
                    <div className="pt-4">
                        <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!match) return (
        <div className="max-w-2xl mx-auto p-8 text-center text-red-500">
            {error || "Match not found."}
            <div className="mt-4"><Button variant="outline" onClick={() => navigate('/dashboard')}>Go Back</Button></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Claim Found Item</h1>
                    <p className="text-slate-500">Provide proof of ownership to claim this item.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Item Details Card */}
                <Card className="p-6 space-y-4 h-fit">
                    <h3 className="font-bold text-slate-900 border-b pb-2">Item Details</h3>

                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Found Item</span>
                        <div className="font-medium text-slate-900 mt-1">{match.found?.name || 'N/A'}</div>
                        <p className="text-sm text-slate-500">{match.found?.desc || 'No description'}</p>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Report</span>
                        <div className="font-medium text-slate-900 mt-1">{match.lost?.name || 'N/A'}</div>
                        <p className="text-sm text-slate-500">{match.lost?.desc || 'No description'}</p>
                    </div>

                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Location</span>
                        <div className="flex items-start gap-2 mt-1">
                            <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium">
                                {match.found?.storage || "Central Storage"}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Claim Form */}
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Proof Description
                            </label>
                            <textarea
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[120px]"
                                placeholder="Describe unique features (scratches, stickers, contents) that prove this is yours..."
                                value={proofDesc}
                                onChange={(e) => setProofDesc(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Proof Photo (Optional but Recommended)
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50 relative"
                            >
                                {previewUrl ? (
                                    <div className="relative">
                                        <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                setPreviewUrl('');
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto text-slate-400 mb-2" />
                                        <div className="text-sm text-slate-600">Click to upload photo of receipt, older photo of item, etc.</div>
                                        <div className="text-xs text-slate-400 mt-1">Max 5MB • JPG, PNG, GIF</div>
                                    </>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={submitting || !proofDesc.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {submitting ? 'Submitting...' : 'Submit Claim Request'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
