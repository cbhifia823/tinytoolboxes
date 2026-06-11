import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("React Error Boundary caught:", error, errorInfo);
        // POST error to server for logging
        const route = this.props.route || window.location.pathname;
        fetch("/api/_error", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                route,
                error: error.message,
                stack: error.stack,
            }),
        }).catch(() => {
            // Ignore fetch errors - don't make error handling worse
        });
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === "function"
                    ? this.props.fallback(this.state.error)
                    : this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-8", children: _jsxs("div", { className: "max-w-md text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-destructive mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "This page encountered an error while rendering." }), _jsx("pre", { className: "text-left text-sm bg-muted p-4 rounded-lg overflow-auto max-h-48 text-muted-foreground", children: this.state.error?.message || "Unknown error" }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90", children: "Reload page" })] }) }));
        }
        return this.props.children;
    }
}
