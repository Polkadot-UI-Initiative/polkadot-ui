import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { TokenMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { formatBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type React from "react";

export interface SelectTokenDialogServices {
  isConnected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  items: TokenMetadata[];
  connectedAccount?: { address?: string } | null;
}

export interface SelectTokenDialogProps<TChainId extends string = string> {
  chainId: TChainId;
  assetIds: number[];
  withBalance: boolean;
  services: SelectTokenDialogServices;
  fallback?: React.ReactNode;
}

export interface SelectTokenDialogBaseProps<TChainId extends string = string>
  extends SelectTokenDialogProps<TChainId> {
  value?: number;
  onChange?: (assetId: number) => void;
  className?: string;
  placeholder?: string;
}

export interface SelectTokenDialogProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function SelectTokenDialogProvider({
  children,
  queryClient = defaultQueryClient,
}: SelectTokenDialogProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function SelectTokenDialogBase<TChainId extends string = string>({
  chainId,
  value,
  onChange,
  placeholder = "Select Token",
  className,
  withBalance,
  services,
  ...props
}: SelectTokenDialogBaseProps<TChainId> & React.ComponentProps<typeof Button>) {
  const { items, connectedAccount, isDisabled, isConnected, isLoading } =
    services;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenMetadata | null>(
    null
  );

  // Initialize selectedToken when items are loaded or value changes
  const displayToken = useMemo(() => {
    if (items.length > 0) {
      // If we have a value prop, try to find the matching token
      if (value != null) {
        const foundToken = items.find((item) => item.assetId === value);
        if (foundToken) {
          setSelectedToken(foundToken);
          return foundToken;
        }
      }
      // If we already have a selected token and it exists in items, keep it
      if (
        selectedToken &&
        items.find((item) => item.assetId === selectedToken.assetId)
      ) {
        return selectedToken;
      }
      // Otherwise, don't auto-select any token - show placeholder
      return null;
    }
    return null;
  }, [value, items, selectedToken]);

  const handleTokenSelect = (token: TokenMetadata) => {
    setSelectedToken(token);
    onChange?.(token.assetId);
    setIsOpen(false);
  };

  // Generate dummy balance for tokens
  const generateDummyBalance = (assetId: number) => {
    // Use assetId as seed for consistent dummy values
    const seed = assetId * 123456789;
    const balance = (seed % 100000) + 10000; // Random balance between 10,000 - 110,000
    return BigInt(balance * Math.pow(10, 12)); // Convert to BigInt with 12 decimals
  };

  const isComponentDisabled =
    isDisabled || !isConnected || (props.disabled ?? false) || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isComponentDisabled}
          className={cn(
            "justify-between min-w-[140px] font-normal",
            !displayToken && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {displayToken ? (
              <>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {displayToken.symbol?.[0]}
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {displayToken.symbol ?? displayToken.name}
                  </span>
                  {connectedAccount?.address && (
                    <span className="text-xs text-muted-foreground">
                      {formatBalance({
                        value: generateDummyBalance(displayToken.assetId),
                        decimals: displayToken.decimals ?? 12,
                      })}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
          <DialogDescription>
            Choose a token from your available balance
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {items.map((token) => {
            const isSelected = selectedToken?.assetId === token.assetId;
            return (
              <div
                key={token.assetId}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors rounded-md border",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary-foreground hover:bg-primary/20"
                    : "border-transparent hover:bg-muted/50 focus:bg-muted/50 hover:border-border focus:border-border"
                )}
                onClick={() => handleTokenSelect(token)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">
                    {token.symbol?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {token.symbol ?? token.name}
                    </span>
                    {connectedAccount?.address && withBalance && (
                      <span className="text-sm font-medium">
                        {formatBalance({
                          value: generateDummyBalance(token.assetId),
                          decimals: token.decimals ?? 12,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {token.name ?? token.symbol}
                    </span>
                    {connectedAccount?.address && withBalance && (
                      <span className="text-xs text-muted-foreground">
                        ≈ $
                        {(
                          Number(
                            formatBalance({
                              value: generateDummyBalance(token.assetId),
                              decimals: token.decimals ?? 12,
                            })
                          ) * 6.5
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
