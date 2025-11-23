"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  AddressInputBase,
  type AddressInputBaseProps,
} from "./address-input.base";
// Import Dedot-specific hooks
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { useIdentityOf } from "@/registry/polkadot-ui/hooks/use-identity-of.dedot";
import { useIdentitySearch } from "@/registry/polkadot-ui/hooks/use-search-identity.dedot";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import { NETWORK_TO_CONFIG_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type NetworkId, paseoPeople, usePolkadotClient } from "typink";
import { Input } from "@/registry/polkadot-ui/ui/input";

export type AddressInputProps = Omit<
  AddressInputBaseProps<NetworkId>,
  "services"
>;

export function AddressInput(props: AddressInputProps) {
  return (
    <ClientOnly fallback={<Input onChange={() => {}} />}>
      <AddressInputInner {...props} />
    </ClientOnly>
  );
}

function AddressInputInner(props: AddressInputProps) {
  const { status } = usePolkadotClient(props.identityChain ?? paseoPeople.id);

  // Get SS58 prefix from chain config
  const chainId = props.identityChain ?? paseoPeople.id;
  const configKey = NETWORK_TO_CONFIG_KEY[chainId];
  const chainConfig = configKey ? config.chains[configKey] : undefined;
  const ss58Prefix = chainConfig?.ss58Prefix ?? 42;

  const services = useMemo(
    () => ({
      useIdentityOf: (address: string, identityChain?: NetworkId) =>
        useIdentityOf({ address, chainId: identityChain ?? paseoPeople.id }),
      useIdentitySearch,
      clientStatus: status,
      explorerUrl: "",
      ss58Prefix,
    }),
    [status, ss58Prefix]
  );

  return (
    <AddressInputBase
      {...props}
      services={services}
      identityChain={props.identityChain ?? paseoPeople.id}
    />
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
