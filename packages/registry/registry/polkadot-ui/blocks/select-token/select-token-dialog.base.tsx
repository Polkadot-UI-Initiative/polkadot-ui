import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/registry/polkadot-ui/ui/input";
import { ChevronDown } from "lucide-react";
import {
  formatTokenBalance,
  formatTokenPrice,
  getTokenBalance,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  TokenLogoWithNetwork,
  tokenSelectionStyles,
} from "@/registry/polkadot-ui/blocks/select-token/shared-token-components";
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
  assetIds: number[];
  services: SelectTokenDialogServices;
  withBalance?: boolean;
  withSearch?: boolean;
  includeNative?: boolean;
  chainId?: string;
  fallback?: React.ReactNode;
  balancePrecision?: number;
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
  balancePrecision?: number;
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
  balancePrecision = 2,
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
              {formatTokenBalance(
                balance ?? null,
                token.decimals,
                balancePrecision
              )}
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
  fallback,
  balancePrecision = 2,
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
      fallback={fallback}
      balancePrecision={balancePrecision}
    />
  );
}

export function SelectTokenDialogBase({
  value,
  onChange,
  placeholder = "Select Token",
  className,
  withBalance,
  withSearch = false,
  compact = false,
  services,
  variant,
  disabled,
  balancePrecision = 2,
  ...props
}: Omit<SelectTokenDialogBaseProps, "assetIds" | "chainId"> &
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

  const [searchQuery, setSearchQuery] = useState("");

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
    isDisabled || !isConnected || isLoading || chainTokens?.length === 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const filteredTokens = useMemo(() => {
    return chainTokens?.filter(
      (token) =>
        // Search by symbol or name
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chainTokens, searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant ?? "outline"}
          disabled={isComponentDisabled || !!disabled}
          className={cn(
            compact ? "h-10 max-w-fit" : tokenSelectionStyles.trigger.base,
            !displayToken &&
              !compact &&
              tokenSelectionStyles.trigger.placeholder,
            compact &&
              "border-input bg-background hover:bg-accent hover:text-accent-foreground",
            className
          )}
          {...props}
        >
          {compact ? (
            <>
              {displayToken ? (
                <TokenLogoWithNetwork
                  tokenLogo={displayToken.logo}
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
                      tokenLogo={displayToken.logo}
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
        {withSearch && (
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for a token"
          />
        )}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredTokens && filteredTokens.length > 0 ? (
            filteredTokens?.map((token) => {
              const isSelected = displayToken?.assetId === token.assetId;
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
                    token.assetId
                  )}
                  tokenLogo={token.logo}
                  network={network}
                  connectedAccount={connectedAccount}
                  logoSize="md"
                  balancePrecision={balancePrecision}
                />
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tokens found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
