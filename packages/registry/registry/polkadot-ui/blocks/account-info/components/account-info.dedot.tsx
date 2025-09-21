"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  AccountInfoBase,
  AccountInfoSkeleton,
  type AccountInfoBaseProps,
} from "@/registry/polkadot-ui/blocks/account-info/components/account-info.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { useIdentityOf } from "@/registry/polkadot-ui/hooks/use-identity-of.dedot";
import { polkadotPeople } from "typink";

export type AccountInfoProps = Omit<AccountInfoBaseProps, "services">;

function AccountInfoInner(props: AccountInfoProps) {
  const {
    data: identity,
    isLoading,
    error,
  } = useIdentityOf({
    address: props.address,
    chainId: props.chainId || polkadotPeople.id,
  });
  const services = useMemo(
    () => ({
      identity,
      isLoading,
      error,
    }),
    [identity, isLoading, error]
  );

  return (
    <>
      <AccountInfoBase
        services={services}
        chainId={props.chainId || polkadotPeople.id}
        {...props}
      />
    </>
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
