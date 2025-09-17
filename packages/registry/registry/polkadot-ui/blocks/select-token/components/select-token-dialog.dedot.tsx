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
  const { connectedAccount } = useTypink();

  const services = useMemo(
    () => ({
      isConnected: status === ClientConnectionStatus.Connected,
      isLoading,
      items: assets ?? [],
      connectedAccount,
      isDisabled:
        status !== ClientConnectionStatus.Connected ||
        !client ||
        props.assetIds.length === 0,
    }),
    [status, isLoading, assets, connectedAccount, client, props.assetIds]
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
