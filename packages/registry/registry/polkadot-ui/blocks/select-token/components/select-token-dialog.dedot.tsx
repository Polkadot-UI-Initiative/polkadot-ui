"use client";

import { useMemo } from "react";
import type React from "react";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { useAssetBalances } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-balance.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenDialogBaseProps,
  SelectTokenDialogBase,
  SelectTokenDialogProvider,
} from "./select-token-dialog.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";
import {
  camelToSnakeCase,
  createDefaultChainTokens,
  mergeWithChaindataTokens,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Button } from "@/components/ui/button";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-chaindata-json.dedot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectTokenDialogProps = Omit<
  SelectTokenDialogBaseProps,
  "services"
> &
  React.ComponentProps<typeof Button>;

export function SelectTokenDialogInner(props: SelectTokenDialogProps) {
  const { client, status } = usePolkadotClient(
    props.chainId ? camelToSnakeCase(props.chainId) : paseoAssetHub.id
  );
  const { assets, isLoading } = useAssetMetadata({
    chainId: props.chainId,
    assetIds: props.assetIds,
  });
  const { connectedAccount, supportedNetworks } = useTypink();
  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: props.chainId,
    assetIds: props.assetIds,
    address: connectedAccount?.address ?? "",
  });

  // Get chainTokens from chaindata for token logos
  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    props.chainId ? camelToSnakeCase(props.chainId) : paseoAssetHub.id,
    props.assetIds
  );

  // Get network info for network logo (similar to network-indicator)
  const network = supportedNetworks.find(
    (n) =>
      n.id ===
      (props.chainId ? camelToSnakeCase(props.chainId) : paseoAssetHub.id)
  );

  const services = useMemo(() => {
    const chainIdForTokens = props.chainId
      ? camelToSnakeCase(props.chainId)
      : paseoAssetHub.id;
    const defaultTokens = createDefaultChainTokens(assets, chainIdForTokens);
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      chainTokens ?? []
    );

    return {
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading: isLoading || tokensLoading || tokenBalancesLoading,
      connectedAccount,
      isDisabled:
        status !== ClientConnectionStatus.Connected ||
        !client ||
        props.assetIds.length === 0,
      chainTokens: finalTokens,
      network,
      balances,
    };
  }, [
    status,
    isLoading,
    tokensLoading,
    tokenBalancesLoading,
    connectedAccount,
    client,
    props.assetIds,
    props.chainId,
    chainTokens,
    assets,
    network,
    balances,
  ]);

  return <SelectTokenDialogBase {...props} services={services} />;
}

function SelectTokenDialogFallback(props: SelectTokenDialogProps) {
  return (
    <Button
      variant="outline"
      disabled
      className={cn(
        "justify-between min-w-[140px] font-normal py-5 text-muted-foreground",
        props.className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {/* Loading skeleton for token logo */}
        <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
        <span>Loading tokens...</span>
      </div>
      <Loader2 className="h-4 w-4 animate-spin" />
    </Button>
  );
}

export function SelectTokenDialog(props: SelectTokenDialogProps) {
  return (
    <ClientOnly fallback={<SelectTokenDialogFallback {...props} />}>
      <SelectTokenDialogInner {...props} />
    </ClientOnly>
  );
}

export function SelectTokenDialogWithProvider(props: SelectTokenDialogProps) {
  return (
    <PolkadotProvider>
      <SelectTokenDialogProvider>
        <SelectTokenDialog {...props} />
      </SelectTokenDialogProvider>
    </PolkadotProvider>
  );
}

SelectTokenDialogWithProvider.displayName = "SelectTokenDialogWithProvider";
