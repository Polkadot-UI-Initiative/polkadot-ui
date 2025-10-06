"use client";

import React from "react";
import { Button } from "../ui/button";

export class PreviewBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== "production")
      console.error("Preview error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError)
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-4">
          <div className="text-sm font-medium">Preview failed to render</div>
          {this.state.error?.message && (
            <div
              className="text-xs text-muted-foreground max-w-[640px] truncate"
              title={this.state.error.message}
            >
              {this.state.error.message}
            </div>
          )}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => {
              try {
                localStorage.removeItem("TYPINK::NETWORK_CONNECTIONS");
              } catch {}
              window.location.reload();
            }}
          >
            Reset connection cache & reload
          </Button>
        </div>
      );
    return this.props.children as React.ReactElement;
  }
}
