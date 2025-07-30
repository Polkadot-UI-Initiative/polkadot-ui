"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  useDedot,
  type ChainId,
} from "@/registry/dot-ui/providers/dedot-provider";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "@/registry/dot-ui/blocks/address-input/components/address-input.base";

// Import Dedot-specific hooks
import { usePolkadotIdentity } from "@/registry/dot-ui/blocks/address-input/hooks/use-identity.dedot";
import { useIdentitySearch } from "@/registry/dot-ui/blocks/address-input/hooks/use-search-identity.dedot";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

export function AddressInput(props: AddressInputProps) {
  const dedotContext = useDedot();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useIdentity: (address: string, identityChain?: string) =>
        usePolkadotIdentity(address, identityChain as ChainId),
      useIdentitySearch: (displayName: string | null, identityChain?: string) =>
        useIdentitySearch(displayName, identityChain as ChainId),
      useProvider: () => ({
        isLoading: (chainId: string) =>
          dedotContext.isLoading(chainId as ChainId),
        currentChain: dedotContext.currentChain,
        isConnected: (chainId: string) =>
          dedotContext.isConnected(chainId as ChainId),
      }),
    }),
    [dedotContext]
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
