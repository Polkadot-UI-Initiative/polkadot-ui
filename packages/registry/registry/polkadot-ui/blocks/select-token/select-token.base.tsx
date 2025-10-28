import type React from "react";
import { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatTokenBalance,
  getTokenBalance,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type TokenMetadata } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { type TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { type NetworkInfoLike } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { TokenLogoWithNetwork } from "@/registry/polkadot-ui/blocks/select-token/shared-token-components";

export interface SelectTokenServices {
  isConnected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  items: TokenMetadata[];
  connectedAccount?: { address?: string } | null;
  chainTokens?: TokenInfo[];
  balances?: Record<number, bigint | null>;
  network?: NetworkInfoLike;
}

export interface SelectTokenBaseProps<TChainId extends string = string> {
  chainId: TChainId;
  assetIds: number[];
  withBalance: boolean;
  services: SelectTokenServices;
  includeNative?: boolean;
  showAll?: boolean;
  fallback?: React.ReactNode;
  balancePrecision?: number;
  value?: number;
  onChange?: (assetId: number | undefined) => void;
  placeholder?: string;
  className?: string;
  connectedAddress?: string;
}

export function SelectTokenBase<TChainId extends string = string>({
  value,
  onChange,
  placeholder = "Select token",
  className,
  withBalance,
  services,
  balancePrecision = 2,
  connectedAddress,
  ...props
}: SelectTokenBaseProps<TChainId> & React.ComponentProps<typeof Select>) {
  const {
    isConnected,
    isLoading,
    connectedAccount,
    isDisabled,
    chainTokens,
    balances,
    network,
  } = services;

  const effectiveAddress = connectedAddress || connectedAccount?.address;

  // Memoize filtered tokens based on optional assetIds to avoid work on each render
  const tokenOptions = useMemo(() => {
    const all = chainTokens ?? [];
    const assetIds = props.assetIds ?? [];
    if (!assetIds.length) return all;

    const allowedNumericIds = new Set(assetIds);

    return all.filter((token) => {
      if (token.assetId === "substrate-native") {
        return true;
      }

      const numericAssetId = Number(token.assetId);
      return !isNaN(numericAssetId) && allowedNumericIds.has(numericAssetId);
    });
  }, [chainTokens, props.assetIds]);

  const handleValueChange = (v: string) => {
    props.onValueChange?.(v);
    if (v === "select-token") {
      onChange?.(undefined);
    } else {
      onChange?.(Number(v));
    }
  };

  return (
    <Select
      {...props}
      value={
        value != null ? String(value) : (props as { value?: string }).value
      }
      onValueChange={handleValueChange}
      disabled={isDisabled || isLoading}
      defaultValue="select-token"
    >
      <SelectTrigger className={cn("dark:bg-background", className)}>
        <div className="flex items-center flex-row gap-2">
          <SelectValue placeholder={placeholder} />
          {(isLoading || !isConnected) && (
            <Loader2 className="ml-auto size-3 animate-spin text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="select-token">Select Token</SelectItem>
        {tokenOptions?.map((token) => (
          <TokenSelectItem
            key={token.id}
            token={token}
            network={network}
            balance={getTokenBalance(
              balances,
              effectiveAddress ? { address: effectiveAddress } : null,
              token.assetId
            )}
            tokenLogo={token.logo}
            withBalance={withBalance}
            effectiveAddress={effectiveAddress}
            balancePrecision={balancePrecision}
          />
        ))}
      </SelectContent>
    </Select>
  );
}

SelectTokenBase.displayName = "SelectTokenBase";

function TokenSelectItem({
  token,
  withBalance,
  balance,
  network,
  tokenLogo,
  effectiveAddress,
  balancePrecision = 2,
}: {
  token: TokenInfo;
  withBalance: boolean;
  balance: bigint | null;
  network?: NetworkInfoLike;
  tokenLogo?: string;
  effectiveAddress?: string;
  balancePrecision?: number;
}) {
  return (
    <SelectItem
      value={token.assetId ?? token.id}
      className="flex items-center justify-between w-full gap-3 p-3"
    >
      <div className="flex items-center gap-2">
        <TokenLogoWithNetwork
          tokenLogo={tokenLogo}
          networkLogo={network?.logo}
          tokenSymbol={token.symbol}
          size="sm"
        />
        <span className="font-medium">
          {effectiveAddress &&
            withBalance &&
            formatTokenBalance(balance, token.decimals, balancePrecision)}{" "}
          {token.symbol}
        </span>
      </div>
    </SelectItem>
  );
}
