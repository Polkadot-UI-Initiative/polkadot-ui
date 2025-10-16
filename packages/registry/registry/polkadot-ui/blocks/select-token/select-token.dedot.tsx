"use client";

import { useMemo } from "react";
import type React from "react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/hooks/use-asset-metadata.dedot";
import { useAssetBalances } from "@/registry/polkadot-ui/hooks/use-asset-balance.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenBaseProps,
  SelectTokenBase,
} from "./select-token.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";
import {
  createDefaultChainTokens,
  mergeWithChaindataTokens,
  NATIVE_TOKEN_KEY,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";

export type SelectTokenProps = Omit<
  SelectTokenBaseProps,
  "services" | "withBalance"
> &
  React.ComponentProps<typeof Select> & {
    withBalance?: boolean;
    connectedAddress?: string;
  };

export function SelectTokenInner(props: SelectTokenProps) {
  // by default, add native token to the list of tokens with includeNative
  const {
    includeNative = true,
    showAll = true,
    connectedAddress,
    chainId,
    assetIds,
    withBalance = false,
    balancePrecision,
    value,
    onChange,
    placeholder,
    className,
    disabled,
    fallback,
    ...restProps
  } = props;
  const { client, status } = usePolkadotClient(chainId ?? paseoAssetHub.id);
  const { connectedAccount, supportedNetworks } = useTypink();

  const effectiveAddress = connectedAddress || connectedAccount?.address;

  const { assets, isLoading } = useAssetMetadata({
    chainId: chainId,
    assetIds: assetIds,
  });

  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: chainId ?? paseoAssetHub.id,
    assetIds: includeNative ? [...assetIds, NATIVE_TOKEN_KEY] : assetIds,
    address: effectiveAddress ?? "",
  });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    chainId ?? paseoAssetHub.id,
    includeNative ? [...assetIds, NATIVE_TOKEN_KEY] : assetIds,
    {
      showAll,
    }
  );

  const network = supportedNetworks.find(
    (n) => n.id === (chainId ?? paseoAssetHub.id)
  );

  const services = useMemo(() => {
    const chainIdForTokens = chainId ?? paseoAssetHub.id;
    const defaultTokens = createDefaultChainTokens(
      assets ?? [],
      chainIdForTokens
    );
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      chainTokens ?? []
    );

    const combinedBalances: Record<number, bigint | null> = { ...balances };

    return {
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading: isLoading || tokensLoading || tokenBalancesLoading,
      items: assets ?? [],
      connectedAccount: effectiveAddress ? { address: effectiveAddress } : null,
      isDisabled:
        (disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        assetIds.length === 0,
      chainTokens: finalTokens,
      balances: combinedBalances,
      network,
    };
  }, [
    status,
    isLoading,
    tokensLoading,
    tokenBalancesLoading,
    assets,
    connectedAccount,
    effectiveAddress,
    disabled,
    chainId,
    client,
    assetIds,
    chainTokens,
    balances,
    network,
    // includeNative is handled before calling hooks and not needed here
  ]);

  return (
    <SelectTokenBase
      {...restProps}
      chainId={chainId}
      assetIds={assetIds}
      withBalance={withBalance}
      services={services}
      balancePrecision={balancePrecision}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      connectedAddress={connectedAddress}
    />
  );
}

function SelectTokenFallback(props: SelectTokenProps) {
  return (
    <Select disabled>
      <SelectTrigger
        className={cn("min-w-[140px] text-muted-foreground", props.className)}
      >
        <div className="flex items-center gap-2">
          {/* Loading skeleton for token logo */}
          <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
          <SelectValue placeholder="Loading tokens..." />
        </div>
        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
      </SelectTrigger>
    </Select>
  );
}

export function SelectToken(props: SelectTokenProps) {
  return (
    <ClientOnly fallback={<SelectTokenFallback {...props} />}>
      <SelectTokenInner {...props} />
    </ClientOnly>
  );
}

// Wrapped version with provider for drop-in usage
export function SelectTokenWithProvider(props: SelectTokenProps) {
  return (
    <PolkadotProvider>
      <SelectToken {...props} />
    </PolkadotProvider>
  );
}

SelectTokenWithProvider.displayName = "SelectTokenWithProvider";
