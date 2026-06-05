import React from 'react';

/**
 * App-wide error boundary. Catches render/runtime errors in the React tree
 * so a single failure shows a friendly recovery screen instead of a blank page.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production this is where you'd report to a monitoring service.
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-[#020617] text-white font-sans flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-[28px] p-8 md:p-10 backdrop-blur-3xl shadow-2xl text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-400">Something broke</div>
          <h1 className="mt-3 text-2xl md:text-3xl font-black italic tracking-tighter">
            Unexpected Error
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            The app hit an unexpected error. Your saved resumes are safe in the cloud.
            Try reloading to continue.
          </p>
          {this.state.error?.message && (
            <p className="mt-4 text-[11px] font-mono text-rose-300/70 break-words bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReload}
            className="mt-8 w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.35em] transition-all active:scale-[0.99]"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
