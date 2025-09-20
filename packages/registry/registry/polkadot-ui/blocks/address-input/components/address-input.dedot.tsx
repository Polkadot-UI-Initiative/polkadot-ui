"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  AddressInputBase,
  type AddressInputBaseProps,
} from "@/registry/polkadot-ui/blocks/address-input/components/address-input.base";
// Import Dedot-specific hooks
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { useIdentity } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-identity.dedot";
import { useIdentitySearch } from "@/registry/polkadot-ui/blocks/address-input/hooks/use-search-identity.dedot";
import { NetworkId, paseoPeople, usePolkadotClient } from "typink";
import { Input } from "@/registry/polkadot-ui/ui/input";

export type AddressInputProps = Omit<
  AddressInputBaseProps<NetworkId>,
  "services"
>;

function AddressInputInner(props: AddressInputProps) {
  const { status } = usePolkadotClient(props.identityChain ?? paseoPeople.id);

  const services = useMemo(
    () => ({
      useIdentity,
      useIdentitySearch,
      clientStatus: status,
      explorerUrl: "",
    }),
    [status]
  );

  return (
    <AddressInputBase
      {...props}
      services={services}
      identityChain={props.identityChain ?? paseoPeople.id}
    />
  );
}

export function AddressInput(props: AddressInputProps) {
  return (
    <ClientOnly fallback={<Input onChange={() => {}} />}>
      <AddressInputInner {...props} />
    </ClientOnly>
  );
}
// Wrapped version with provider for drop-in usage
export function AddressInputWithProvider(props: AddressInputProps) {
  return (
    <PolkadotProvider>
      <AddressInput {...props} />
    </PolkadotProvider>
  );
}

AddressInputWithProvider.displayName = "AddressInputWithProvider";
