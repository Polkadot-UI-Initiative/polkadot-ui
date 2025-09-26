"use client";

import { useMemo } from "react";
import {
  AmountInputBase,
  type AmountInputBaseProps,
} from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";
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
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/types.dot-ui";

export type AmountInputProps = Omit<AmountInputBaseProps, "services">;

function AmountInputInner(props: AmountInputProps) {
  const chainId = props.chainId ?? paseoAssetHub.id;
  const assetIds = useMemo(() => props.assetIds ?? [], [props.assetIds]);

  const { client, status } = usePolkadotClient(
    props.chainId ?? paseoAssetHub.id
  );
  const { isLoading } = useAssetMetadata({
    chainId: chainId,
    assetIds: assetIds,
  });
  const { connectedAccount, supportedNetworks } = useTypink();
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

  // Get chainTokens from chaindata for token logos
  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    props.chainId ?? paseoAssetHub.id,
    assetIds
  );

  // Get network info for network logo
  const network = supportedNetworks.find(
    (n) => n.id === (props.chainId ?? paseoAssetHub.id)
  );

  const services = useMemo(() => {
    const combinedBalances = { ...balances };
    if (nativeBalance !== null) {
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
        (props.disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        (props.withTokenSelector && assetIds.length === 0),
      chainTokens: chainTokens ?? [],
      balances: combinedBalances,
      network,
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
