"use client";

import { useMemo } from "react";
import type React from "react";
import { Select } from "@/components/ui/select";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";
import { useAssetMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  type SelectTokenBaseProps,
  SelectTokenBase,
  SelectTokenProvider,
} from "./select-token.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { paseoAssetHub } from "typink";
import { camelToSnakeCase } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export type SelectTokenProps = Omit<SelectTokenBaseProps, "services"> &
  React.ComponentProps<typeof Select>;

export function SelectTokenInner(props: SelectTokenProps) {
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
        (props.disabled ?? false) ||
        status !== ClientConnectionStatus.Connected ||
        !client ||
        props.assetIds.length === 0,
    }),
    [
      status,
      isLoading,
      assets,
      connectedAccount,
      props.disabled,
      client,
      props.assetIds,
    ]
  );

  return <SelectTokenBase {...props} services={services} />;
}

export function SelectToken(props: SelectTokenProps) {
  return (
    <ClientOnly fallback={<Select {...props} />}>
      <SelectTokenInner {...props} />
    </ClientOnly>
  );
}

// Wrapped version with provider for drop-in usage
export function SelectTokenWithProvider(props: SelectTokenProps) {
  return (
    <PolkadotProvider>
      <SelectTokenProvider>
        <SelectToken {...props} />
      </SelectTokenProvider>
    </PolkadotProvider>
  );
}

SelectTokenWithProvider.displayName = "SelectTokenWithProvider";
