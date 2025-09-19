"use client";

import { useMemo } from "react";
import {
  AmountInputBase,
  AmountInputProvider,
  type AmountInputBaseProps,
} from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";
import {
  paseoAssetHub,
  usePolkadotClient,
  useTypink,
  ClientConnectionStatus,
} from "typink";
import { camelToSnakeCase } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { useAssetMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-chaindata-json.dedot";
import { useAssetBalances } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-balance.dedot";

export type AmountInputProps = Omit<AmountInputBaseProps, "services">;

function AmountInputInner(props: AmountInputProps) {
  const chainId = props.chainId ?? paseoAssetHub.id;
  const assetIds = useMemo(() => props.assetIds ?? [], [props.assetIds]);

  const { client, status } = usePolkadotClient(
    props.chainId ? camelToSnakeCase(props.chainId) : paseoAssetHub.id
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

  // Get chainTokens from chaindata for token logos
  const { tokens: chainTokens, isLoading: tokensLoading } = useTokensByAssetIds(
    props.chainId ? camelToSnakeCase(props.chainId) : paseoAssetHub.id,
    assetIds
  );

  // Get network info for network logo
  const network = supportedNetworks.find(
    (n) =>
      n.id ===
      (props.chainId ? camelToSnakeCase(props.chainId) : paseoAssetHub.id)
  );

  const services = useMemo(() => {
    return {
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading: isLoading || tokensLoading || tokenBalancesLoading,
      connectedAccount,
      isDisabled:
        (props.disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        assetIds.length === 0,
      chainTokens: chainTokens ?? [],
      balances,
      network,
    };
  }, [
    status,
    isLoading,
    tokensLoading,
    tokenBalancesLoading,
    connectedAccount,
    props.disabled,
    client,
    assetIds,
    chainTokens,
    balances,
    network,
  ]);

  return <AmountInputBase {...props} services={services} />;
}

export function AmountInput(props: AmountInputProps) {
  return <AmountInputInner {...props} />;
}

export function AmountInputWithProvider(props: AmountInputProps) {
  return (
    <AmountInputProvider>
      <AmountInput {...props} />
    </AmountInputProvider>
  );
}

AmountInputWithProvider.displayName = "AmountInputWithProvider";
