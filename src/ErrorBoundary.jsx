import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="text-3xl font-black mb-2">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:brightness-110 transition"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}