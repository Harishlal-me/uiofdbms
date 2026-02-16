import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

export function Card({ children, className, ...props }) {
    return (
        <div className={clsx("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, className, ...props }) {
    const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus:ring-indigo-500",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-md",
        md: "px-4 py-2 text-sm rounded-lg",
        lg: "px-6 py-3 text-base rounded-lg"
    };

    return (
        <button className={clsx(base, variants[variant], sizes[size], className)} disabled={isLoading} {...props}>
            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}

export function Badge({ variant = 'neutral', children }) {
    const variants = {
        neutral: "bg-slate-100 text-slate-700 border-slate-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        danger: "bg-rose-50 text-rose-700 border-rose-200",
        info: "bg-blue-50 text-blue-700 border-blue-200"
    };

    return (
        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", variants[variant])}>
            {children}
        </span>
    );
}

export function Input({ label, error, className, ...props }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
            <input
                className={clsx(
                    "w-full h-10 px-3 rounded-lg border bg-white text-sm transition-all focus:outline-none focus:ring-2",
                    error
                        ? "border-red-300 focus:ring-red-200 text-red-900 placeholder-red-300"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100 text-slate-900 placeholder-slate-400"
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
