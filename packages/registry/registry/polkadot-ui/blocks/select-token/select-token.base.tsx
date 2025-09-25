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
import {
  formatTokenBalance,
  getTokenBalance,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { TokenMetadata } from "@/registry/polkadot-ui/hooks/use-asset-metadata.dedot";
import { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { NetworkInfoLike } from "@/registry/polkadot-ui/lib/types.dot-ui";
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

export interface SelectTokenProps<TChainId extends string = string> {
  chainId: TChainId;
  assetIds: number[];
  withBalance: boolean;
  services: SelectTokenServices;
  includeNative?: boolean;
  showAll?: boolean;
  fallback?: React.ReactNode;
  balancePrecision?: number;
}

export interface SelectTokenBaseProps<TChainId extends string = string>
  extends SelectTokenProps<TChainId> {
  value?: number;
  onChange?: (assetId: number) => void;
  placeholder?: string;
  className?: string;
}

export function SelectTokenBase<TChainId extends string = string>({
  value,
  onChange,
  placeholder = "Select token",
  className,
  withBalance,
  services,
  balancePrecision = 2,
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
    onChange?.(Number(v));
  };

  return (
    <Select
      {...props}
      value={
        value != null ? String(value) : (props as { value?: string }).value
      }
      onValueChange={handleValueChange}
      disabled={isDisabled || isLoading}
    >
      <SelectTrigger className={className}>
        <div className="flex items-center flex-row gap-2">
          <SelectValue placeholder={placeholder} />
          {(isLoading || !isConnected) && (
            <Loader2 className="ml-auto size-3 animate-spin text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {tokenOptions?.map((token) => (
          <TokenSelectItem
            key={token.id}
            token={token}
            network={network}
            balance={getTokenBalance(balances, connectedAccount, token.assetId)}
            tokenLogo={token.logo}
            withBalance={withBalance}
            connectedAccount={connectedAccount}
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
  connectedAccount,
  balancePrecision = 2,
}: {
  token: TokenInfo;
  withBalance: boolean;
  balance: bigint | null;
  network?: NetworkInfoLike;
  tokenLogo?: string;
  connectedAccount?: { address?: string } | null;
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
          {connectedAccount?.address &&
            withBalance &&
            formatTokenBalance(balance, token.decimals, balancePrecision)}{" "}
          {token.symbol}
        </span>
      </div>
    </SelectItem>
  );
}
