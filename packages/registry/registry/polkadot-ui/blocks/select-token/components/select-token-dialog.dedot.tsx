"use client";

import { useMemo } from "react";
import type React from "react";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenDialogBaseProps,
  SelectTokenDialogBase,
  SelectTokenDialogProvider,
} from "./select-token-dialog.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";
import { camelToSnakeCase } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { Button } from "@/components/ui/button";
import { useTokensByAssetIds } from "@/lib/hooks/use-chaindata-json";

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

  const services = useMemo(
    () => ({
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading: isLoading || tokensLoading,
      items: assets ?? [],
      connectedAccount,
      isDisabled:
        status !== ClientConnectionStatus.Connected ||
        !client ||
        props.assetIds.length === 0,
      chainTokens: chainTokens ?? [],
      network,
    }),
    [
      status,
      isLoading,
      tokensLoading,
      assets,
      connectedAccount,
      client,
      props.assetIds,
      chainTokens,
      network,
    ]
  );

  return <SelectTokenDialogBase {...props} services={services} />;
}

export function SelectTokenDialog(
  props: SelectTokenDialogProps & React.ComponentProps<typeof Button>
) {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <SelectTokenDialogInner {...props} />
    </ClientOnly>
  );
}

export function SelectTokenDialogWithProvider(
  props: SelectTokenDialogProps & React.ComponentProps<typeof Button>
) {
  return (
    <PolkadotProvider>
      <SelectTokenDialogProvider>
        <SelectTokenDialog {...props} />
      </SelectTokenDialogProvider>
    </PolkadotProvider>
  );
}

SelectTokenDialogWithProvider.displayName = "SelectTokenDialogWithProvider";
