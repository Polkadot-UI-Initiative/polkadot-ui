"use client";

import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  RequireAccountBase,
  type RequireAccountBaseProps,
} from "./require-account.base";
import {
  PolkadotProvider,
  useConnectionStatus,
  useSelectedAccount,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { Suspense, useMemo } from "react";
import { type ChainId } from "@reactive-dot/core";

export type RequireAccountProps = Omit<
  RequireAccountBaseProps<ChainId>,
  "services"
>;

export function RequireAccount(props: RequireAccountProps) {
  return (
    <Suspense fallback={props.loadingFallback ?? props.fallback ?? null}>
      <RequireAccountInner {...props} />
    </Suspense>
  );
}

function RequireAccountInner(props: RequireAccountProps) {
  const { selectedAccount } = useSelectedAccount();
  const { status } = useConnectionStatus({
    chainId: props.chainId,
  });

  const services = useMemo(
    () => ({
      isLoading: status === ClientConnectionStatus.Connecting,
      hasAccount: !!selectedAccount?.address,
    }),
    [selectedAccount?.address, status]
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
