"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] w-full flex flex-col items-center justify-center px-6 py-16 bg-background text-foreground">
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you’re looking for doesn’t exist or was moved. Check the URL
          or go back home.
        </p>
        <div className="pt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-input bg-primary text-primary-foreground hover:opacity-90 transition-colors px-4 py-2 text-sm font-medium"
          >
            Go home
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center rounded-md border border-input bg-secondary text-secondary-foreground hover:opacity-90 transition-colors px-4 py-2 text-sm font-medium"
          >
            View docs
          </Link>
        </div>
      </div>
    </main>
  );
}
