"use client";

import React, { useState } from "react";

export function PreviewBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  if (error)
    return (
      <div className="border border-destructive/40 bg-destructive/10 text-destructive rounded-md p-3 text-sm">
        Failed to render preview: {error.message}
      </div>
    );
  return <ErrorCatcher onError={setError}>{children}</ErrorCatcher>;
}

function ErrorCatcher({
  children,
  onError,
}: {
  children: React.ReactNode;
  onError: (e: Error) => void;
}) {
  try {
    return <>{children}</>;
  } catch (e) {
    onError(e as Error);
    return null;
  }
}
