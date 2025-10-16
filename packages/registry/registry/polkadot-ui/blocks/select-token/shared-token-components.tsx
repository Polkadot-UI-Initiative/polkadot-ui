import { cn } from "@/lib/utils";

export interface TokenLogoWithNetworkProps {
  tokenLogo?: string;
  networkLogo?: string;
  tokenSymbol?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TokenLogoWithNetwork({
  tokenLogo,
  networkLogo,
  tokenSymbol,
  size = "md",
  className,
}: TokenLogoWithNetworkProps) {
  const sizeClasses = {
    sm: { main: "w-5 h-5", network: "w-[10px] h-[10px]", text: "text-xs" },
    md: { main: "w-8 h-8", network: "w-4 h-4", text: "text-sm" },
    lg: { main: "w-12 h-12", network: "w-6 h-6", text: "text-base" },
  };

  const { main, network, text } = sizeClasses[size];

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {/* Main token logo */}
      <div className={cn(main, "rounded-full overflow-hidden")}>
        {tokenLogo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tokenLogo}
              alt={tokenSymbol || "Token"}
              className="w-full h-full object-cover rounded-full"
            />
          </>
        ) : (
          // Fallback gradient with symbol
          <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center rounded-full">
            <span className={cn("font-bold text-white", text)}>
              {tokenSymbol?.[0] || "?"}
            </span>
          </div>
        )}
      </div>

      {/* Network logo overlay */}
      {networkLogo && (
        <div
          className={cn(
            network,
            "absolute -bottom-1 -right-1 rounded-full overflow-hidden"
          )}
        >
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={networkLogo}
              alt="Network"
              className="w-full h-full object-cover rounded-full"
            />
          </>
        </div>
      )}
    </div>
  );
}

export const tokenSelectionStyles = {
  tokenItem: {
    base: "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-md border cursor-pointer",
    selected: "bg-primary/10 border-primary hover:bg-primary/20",
    unselected:
      "border-transparent hover:bg-muted/50 focus:bg-muted/50 hover:border-border focus:border-border",
  },
  tokenContent: {
    container: "flex-1 min-w-0",
    primaryRow: "flex items-center justify-between",
    secondaryRow: "flex items-center justify-between",
    symbol: "font-medium",
    name: "text-xs text-muted-foreground",
    balance: "text-sm font-medium",
    price: "text-xs text-muted-foreground",
  },
  trigger: {
    base: "justify-between min-w-[140px] font-normal py-6 dark:hover:bg-input/50",
    placeholder: "text-muted-foreground",
    content: "flex items-center gap-2",
    tokenInfo: "flex flex-col items-start",
    chevron: "h-4 w-4 transition-transform",
    chevronOpen: "rotate-180",
  },
} as const;
