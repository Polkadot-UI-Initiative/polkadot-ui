"use client";

import { useEffect, useState } from "react";

interface GitHubStarsProps {
  repo: string; // format: "owner/repo"
  className?: string;
}

export function GitHubStars({ repo, className = "" }: GitHubStarsProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, [repo]);

  if (loading) {
    return (
      <span
        className={`text-xs text-muted-foreground animate-pulse ${className}`}
      >
        ...
      </span>
    );
  }

  if (stars === null) {
    return null;
  }

  return (
    <span className={`text-xs text-muted-foreground ${className}`}>
      {stars?.toLocaleString()}
    </span>
  );
}