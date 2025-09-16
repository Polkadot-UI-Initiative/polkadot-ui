"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  AccountInfoBase,
  AccountInfoSkeleton,
  type AccountInfoBaseProps,
} from "./account-info.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { useIdentityOf } from "@/registry/polkadot-ui/blocks/account-info/hooks/use-identity-of.dedot";

export type AccountInfoProps = Omit<AccountInfoBaseProps, "services">;

function AccountInfoInner(props: AccountInfoProps) {
  const services = useMemo(
    () => ({
      useIdentityOf,
    }),
    []
  );

  return <AccountInfoBase {...props} services={services} />;
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
