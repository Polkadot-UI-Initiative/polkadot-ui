interface GitHubStarsProps {
  count?: number;
  className?: string;
}

export function GitHubStars({ count, className = "" }: GitHubStarsProps) {
  if (typeof count !== "number") return null;
  return (
    <span className={`text-xs text-muted-foreground ${className}`}>
      {count.toLocaleString()}
    </span>
  );
}
