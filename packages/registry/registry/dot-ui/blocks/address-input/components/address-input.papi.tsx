"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/dot-ui/providers/papi-provider";
import { ChainIdWithIdentity } from "@/registry/dot-ui/lib/types.papi";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "./address-input.base";

// Import PAPI-specific hooks
import { useIdentity } from "@/registry/dot-ui/blocks/address-input/hooks/use-identity.papi";
import { useIdentitySearch } from "@/registry/dot-ui/blocks/address-input/hooks/use-search-identity.papi";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

export function AddressInput(props: AddressInputProps) {
  const papiContext = usePapi();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useIdentity: (address: string, identityChain?: string) =>
        useIdentity(address, identityChain as ChainIdWithIdentity),
      useIdentitySearch: (displayName: string | null, identityChain?: string) =>
        useIdentitySearch(displayName, identityChain as ChainIdWithIdentity),
      useProvider: () => ({
        isLoading: (chainId: string) =>
          papiContext.isLoading(chainId as ChainIdWithIdentity),
        currentChain: papiContext.currentChain,
        isConnected: (chainId: string) =>
          papiContext.isConnected(chainId as ChainIdWithIdentity),
      }),
    }),
    [papiContext]
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
