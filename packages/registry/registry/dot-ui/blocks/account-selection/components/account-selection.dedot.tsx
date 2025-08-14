"use client";

import { useMemo } from "react";
import {
  PolkadotProvider,
  useConfiguredTypink,
} from "@/registry/dot-ui/providers/dedot-provider";
import {
  useAccountManagement,
  usePolkadotBalances,
  useWalletManagement,
} from "@/registry/dot-ui/blocks/connect-wallet/hooks/use-polkadot-hooks";
import {
  AccountSelectionBase,
  type AccountSelectionBaseProps,
} from "@/registry/dot-ui/blocks/account-selection/components/account-selection.base";

// Props type - removes services prop since we inject it
export type AccountSelectionProps = Omit<AccountSelectionBaseProps, "services">;

export function AccountSelection(props: AccountSelectionProps) {
  const typinkContext = useConfiguredTypink();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useWalletManagement,
      useAccountManagement,
      usePolkadotBalances,
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
