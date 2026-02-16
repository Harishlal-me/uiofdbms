import React from 'react';
import { Button } from './ui/Primitives';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught Error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            The application encountered an unexpected error.
                        </p>

                        <div className="bg-slate-100 p-4 rounded-lg overflow-auto max-h-40 text-xs font-mono mb-6 text-slate-700">
                            {this.state.error && this.state.error.toString()}
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={() => window.location.reload()} className="w-full">
                                Reload Page
                            </Button>
                            <Button variant="secondary" onClick={() => window.location.href = '/'} className="w-full">
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
