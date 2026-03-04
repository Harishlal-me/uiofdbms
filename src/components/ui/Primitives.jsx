import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

export function Card({ children, className, ...props }) {
    return (
        <div className={clsx("bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300", className)} {...props}>
            {children}
        </div>
    );
}

export function Button({ variant = 'primary', size = 'md', isLoading, children, className, ...props }) {
    const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none focus:ring-indigo-500",
        secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-200 dark:focus:ring-slate-700",
        ghost: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
        danger: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-100 dark:border-red-800/50"
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
        neutral: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        success: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
        warning: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
        danger: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
        info: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50"
    };

    return (
        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors", variants[variant])}>
            {children}
        </span>
    );
}

export function Input({ label, error, className, ...props }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
            <input
                className={clsx(
                    "w-full h-10 px-3 rounded-lg border bg-white dark:bg-slate-900 text-sm transition-all focus:outline-none focus:ring-2",
                    error
                        ? "border-red-300 dark:border-red-700 focus:ring-red-200 dark:focus:ring-red-900/30 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700"
                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
        </div>
    );
}
