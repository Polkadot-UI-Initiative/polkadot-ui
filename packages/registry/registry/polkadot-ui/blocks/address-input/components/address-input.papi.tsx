"use client";

import { useMemo, type ReactElement } from "react";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
  type AddressInputServices,
} from "@/registry/polkadot-ui/blocks/address-input/components/address-input.base";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";

// Import PAPI-specific hooks
import { useIdentity as papiUseIdentity } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-identity.papi";
import { useIdentitySearch as papiUseIdentitySearch } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-search-identity.papi";

import { type ChainIdWithIdentity } from "@/registry/polkadot-ui/lib/types.papi";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

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
      useIdentity: (address: string, identityChain?: ChainIdWithIdentity) => {
        const chain = identityChain ?? "paseoPeople";
        return papiUseIdentity(address, chain);
      },
      useIdentitySearch: (
        displayName: string | null | undefined,
        identityChain?: ChainIdWithIdentity
      ) => {
        return papiUseIdentitySearch(
          displayName,
          identityChain ?? "paseoPeople"
        );
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
      <AddressInputProvider>
        <AddressInput {...props} />
      </AddressInputProvider>
    </PolkadotProvider>
  );
}

AddressInputWithProvider.displayName = "AddressInputWithProvider";
