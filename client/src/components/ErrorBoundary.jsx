import { Component } from 'react';
import { Button } from './ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 text-center max-w-md">
            <div className="text-5xl mb-4">😵</div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-text-muted text-sm mb-6">An unexpected error occurred. Please refresh the page.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
