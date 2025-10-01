"use client";

import { Suspense, useMemo } from "react";
import type React from "react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAssetMetadata } from "@/registry/polkadot-ui/hooks/use-asset-metadata.papi";
import {
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
import {
  type SelectTokenBaseProps,
  SelectTokenBase,
} from "@/registry/polkadot-ui/blocks/select-token/select-token.base";
import {
  PolkadotProvider,
  useConnectionStatus,
  useSelectedAccount,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  createDefaultChainTokens,
  mergeWithChaindataTokens,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import {
  NATIVE_TOKEN_KEY,
  NATIVE_TOKEN_ID,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";
import { useClient } from "@reactive-dot/react";

export type SelectTokenProps = Omit<SelectTokenBaseProps, "services"> &
  React.ComponentProps<typeof Select>;

export function SelectTokenInner(props: SelectTokenProps) {
  // by default, add native token to the list of tokens with includeNative
  const { includeNative = true, showAll = true, ...restProps } = props;
  const chainId = (restProps.chainId ?? "paseoAssetHub") as ChainId;

  const { selectedAccount } = useSelectedAccount();
  const client = useClient({ chainId });
  const { status } = useConnectionStatus({ chainId });

  const { assets, isLoading } = useAssetMetadata({
    chainId,
    assetIds: restProps.assetIds,
  });

  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId,
    assetIds: restProps.assetIds,
    address: selectedAccount?.address ?? "",
  });

  const { free: nativeBalance, isLoading: nativeBalanceLoading } =
    useNativeBalance({
      chainId,
      address: selectedAccount?.address ?? "",
    });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    chainId,
    restProps.assetIds,
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
    const chainIdForTokens = chainId;
    const defaultTokens = createDefaultChainTokens(
      assets ?? [],
      chainIdForTokens,
      includeNative
    );
    const sanitizedChainTokens = (chainTokens ?? []).filter(
      (token): token is NonNullable<typeof token> => token != null
    );
    const finalTokens = mergeWithChaindataTokens(
      defaultTokens,
      sanitizedChainTokens
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
      items: assets ?? [],
      connectedAccount: selectedAccount,
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
    nativeBalanceLoading,
    assets,
    selectedAccount,
    restProps.disabled,
    chainId,
    client,
    restProps.assetIds,
    chainTokens,
    balances,
    nativeBalance,
    network,
    includeNative,
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
    <Suspense fallback={<SelectTokenFallback {...props} />}>
      <SelectTokenInner {...props} />
    </Suspense>
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
