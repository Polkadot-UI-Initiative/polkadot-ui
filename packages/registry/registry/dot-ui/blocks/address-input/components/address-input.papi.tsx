"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/dot-ui/providers/papi-provider";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "./address-input.base";

// Import PAPI-specific hooks
import { usePolkadotIdentity } from "@/registry/dot-ui/blocks/address-input/hooks/use-identity.papi";
import { useIdentitySearch } from "@/registry/dot-ui/blocks/address-input/hooks/use-search-identity.papi";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

// Identity chain for PAPI
const IDENTITY_CHAIN = "paseo_people" as const;

export function AddressInput(props: AddressInputProps) {
  const papiContext = usePapi();

  // Create elegant services object with proper typing
  const services = useMemo(
    () => ({
      useIdentity: (address: string) =>
        usePolkadotIdentity(address, IDENTITY_CHAIN),

      useIdentitySearch: (displayName: string | null) =>
        useIdentitySearch(displayName, IDENTITY_CHAIN),

      useProvider: () => ({
        isLoading: (chainId: string) =>
          papiContext.isLoading(chainId as "paseo" | "paseo_people"),
        currentChain: papiContext.currentChain,
        isConnected: (chainId: string) =>
          papiContext.isConnected(chainId as "paseo" | "paseo_people"),
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
