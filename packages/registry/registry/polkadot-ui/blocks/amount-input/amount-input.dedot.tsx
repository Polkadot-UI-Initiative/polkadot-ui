"use client";

import { useMemo } from "react";
import {
  AmountInputBase,
  type AmountInputBaseProps,
} from "@/registry/polkadot-ui/blocks/amount-input/amount-input.base";
import {
  paseoAssetHub,
  usePolkadotClient,
  useTypink,
  ClientConnectionStatus,
} from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/hooks/use-asset-metadata.dedot";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import {
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
  NATIVE_TOKEN_ID,
  NATIVE_TOKEN_KEY,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  createDefaultChainTokens,
  mergeWithChaindataTokens,
} from "../../lib/utils.dot-ui";

export type AmountInputProps = Omit<AmountInputBaseProps, "services">;

function AmountInputInner(props: AmountInputProps) {
  const { chainId = paseoAssetHub.id, includeNative = true } = props;
  const assetIds = useMemo(() => props.assetIds ?? [], [props.assetIds]);

  const { client, status } = usePolkadotClient(chainId);
  const { connectedAccount, supportedNetworks } = useTypink();
  const { assets, isLoading } = useAssetMetadata({
    chainId: chainId,
    assetIds: assetIds,
  });
  const { isLoading: tokenBalancesLoading, balances } = useAssetBalances({
    chainId: chainId,
    assetIds: assetIds,
    address: connectedAccount?.address ?? "",
  });

  const { isLoading: nativeBalanceLoading, free: nativeBalance } =
    useNativeBalance({
      chainId: chainId,
      address: connectedAccount?.address ?? "",
      enabled: !!connectedAccount?.address,
    });

  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    chainId,
    assetIds,
    {
      includeNative,
      showAll: true,
    }
  );

  // Get network info for network logo
  const network = supportedNetworks.find((n) => n.id === chainId);

  const services = useMemo(() => {
    const defaultTokens = createDefaultChainTokens(
      assets,
      chainId ?? paseoAssetHub.id
    );

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

    const combinedBalances: Record<number, bigint | null> = { ...balances };

    if (hasNativeToken) {
      combinedBalances[NATIVE_TOKEN_KEY] = nativeBalance;
    }

    console.log({ finalTokens });

    return {
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading:
        isLoading ||
        tokensLoading ||
        tokenBalancesLoading ||
        nativeBalanceLoading,
      connectedAccount,
      isDisabled:
        (props.disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        finalTokens.length === 0 ||
        (props.withTokenSelector && assetIds.length === 0),
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
    props.disabled,
    client,
    assetIds,
    props.withTokenSelector,
    chainTokens,
    balances,
    nativeBalance,
    network,
    assets,
    chainId,
    includeNative,
  ]);

  return <AmountInputBase {...props} services={services} />;
}

export function AmountInput(props: AmountInputProps) {
  return <AmountInputInner {...props} />;
}

export function AmountInputWithProvider(props: AmountInputProps) {
  return (
    <PolkadotProvider>
      <AmountInput {...props} />
    </PolkadotProvider>
  );
}

AmountInputWithProvider.displayName = "AmountInputWithProvider";
