
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '../../components/ui/Primitives';
import { Shield, User, GraduationCap, Mail, Phone, Lock, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        raNumber: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const res = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            ra_reg_no: formData.raNumber,
            role: 'student' // Default to student
        });

        if (res.success) {
            alert("Account created successfully! Please login.");
            navigate('/login');
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Illustration (Same as Login for consistency) */}
            <div className="hidden lg:flex bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Join CampusSafe</h1>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        Create an account to report lost items, help others find theirs, and earn CS Credits for being a good samaritan.
                    </p>
                </div>
            </div>

            {/* Right: Register Form */}
            <div className="bg-white flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
                        <p className="text-slate-500 mt-2">Enter your details to get started</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@university.edu"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="RA Number (Registration)"
                            placeholder="RA211100..."
                            value={formData.raNumber}
                            onChange={e => setFormData({ ...formData, raNumber: e.target.value.toUpperCase() })}
                            required
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" className="w-full h-12 text-base bg-brand-gradient hover:bg-brand-gradient-hover shadow-lg shadow-indigo-200" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
