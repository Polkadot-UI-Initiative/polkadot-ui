"use client";

import { useMemo } from "react";
import type React from "react";
import {
  ClientConnectionStatus,
  paseoAssetHub,
  usePolkadotClient,
  useTypink,
} from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import {
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-balance.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenDialogBaseProps,
  SelectTokenDialogBase,
} from "./select-token-dialog.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
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
  const { chainId, assetIds, ...otherProps } = props;
  const { connectedAccount, supportedNetworks } = useTypink();
  const { client, status } = usePolkadotClient(chainId ?? paseoAssetHub.id);

  const { assets, isLoading } = useAssetMetadata({
    chainId: chainId ?? paseoAssetHub.id,
    assetIds: assetIds,
  });

  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: chainId ?? paseoAssetHub.id,
    assetIds: assetIds,
    address: connectedAccount?.address ?? "",
  });

  const { free: nativeBalance, isLoading: nativeBalanceLoading } =
    useNativeBalance({
      chainId: chainId ?? paseoAssetHub.id,
      address: connectedAccount?.address ?? "",
    });

  // Get chainTokens from chaindata for token logos
  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    chainId ?? paseoAssetHub.id,
    assetIds,
    {
      includeNative: true,
    }
  );

  // Get network info for network logo (similar to network-indicator)
  const network = supportedNetworks.find(
    (n) => n.id === (chainId ?? paseoAssetHub.id)
  );

  const services = useMemo(() => {
    const defaultTokens = createDefaultChainTokens(
      assets,
      chainId ?? paseoAssetHub.id
    );
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      chainTokens ?? []
    );

    // Combine native balance with asset balances
    // Check if finalTokens includes native token (assetId: "substrate-native")
    const hasNativeToken = finalTokens.some(
      (token) => token.assetId === "substrate-native"
    );
    const combinedBalances: Record<number, bigint | null> = {
      ...balances,
    };

    // Add native token balance if present
    if (hasNativeToken) {
      combinedBalances[-1] = nativeBalance;
    }

    return {
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading:
        isLoading ||
        tokensLoading ||
        tokenBalancesLoading ||
        nativeBalanceLoading,
      connectedAccount,
      isDisabled:
        status !== ClientConnectionStatus.Connected ||
        !client ||
        assetIds.length === 0,
      chainTokens: finalTokens,
      network,
      balances: combinedBalances,
    };
  }, [
    status,
    isLoading,
    tokensLoading,
    tokenBalancesLoading,
    nativeBalanceLoading,
    connectedAccount,
    client,
    assetIds,
    chainId,
    chainTokens,
    assets,
    network,
    balances,
    nativeBalance,
  ]);

  return <SelectTokenDialogBase {...otherProps} services={services} />;
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
      <SelectTokenDialog {...props} />
    </PolkadotProvider>
  );
}

SelectTokenDialogWithProvider.displayName = "SelectTokenDialogWithProvider";
