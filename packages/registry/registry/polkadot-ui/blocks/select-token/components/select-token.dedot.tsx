"use client";

import { useMemo } from "react";
import type React from "react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { useAssetBalances } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-balance.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenBaseProps,
  SelectTokenBase,
  SelectTokenProvider,
} from "./select-token.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";
import {
  createDefaultChainTokens,
  mergeWithChaindataTokens,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-chaindata-json.dedot";

export type SelectTokenProps = Omit<SelectTokenBaseProps, "services"> &
  React.ComponentProps<typeof Select>;

export function SelectTokenInner(props: SelectTokenProps) {
  const { client, status } = usePolkadotClient(
    props.chainId ?? paseoAssetHub.id
  );
  const { assets, isLoading } = useAssetMetadata({
    chainId: props.chainId,
    assetIds: props.assetIds,
  });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    props.chainId ?? paseoAssetHub.id,
    props.assetIds
  );
  const { connectedAccount, supportedNetworks } = useTypink();
  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: props.chainId ?? paseoAssetHub.id,
    assetIds: props.assetIds,
    address: connectedAccount?.address ?? "",
  });

  // Get network info for network logo (similar to network-indicator)
  const network = supportedNetworks.find(
    (n) => n.id === (props.chainId ?? paseoAssetHub.id)
  );

  const services = useMemo(() => {
    const chainIdForTokens = props.chainId ?? paseoAssetHub.id;
    const defaultTokens = createDefaultChainTokens(
      assets ?? [],
      chainIdForTokens
    );
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      chainTokens ?? []
    );

    return {
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading: isLoading || tokensLoading || tokenBalancesLoading,
      items: assets ?? [],
      connectedAccount,
      isDisabled:
        (props.disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        props.assetIds.length === 0,
      chainTokens: finalTokens,
      balances,
      network,
    };
  }, [
    status,
    isLoading,
    tokensLoading,
    tokenBalancesLoading,
    assets,
    connectedAccount,
    props.disabled,
    props.chainId,
    client,
    props.assetIds,
    chainTokens,
    balances,
    network,
  ]);

  return <SelectTokenBase {...props} services={services} />;
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
      <SelectTokenProvider>
        <SelectToken {...props} />
      </SelectTokenProvider>
    </PolkadotProvider>
  );
}

SelectTokenWithProvider.displayName = "SelectTokenWithProvider";
