"use client";

import { useMemo } from "react";
import { useBalances } from "typink";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { usePolkadotWallet } from "@/registry/dot-ui/providers/typink-provider";
import {
  AccountSelectionBase,
  type AccountSelectionBaseProps,
} from "@/registry/dot-ui/blocks/account-selection/components/account-selection.base";

// Props type - removes services prop since we inject it
export type AccountSelectionProps = Omit<AccountSelectionBaseProps, "services">;

export function AccountSelection(props: AccountSelectionProps) {
  const walletContext = usePolkadotWallet();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useAccountManagement: () => ({
        accounts: walletContext.accounts,
        setActiveAccount: walletContext.setConnectedAccount,
        disconnect: walletContext.disconnect,
        network: walletContext.network,
        activeAccount: walletContext.connectedAccount || undefined,
      }),
      useBalances,
    }),
    [walletContext]
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
