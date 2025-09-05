"use client";

import {
  RequireAccountBase,
  type RequireAccountBaseProps,
} from "@/registry/polkadot-ui/blocks/require-account/components/require-account.base";
import { useMemo } from "react";
import { ClientOnly } from "../../client-only";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import {
  ClientConnectionStatus,
  usePapi,
} from "@/registry/polkadot-ui/providers/polkadot-provider.papi";

export type RequireAccountProps = Omit<RequireAccountBaseProps, "services">;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RequireAccount(props: RequireAccountProps) {
  const { selectedAccount, status } = usePapi();

  const services = useMemo(
    () => ({
      isLoading: status === ClientConnectionStatus.Connecting,
      hasAccount: !!selectedAccount?.address,
    }),
    [status, selectedAccount?.address]
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

RequireAccountWithProvider.displayName = "RequireAccountWithProvider";
