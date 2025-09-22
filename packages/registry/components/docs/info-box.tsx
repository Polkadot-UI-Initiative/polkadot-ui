import { CircleAlert, Info, TriangleAlert } from "lucide-react";

type InfoBoxVariant = "info" | "warning" | "error";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<
  InfoBoxVariant,
  { container: string; icon: string }
> = {
  info: {
    container:
      "bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100",
    icon: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    container:
      "bg-orange-50 border border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-100",
    icon: "text-orange-600 dark:text-orange-400",
  },
  error: {
    container:
      "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100",
    icon: "text-red-600 dark:text-red-400",
  },
};

function InfoIcon({ variant }: { variant: InfoBoxVariant }) {
  if (variant === "warning") {
    return <TriangleAlert className="h-5 w-5" />;
  }
  if (variant === "error") {
    return <CircleAlert className="h-5 w-5" />;
  }
  return <Info className="h-5 w-5" />;
}

export function InfoBox({
  variant = "info",
  children,
  className,
}: InfoBoxProps) {
  const styles = variantClasses[variant];
  return (
    <div
      className={`rounded-md p-4 flex items-center gap-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 ${styles.container} ${
        className ? className : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={`shrink-0 ${styles.icon}`}>
        <InfoIcon variant={variant} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
