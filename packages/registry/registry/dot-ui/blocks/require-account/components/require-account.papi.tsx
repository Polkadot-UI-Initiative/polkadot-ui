"use client";

import {
  ChainId,
  PolkadotProvider,
  usePapi,
} from "@/registry/dot-ui/providers/papi-provider";
import {
  RequireAccountBase,
  type RequireAccountBaseProps,
} from "@/registry/dot-ui/blocks/require-account/components/require-account.base";
import { useMemo } from "react";
import { ClientOnly } from "../../client-only";

export type RequireAccountProps = Omit<RequireAccountBaseProps, "services">;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function RequireAccount(props: RequireAccountProps) {
  const { activeAccount, isLoading } = usePapi();

  const services = useMemo(
    () => ({
      isLoading: isLoading(props.chainId as ChainId),
      hasAccount: !!activeAccount?.address,
    }),
    [isLoading, activeAccount?.address, props.chainId]
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
