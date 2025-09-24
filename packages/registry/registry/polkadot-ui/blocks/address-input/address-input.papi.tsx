"use client";

import { useMemo, type ReactElement } from "react";
import {
  AddressInputBase,
  type AddressInputBaseProps,
  type AddressInputServices,
} from "@/registry/polkadot-ui/blocks/address-input/address-input.base";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";

// Import PAPI-specific hooks
import { useIdentityOf } from "@/registry/polkadot-ui/hooks/use-identity-of.papi";
import { useIdentitySearch } from "@/registry/polkadot-ui/hooks/use-search-identity.papi";

import {
  PolkadotProvider,
  usePapi,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
// import { config } from "@/registry/polkadot-ui/reactive-dot.config";
import type { ChainIdWithIdentity } from "@/registry/polkadot-ui/lib/types.papi";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<
  AddressInputBaseProps<ChainIdWithIdentity>,
  "services"
>;

export function AddressInput(props: AddressInputProps) {
  const { status } = usePapi();
  const isLoading = status === ClientConnectionStatus.Connecting;
  const isConnected = status === ClientConnectionStatus.Connected;

  // Simple services object with type-compatible wrappers
  const services = useMemo<AddressInputServices<ChainIdWithIdentity>>(
    () => ({
      useIdentityOf: (address: string, identityChain?: ChainIdWithIdentity) => {
        const chain = identityChain ?? "paseoPeople";
        return useIdentityOf({ address, chainId: chain });
      },
      useIdentitySearch: (
        displayName: string | null | undefined,
        identityChain?: ChainIdWithIdentity
      ) => {
        return useIdentitySearch(displayName, identityChain ?? "paseoPeople");
      },
      useProvider: () => ({
        isLoading,
        isConnected,
      }),
      clientStatus: isLoading
        ? ClientConnectionStatus.Connecting
        : ClientConnectionStatus.Connected,
      explorerUrl: "",
    }),
    [isLoading, isConnected]
  );

  const AddressInputBasePapi = AddressInputBase as unknown as (
    props: AddressInputBaseProps<ChainIdWithIdentity>
  ) => ReactElement;

  return <AddressInputBasePapi {...props} services={services} />;
}
// Wrapped version with provider for drop-in usage
export function AddressInputWithProvider(props: AddressInputProps) {
  return (
    <PolkadotProvider>
      <AddressInput {...props} />
    </PolkadotProvider>
  );
}

AddressInputWithProvider.displayName = "AddressInputWithProvider";
