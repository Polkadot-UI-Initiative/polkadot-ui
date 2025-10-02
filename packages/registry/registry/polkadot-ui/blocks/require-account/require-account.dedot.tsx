"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
  RequireAccountBase,
  type RequireAccountBaseProps,
} from "./require-account.base";
import { useTypink } from "typink";

export type RequireAccountProps = Omit<RequireAccountBaseProps, "services">;

export function RequireAccount(props: RequireAccountProps) {
  const { connectedAccount } = useTypink();

  const services = useMemo(
    () => ({
      hasAccount: !!connectedAccount?.address,
    }),
    [connectedAccount?.address]
  );

  return (
    <ClientOnly fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireAccountBase {...props} services={services} />
    </ClientOnly>
  );
}

export function RequireAccountWithProvider(props: RequireAccountProps) {
  return (
    <PolkadotProvider>
      <RequireAccount {...props} />
    </PolkadotProvider>
  );
}
