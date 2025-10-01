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

export type SelectTokenProps = Omit<SelectTokenBaseProps, "services"> &
  React.ComponentProps<typeof Select>;

export function SelectTokenInner(props: SelectTokenProps) {
  // by default, add native token to the list of tokens with includeNative
  const { includeNative = true, showAll = true, ...restProps } = props;
  const { client, status } = usePolkadotClient(
    restProps.chainId ?? paseoAssetHub.id
  );
  const { connectedAccount, supportedNetworks } = useTypink();

  const { assets, isLoading } = useAssetMetadata({
    chainId: restProps.chainId,
    assetIds: restProps.assetIds,
  });

  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: restProps.chainId ?? paseoAssetHub.id,
    assetIds: includeNative
      ? [...restProps.assetIds, NATIVE_TOKEN_KEY]
      : restProps.assetIds,
    address: connectedAccount?.address ?? "",
  });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    restProps.chainId ?? paseoAssetHub.id,
    includeNative
      ? [...restProps.assetIds, NATIVE_TOKEN_KEY]
      : restProps.assetIds,
    {
      showAll,
    }
  );

  const network = supportedNetworks.find(
    (n) => n.id === (restProps.chainId ?? paseoAssetHub.id)
  );

  const services = useMemo(() => {
    const chainIdForTokens = restProps.chainId ?? paseoAssetHub.id;
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
      connectedAccount,
      isDisabled:
        (restProps.disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        restProps.assetIds.length === 0,
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
    restProps.disabled,
    restProps.chainId,
    client,
    restProps.assetIds,
    chainTokens,
    balances,
    network,
    // includeNative is handled before calling hooks and not needed here
  ]);

  return <SelectTokenBase {...restProps} services={services} />;
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
