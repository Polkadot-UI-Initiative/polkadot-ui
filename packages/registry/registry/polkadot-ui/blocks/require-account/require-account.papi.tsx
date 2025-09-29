"use client";

import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  RequireAccountBase,
  type RequireAccountBaseProps,
} from "./require-account.base";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { useMemo } from "react";

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
