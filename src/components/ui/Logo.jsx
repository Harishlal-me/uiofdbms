import { Shield, MapPin } from 'lucide-react';

export default function Logo({ className = "w-8 h-8", textSize = "text-xl", showText = true }) {
    return (
        <div className="flex items-center gap-2 select-none">
            <div className={`relative ${className} flex items-center justify-center`}>
                {/* Combined Icon: Shield + Pin */}
                <div className="absolute inset-0 bg-brand-gradient rounded-xl transform rotate-3 shadow-lg opacity-20"></div>
                <div className="absolute inset-0 bg-brand-gradient rounded-xl shadow-md flex items-center justify-center text-white">
                    <Shield size={18} className="absolute" fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
                    <MapPin size={14} className="absolute mb-0.5 text-white" fill="white" />
                </div>
            </div>
            {showText && (
                <div className={`font-bold ${textSize} tracking-tight text-slate-900`}>
                    Campus<span className="text-transparent bg-clip-text bg-brand-gradient">Safe</span>
                </div>
            )}
        </div>
    );
}
