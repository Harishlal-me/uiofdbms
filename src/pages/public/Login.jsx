import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui/Primitives';
import { Shield, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Use Auth Context
    const [role, setRole] = useState('user'); // Kept for UI toggle, but login is via email/password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // New state
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const RoleCard = ({ id, label, icon: Icon }) => (
        <div
            onClick={() => setRole(id)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === id
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                }`}
        >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            {role === id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600"></div>}
        </div>
    );

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Illustration */}
            <div className="hidden lg:flex bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="relative z-10 text-white max-w-lg">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Secure Your Campus</h1>
                    <p className="text-indigo-100 text-lg leading-relaxed">
                        Join thousands of students and faculty using CampusSafe to create a more connected and secure environment.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <div className="text-3xl font-bold text-white mb-1">98%</div>
                            <div className="text-indigo-100 text-sm">Recovery Rate</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <div className="text-3xl font-bold text-white mb-1">24h</div>
                            <div className="text-indigo-100 text-sm">Avg. Match Time</div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-3 opacity-60">
                        <div className="text-sm font-semibold tracking-widest">POWERED BY SRM SECURITY</div>
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-slate-500 mt-2">Please select your role to continue</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <RoleCard id="user" label="Student/Staff" icon={GraduationCap} />
                        <RoleCard id="admin" label="Administrator" icon={Shield} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-brand-gradient hover:bg-brand-gradient-hover border-0 shadow-lg shadow-indigo-200" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    {role !== 'admin' && (
                        <p className="text-center mt-8 text-sm text-slate-500">
                            Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
