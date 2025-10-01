"use client";

import {
  AccountInfoBase,
  AccountInfoSkeleton,
  type AccountInfoBaseProps,
} from "./account-info.base";
import { useIdentityOf } from "@/registry/polkadot-ui/hooks/use-identity-of.papi";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { Suspense, useMemo } from "react";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";

export type AccountInfoProps = Omit<
  AccountInfoBaseProps<keyof typeof config.chains>,
  "services"
>;

export function AccountInfo(props: AccountInfoProps) {
  return (
    <Suspense fallback={<AccountInfoSkeleton address={props.address} />}>
      <AccountInfoInner {...props} />
    </Suspense>
  );
}

function AccountInfoInner(props: AccountInfoProps) {
  const {
    data: identity,

    isPending,
    error,
  } = useIdentityOf({
    address: props.address,
    chainId: (props.chainId as keyof typeof config.chains) ?? "paseoPeople",
  });

  const services = useMemo(
    () => ({
      identity: identity ?? null,
      isLoading: isPending,
      error,
    }),
    [identity, isPending, error]
  );

  const resolvedChain =
    (props.chainId as keyof typeof config.chains) ?? "paseoPeople";

  return (
    <AccountInfoBase services={services} chainId={resolvedChain} {...props} />
  );
}

export function AccountInfoWithProvider(props: AccountInfoProps) {
  return (
    <PolkadotProvider>
      <AccountInfo {...props} />
    </PolkadotProvider>
  );
}

AccountInfoWithProvider.displayName = "AccountInfoWithProvider";
