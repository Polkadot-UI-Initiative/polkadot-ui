import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  formatTokenBalance,
  formatTokenPrice,
  getTokenLogo,
  getTokenBalance,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  TokenLogoWithNetwork,
  tokenSelectionStyles,
} from "./shared-token-components";
import {
  TokenInfo,
  NetworkInfoLike,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export interface SelectTokenDialogServices {
  isConnected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  chainTokens: TokenInfo[];
  connectedAccount?: { address?: string } | null;
  network?: NetworkInfoLike;
  balances?: Record<number, bigint | null>;
}

export interface SelectTokenDialogProps {
  chainId: string;
  assetIds: number[];
  withBalance: boolean;
  services: SelectTokenDialogServices;
  fallback?: React.ReactNode;
}

export interface SelectTokenDialogBaseProps extends SelectTokenDialogProps {
  value?: number;
  onChange?: (assetId: number) => void;
  className?: string;
  placeholder?: string;
  compact?: boolean;
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

interface TokenDialogItemProps {
  token: TokenInfo;
  isSelected?: boolean;
  onClick?: () => void;
  withBalance?: boolean;
  balance?: bigint | null;
  tokenLogo?: string;
  network?: NetworkInfoLike;
  connectedAccount?: { address?: string } | null;
  className?: string;
  logoSize?: "sm" | "md" | "lg";
}

function TokenDialogItem({
  token,
  isSelected = false,
  onClick,
  withBalance = false,
  balance,
  tokenLogo,
  network,
  connectedAccount,
  className,
  logoSize = "md",
}: TokenDialogItemProps) {
  const styles = tokenSelectionStyles.tokenItem;
  const contentStyles = tokenSelectionStyles.tokenContent;

  return (
    <div
      className={cn(
        styles.base,
        isSelected ? styles.selected : styles.unselected,
        className
      )}
      onClick={onClick}
    >
      <TokenLogoWithNetwork
        tokenLogo={tokenLogo}
        networkLogo={network?.logo}
        tokenSymbol={token.symbol}
        size={logoSize}
      />
      <div className={contentStyles.container}>
        <div className={contentStyles.primaryRow}>
          <div className={contentStyles.symbol}>{token.symbol}</div>
          {connectedAccount?.address && withBalance && (
            <span className={contentStyles.balance}>
              {formatTokenBalance(balance ?? null, token.decimals)}
            </span>
          )}
        </div>
        <div className={contentStyles.secondaryRow}>
          <span className={contentStyles.name}>{token.name}</span>
          {connectedAccount?.address && withBalance && (
            <span className={contentStyles.price}>
              ≈ ${formatTokenPrice(balance ?? null, token.decimals)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function SelectTokenDialogCompactBase({
  value,
  onChange,
  placeholder = "Token",
  className,
  withBalance,
  services,
  ...props
}: SelectTokenDialogBaseProps &
  Omit<React.ComponentProps<typeof Button>, "onChange">) {
  return (
    <SelectTokenDialogBase
      {...props}
      compact={true}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      withBalance={withBalance}
      services={services}
    />
  );
}

export function SelectTokenDialogBase({
  value,
  onChange,
  placeholder = "Select Token",
  className,
  withBalance,
  compact = false,
  services,
  ...props
}: SelectTokenDialogBaseProps &
  Omit<React.ComponentProps<typeof Button>, "onChange">) {
  const {
    connectedAccount,
    isDisabled,
    isConnected,
    isLoading,
    chainTokens,
    network,
    balances,
  } = services;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);

  // Keep selectedToken in sync with props.value and available chainTokens
  useEffect(() => {
    if (!chainTokens || chainTokens.length === 0) {
      setSelectedToken(null);
      return;
    }
    // If value is provided, prefer it
    if (value != null) {
      const next = chainTokens.find(
        (token) => Number(token.assetId) === (value as number)
      );
      setSelectedToken(next ?? null);
      return;
    }
    // If selectedToken became invalid due to token list change, clear it
    if (selectedToken && !chainTokens.find((t) => t.id === selectedToken.id)) {
      setSelectedToken(null);
    }
  }, [value, chainTokens, selectedToken]);

  const displayToken = useMemo(() => {
    if (!chainTokens || chainTokens.length === 0) return null;
    if (value != null) {
      const found = chainTokens.find(
        (token) => Number(token.assetId) === (value as number)
      );
      if (found) return found;
    }
    if (selectedToken && chainTokens.find((t) => t.id === selectedToken.id)) {
      return selectedToken;
    }
    return null;
  }, [value, chainTokens, selectedToken]);

  const handleTokenSelect = (token: TokenInfo) => {
    setSelectedToken(token);
    onChange?.(Number(token.assetId));
    setIsOpen(false);
  };

  const isComponentDisabled =
    isDisabled ||
    !isConnected ||
    (props.disabled ?? false) ||
    isLoading ||
    chainTokens?.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          //TODO pass other button props
          variant={props.variant ?? "outline"}
          disabled={props.disabled ?? isComponentDisabled}
          className={cn(
            compact ? "h-10 max-w-fit" : tokenSelectionStyles.trigger.base,
            !displayToken &&
              !compact &&
              tokenSelectionStyles.trigger.placeholder,
            compact &&
              "border-input bg-background hover:bg-accent hover:text-accent-foreground",
            className
          )}
        >
          {compact ? (
            <>
              {displayToken ? (
                <TokenLogoWithNetwork
                  tokenLogo={getTokenLogo(
                    chainTokens,
                    Number(displayToken.assetId)
                  )}
                  networkLogo={network?.logo}
                  tokenSymbol={displayToken.symbol}
                  size="sm"
                />
              ) : (
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 opacity-50 transition-transform duration-200 flex-shrink-0",
                  isOpen && "rotate-180"
                )}
              />
            </>
          ) : (
            <>
              <div className={tokenSelectionStyles.trigger.content}>
                {displayToken ? (
                  <>
                    <TokenLogoWithNetwork
                      tokenLogo={getTokenLogo(
                        chainTokens,
                        Number(displayToken.assetId)
                      )}
                      networkLogo={network?.logo}
                      tokenSymbol={displayToken.symbol}
                      size="sm"
                    />
                    <div className={tokenSelectionStyles.trigger.tokenInfo}>
                      <span className="font-medium">{displayToken.symbol}</span>
                      <span className="text-xs text-muted-foreground">
                        {displayToken.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <span>{placeholder}</span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  tokenSelectionStyles.trigger.chevron,
                  isOpen && tokenSelectionStyles.trigger.chevronOpen
                )}
              />
            </>
          )}
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
          {chainTokens?.map((token) => {
            const isSelected = selectedToken?.assetId === token.assetId;
            return (
              <TokenDialogItem
                key={token.id}
                token={token}
                isSelected={isSelected}
                onClick={() => handleTokenSelect(token)}
                withBalance={withBalance}
                balance={getTokenBalance(
                  balances,
                  connectedAccount,
                  Number(token.assetId)
                )}
                tokenLogo={getTokenLogo(chainTokens, Number(token.assetId))}
                network={network}
                connectedAccount={connectedAccount}
                logoSize="md"
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
