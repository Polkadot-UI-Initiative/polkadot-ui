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
import { useMemo } from "react";
import { paseoPeople, usePolkadotClient } from "typink";
import { ClientOnly } from "@/components/client-only";

export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

function AddressInputInner(props: AddressInputProps) {
  const { status } = usePolkadotClient(props.identityChain || paseoPeople.id);

  const services = useMemo(
    () => ({
      useIdentity,
      useIdentitySearch,
      clientStatus: status,
      explorerUrl: "",
    }),
    [status]
  );

  return <AddressInputBase {...props} services={services} />;
}

export function AddressInput(props: AddressInputProps) {
  return (
    <ClientOnly>
      <AddressInputInner {...props} />
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
