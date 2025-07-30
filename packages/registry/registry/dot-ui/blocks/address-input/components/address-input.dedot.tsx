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
import { useIdentity } from "@/registry/dot-ui/blocks/address-input/hooks/use-identity.dedot";
import { useIdentitySearch } from "@/registry/dot-ui/blocks/address-input/hooks/use-search-identity.dedot";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

export function AddressInput(props: AddressInputProps) {
  const dedotContext = useDedot();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useIdentity,
      useIdentitySearch,
      useProvider: () => ({
        isLoading: dedotContext.isLoading,
        isConnected: dedotContext.isConnected,
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
