"use client";

import { useMemo } from "react";
import { useTypink, useBalances } from "typink";
import {
  PolkadotProvider,
} from "@/registry/dot-ui/providers/dedot-provider";
import {
  AccountSelectionBase,
  type AccountSelectionBaseProps,
} from "@/registry/dot-ui/ui/account-selection.base";

// Props type - removes services prop since we inject it
export type AccountSelectionProps = Omit<AccountSelectionBaseProps, "services">;

export function AccountSelection(props: AccountSelectionProps) {
  const typinkContext = useTypink();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useAccountManagement: () => ({
        accounts: typinkContext.accounts || [],
        connectedAccount: typinkContext.connectedAccount || null,
        setConnectedAccount: typinkContext.setConnectedAccount,
        disconnect: typinkContext.disconnect,
        network: typinkContext.network,
      }),
      useBalances,
    }),
    [typinkContext]
  );

  return <AccountSelectionBase {...props} services={services} />;
}

// Wrapped version with provider for drop-in usage
export function AccountSelectionWithProvider(props: AccountSelectionProps) {
  return (
    <PolkadotProvider>
      <AccountSelection {...props} />
    </PolkadotProvider>
  );
}

AccountSelectionWithProvider.displayName = "AccountSelectionWithProvider";
