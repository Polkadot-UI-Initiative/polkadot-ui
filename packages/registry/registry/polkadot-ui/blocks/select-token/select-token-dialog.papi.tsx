"use client";

import { useMemo } from "react";
import type React from "react";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { useAssetMetadata } from "@/registry/polkadot-ui/hooks/use-asset-metadata.papi";
import {
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenDialogBaseProps,
  SelectTokenDialogBase,
} from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
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
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";

export type SelectTokenDialogProps = Omit<
  SelectTokenDialogBaseProps,
  "services"
> &
  React.ComponentProps<typeof Button>;

export function SelectTokenDialogInner(props: SelectTokenDialogProps) {
  const {
    chainId: propChainId,
    assetIds,
    showAll = true,
    ...otherProps
  } = props;

  const chainId = (propChainId ?? "paseoAssetHub") as ChainId;
  const { client, status, selectedAccount } = usePapi(chainId);

  const { assets, isLoading } = useAssetMetadata({
    chainId,
    assetIds: assetIds,
  });

  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId,
    assetIds: assetIds,
    address: selectedAccount?.address ?? "",
  });

  const { free: nativeBalance, isLoading: nativeBalanceLoading } =
    useNativeBalance({
      chainId,
      address: selectedAccount?.address ?? "",
    });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    chainId,
    assetIds,
    {
      showAll,
    }
  );

  // Create supported networks from config
  const supportedNetworks = useMemo(() => {
    return Object.keys(config.chains).map((chainId) => {
      const chain = config.chains[chainId as keyof typeof config.chains];
      return {
        id: chainId,
        name: chain.name,
        symbol: chain.symbol,
        decimals: chain.decimals,
        logo: chain.logo,
        explorerUrl: chain.explorerUrl,
      };
    });
  }, []);

  const network = supportedNetworks.find((n) => n.id === chainId);

  const services = useMemo(() => {
    const defaultTokens = createDefaultChainTokens(assets, chainId);
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      chainTokens ?? []
    );

    const hasNativeToken = finalTokens.some(
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
      connectedAccount: selectedAccount,
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
    selectedAccount,
    client,
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
