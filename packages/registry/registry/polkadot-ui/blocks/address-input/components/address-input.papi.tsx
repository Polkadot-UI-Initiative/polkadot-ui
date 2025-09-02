"use client";

import { useMemo } from "react";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "@/registry/polkadot-ui/blocks/address-input/components/address-input.base";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";

// Import PAPI-specific hooks
import { useIdentity as papiUseIdentity } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-identity.papi";
import { useIdentitySearch as papiUseIdentitySearch } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-search-identity.papi";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/polkadot-ui/providers/papi-provider";
import { type ChainIdWithIdentity } from "@/registry/polkadot-ui/lib/types.papi";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

export function AddressInput(props: AddressInputProps) {
  const { isLoading, isConnected, currentChainId } = usePapi();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useIdentity: (address: string, identityChain?: string) => {
        const chain = (identityChain ?? "paseo_people") as ChainIdWithIdentity;
        return papiUseIdentity(address, chain);
      },
      useIdentitySearch: (
        displayName: string | null | undefined,
        identityChain?: string
      ) => {
        const chain = (identityChain ?? "paseo_people") as ChainIdWithIdentity;
        return papiUseIdentitySearch(displayName, chain);
      },
      useProvider: () => ({
        isLoading,
        isConnected,
      }),
      clientStatus: isLoading(currentChainId)
        ? ClientConnectionStatus.Connecting
        : ClientConnectionStatus.Connected,
      explorerUrl: "",
    }),
    [isLoading, isConnected, currentChainId]
  );

  return <AddressInputBase {...props} services={services} />;
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
