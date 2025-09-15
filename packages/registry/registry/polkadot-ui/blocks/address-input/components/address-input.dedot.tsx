"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  AddressInputBase,
  AddressInputProvider,
  type AddressInputBaseProps,
} from "@/registry/polkadot-ui/blocks/address-input/components/address-input.base";

// Import Dedot-specific hooks
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { useIdentity } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-identity.dedot";
import { useIdentitySearch } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-search-identity.dedot";
import { usePolkadotClient } from "typink";

export type AddressInputProps = Omit<AddressInputBaseProps, "services">;

export function AddressInput(props: AddressInputProps) {
  const { status } = usePolkadotClient(props.identityChain);

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
