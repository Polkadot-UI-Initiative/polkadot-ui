"use client";

import { useMemo } from "react";
import type React from "react";
import {
  ClientConnectionStatus,
  paseoAssetHub,
  usePolkadotClient,
  useTypink,
} from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/hooks/use-asset-metadata.dedot";
import {
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenDialogBaseProps,
  SelectTokenDialogBase,
} from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
  createDefaultChainTokens,
  mergeWithChaindataTokens,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Button } from "@/components/ui/button";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NATIVE_TOKEN_KEY,
  NATIVE_TOKEN_ID,
} from "@/registry/polkadot-ui/lib/types.dot-ui";

export type SelectTokenDialogProps = Omit<
  SelectTokenDialogBaseProps,
  "services"
> &
  React.ComponentProps<typeof Button>;

export function SelectTokenDialogInner(props: SelectTokenDialogProps) {
  // by default, add native token to the list of tokens with includeNative
  const {
    chainId = paseoAssetHub.id,
    assetIds,
    includeNative = true,
    showAll = true,
    ...otherProps
  } = props;
  const { connectedAccount, supportedNetworks } = useTypink();
  const { client, status } = usePolkadotClient(chainId);

  const { assets, isLoading } = useAssetMetadata({
    chainId: chainId,
    assetIds: assetIds,
  });

  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: chainId,
    assetIds: assetIds,
    address: connectedAccount?.address ?? "",
  });

  const { free: nativeBalance, isLoading: nativeBalanceLoading } =
    useNativeBalance({
      chainId: chainId,
      address: connectedAccount?.address ?? "",
    });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    chainId,
    assetIds,
    {
      includeNative,
      showAll,
    }
  );

  const network = supportedNetworks.find((n) => n.id === chainId);

  const services = useMemo(() => {
    const defaultTokens = createDefaultChainTokens(assets, chainId);
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      chainTokens ?? []
    );

    const hasNativeToken =
      includeNative &&
      finalTokens.some(
        (token) =>
          token.id === NATIVE_TOKEN_ID || token.assetId === NATIVE_TOKEN_ID
      );
    const combinedBalances: Record<number, bigint | null> = {
      ...balances,
    };

    if (hasNativeToken) {
      combinedBalances[NATIVE_TOKEN_KEY] = nativeBalance;
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
        finalTokens.length === 0,
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
    chainId,
    chainTokens,
    assets,
    network,
    balances,
    nativeBalance,
    includeNative,
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
