"use client";

import {
  AccountInfoBase,
  AccountInfoSkeleton,
  type AccountInfoBaseProps,
} from "@/registry/polkadot-ui/blocks/account-info/account-info.base";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { useIdentityOf } from "@/registry/polkadot-ui/hooks/use-identity-of.papi";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { useMemo } from "react";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";

export type AccountInfoProps = Omit<
  AccountInfoBaseProps<keyof typeof config.chains>,
  "services"
>;

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

export function AccountInfo(props: AccountInfoProps) {
  return (
    <ClientOnly fallback={<AccountInfoSkeleton address={props.address} />}>
      <AccountInfoInner {...props} />
    </ClientOnly>
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
