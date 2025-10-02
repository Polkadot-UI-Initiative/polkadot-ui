"use client";

import { Suspense, useMemo, type ReactElement } from "react";
import {
  AddressInputBase,
  AddressInputSkeleton,
  type AddressInputBaseProps,
  type AddressInputServices,
} from "./address-input.base";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";

// Import PAPI-specific hooks
import { useIdentityOf } from "@/registry/polkadot-ui/hooks/use-identity-of.papi";
import { useIdentitySearch } from "@/registry/polkadot-ui/hooks/use-search-identity.papi";

import {
  PolkadotProvider,
  useConnectionStatus,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import type { ChainIdWithIdentity } from "@/registry/polkadot-ui/lib/reactive-dot.config";
// import { config } from "@/registry/polkadot-ui/reactive-dot.config";

// Props type - removes services prop since we inject it
export type AddressInputProps = Omit<
  AddressInputBaseProps<ChainIdWithIdentity>,
  "services"
>;

export function AddressInput(props: AddressInputProps) {
  return (
    <Suspense
      fallback={<AddressInputSkeleton placeholder={props.placeholder} />}
    >
      <AddressInputInner {...props} />
    </Suspense>
  );
}
function AddressInputInner(props: AddressInputProps) {
  const { status } = useConnectionStatus({
    chainId: props.identityChain ?? "paseoPeople",
  });
  const isLoading = status === ClientConnectionStatus.Connecting;
  const isConnected = status === ClientConnectionStatus.Connected;

  // Simple services object with type-compatible wrappers
  const services = useMemo<AddressInputServices<ChainIdWithIdentity>>(
    () => ({
      useIdentityOf: (address: string, identityChain?: ChainIdWithIdentity) => {
        const chain = identityChain ?? "paseoPeople";
        return useIdentityOf({ address, chainId: chain });
      },
      useIdentitySearch: (
        displayName: string | null | undefined,
        identityChain?: ChainIdWithIdentity
      ) => {
        return useIdentitySearch(displayName, identityChain ?? "paseoPeople");
      },
      useProvider: () => ({
        isLoading,
        isConnected,
      }),
      clientStatus: isLoading
        ? ClientConnectionStatus.Connecting
        : ClientConnectionStatus.Connected,
      explorerUrl: "",
    }),
    [isLoading, isConnected]
  );

  const AddressInputBasePapi = AddressInputBase as unknown as (
    props: AddressInputBaseProps<ChainIdWithIdentity>
  ) => ReactElement;

  return <AddressInputBasePapi {...props} services={services} />;
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
