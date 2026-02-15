import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Clock, MapPin, ChevronRight, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Primitives';
import Logo from '../../components/ui/Logo';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-700">

            {/* 1. Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Logo />

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#security" className="hover:text-indigo-600 transition-colors">Security</a>
                        <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
                        <Button className="bg-brand-gradient hover:bg-brand-gradient-hover border-0 shadow-lg shadow-indigo-200" onClick={() => navigate('/login')}>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden relative">
                {/* Background Gradients */}
                <div className="absolute top-0 center-0 w-[1000px] h-[1000px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-8 border border-indigo-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            AI Matching System v2.0
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                            Never lose <br />
                            <span className="text-transparent bg-clip-text bg-brand-gradient">anything</span> on campus.
                        </h1>

                        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                            The official AI-powered lost & found system for SRM University.
                            Secure storage, verified recovery, and instant matching.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-brand-gradient hover:bg-brand-gradient-hover border-0 shadow-xl shadow-indigo-200" onClick={() => navigate('/login')}>
                                Report Lost Item <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                                How it Works
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2"><div className="p-1 bg-emerald-100 rounded-full"><CheckCircle2 className="text-emerald-600 w-3.5 h-3.5" /></div> SRM Approved</div>
                            <div className="flex items-center gap-2"><div className="p-1 bg-blue-100 rounded-full"><Clock className="text-blue-600 w-3.5 h-3.5" /></div> 24/7 Matching</div>
                            <div className="flex items-center gap-2"><div className="p-1 bg-violet-100 rounded-full"><ShieldCheck className="text-violet-600 w-3.5 h-3.5" /></div> Secure Storage</div>
                        </div>
                    </div>

                    <div className="relative group perspective-1000">
                        {/* Mock App Interface */}
                        <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-transform duration-500 hover:rotate-y-2 hover:scale-[1.01]">
                            {/* Browser Header */}
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="flex-1 text-center text-xs text-slate-400 font-medium bg-white py-1 rounded-md shadow-sm border border-slate-100 mx-4">
                                    app.campussafe.srm.edu
                                </div>
                            </div>
                            {/* App Content Preview */}
                            <div className="p-1">
                                <img
                                    src="https://placehold.co/800x600/f8fafc/64748b?text=CampusSafe+Administrator+Dashboard"
                                    alt="App Dashboard"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in slide-in-from-bottom-8 fade-in duration-700 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Items Recovered</div>
                                    <div className="text-xs text-slate-500">1,240+ this semester</div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Blobs */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section id="features" className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why trusted by SRM Security?</h2>
                        <p className="text-slate-600 text-lg">We replaced the manual "lost book" register with an intelligent, automated system.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Search, color: "bg-blue-500", title: "AI Image Matching", desc: "Upload a photo and let our computer vision algorithms find matches based on color, object type, and brand." },
                            { icon: Lock, color: "bg-emerald-500", title: "Secure Storage", desc: "All found items are stored in dedicated, access-controlled locations across campus (Library, Main Office)." },
                            { icon: ShieldCheck, color: "bg-violet-500", title: "Verified Recovery", desc: "Claimants must verify ownership through unique identifiers before items are released by security." }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-14 h-14 ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color.replace('bg-', 'text-')}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. How It Works (Timeline) */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="text-indigo-600 font-semibold uppercase tracking-wider text-sm mb-2">Process</div>
                        <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-0 right-0 h-0.5 bg-slate-100">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 w-1/2 mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-12 relative z-10">
                            {[
                                { step: "01", title: "Report", desc: "Submit details and photo of lost/found item." },
                                { step: "02", title: "AI Match", desc: "System instantly compares against database." },
                                { step: "03", title: "Verify", desc: "Admins review high-confidence matches." },
                                { step: "04", title: "Collect", desc: "Owner picks up item from secure storage." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-xl font-bold text-indigo-600 mb-6 shadow-sm relative z-10">
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6 text-white">
                            <Logo className="w-8 h-8" textSize="text-2xl" />
                        </div>
                        <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
                            CampusSafe is the official lost and found management system for SRM University, designed to ensure every lost item finds its way back home securely.
                        </p>
                        <div className="flex gap-4">
                            {/* Social placeholders */}
                            <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-indigo-600 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="font-bold text-white">in</span>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-sky-500 transition-colors cursor-pointer flex items-center justify-center">
                                <span className="font-bold text-white">tw</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security Guidelines</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Report Incident</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>SRM University, Kattankulathur,<br />Chennai, TN 603203</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                                <span>security@srm.edu.in</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-xs">
                    &copy; {new Date().getFullYear()} CampusSafe & SRM University. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
