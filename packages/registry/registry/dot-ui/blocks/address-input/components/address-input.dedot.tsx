"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  useDedot,
} from "@/registry/dot-ui/providers/dedot-provider";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "@/registry/dot-ui/blocks/address-input/components/address-input.base";

// Import Dedot-specific hooks
import { usePolkadotIdentity } from "@/registry/dot-ui/blocks/address-input/hooks/use-identity.dedot";
import { useIdentityByDisplayName } from "@/registry/dot-ui/blocks/address-input/hooks/use-search-identity.dedot";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

// Identity chain for Dedot
const IDENTITY_CHAIN = "paseo_people" as const;

export function AddressInput(props: AddressInputProps) {
  const dedotContext = useDedot();

  // Create elegant services object with proper typing
  const services = useMemo(
    () => ({
      useIdentity: (address: string) =>
        usePolkadotIdentity(address, IDENTITY_CHAIN),

      useIdentitySearch: (displayName: string | null) =>
        useIdentityByDisplayName(displayName, IDENTITY_CHAIN),

      useProvider: () => ({
        isLoading: (chainId: string) =>
          dedotContext.isLoading(chainId as typeof IDENTITY_CHAIN),
        currentChain: dedotContext.currentChain,
        isConnected: (chainId: string) =>
          dedotContext.isConnected(chainId as typeof IDENTITY_CHAIN),
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
