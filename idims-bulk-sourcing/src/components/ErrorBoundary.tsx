import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught IDIMS Application Error:", error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="bg-card text-card-foreground border border-border rounded-xl p-8 max-w-md w-full shadow-lg text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto border border-destructive/20">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                Something went wrong in IDIMS
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An unhandled error occurred while rendering this module. You can reload the application to restore state.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-muted border border-border rounded-md text-[11px] font-mono text-muted-foreground text-left overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload IDIMS Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
