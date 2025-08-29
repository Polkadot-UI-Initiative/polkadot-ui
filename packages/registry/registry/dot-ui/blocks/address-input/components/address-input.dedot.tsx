"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "@/registry/dot-ui/blocks/address-input/components/address-input.base";

// Import Dedot-specific hooks
import { useIdentity } from "@/registry/dot-ui/blocks/address-input/hooks/use-identity.dedot";
import { useIdentitySearch } from "@/registry/dot-ui/blocks/address-input/hooks/use-search-identity.dedot";
import { paseoPeople, usePolkadotClient } from "typink";
import { ClientOnly } from "@/components/client-only";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

export function AddressInput(props: AddressInputProps) {
  const { status } = usePolkadotClient(props.identityChain || paseoPeople.id);

  // Simple services object with type-compatible wrappers
  const services = {
    useIdentity,
    useIdentitySearch,
    clientStatus: status,
    explorerUrl: "",
  };

  return (
    <ClientOnly>
      <AddressInputBase {...props} services={services} />
    </ClientOnly>
  );
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
