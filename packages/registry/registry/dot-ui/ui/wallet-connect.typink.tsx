"use client";

import { useMemo } from "react";
import { useTypink, useBalances } from "typink";
import {
  TypinkProvider,
  usePolkadotWallet,
} from "@/registry/dot-ui/providers/typink-provider";
import {
  WalletSelectionBase,
  type WalletSelectionBaseProps,
} from "@/registry/dot-ui/ui/wallet-connect";

// Props type - removes services prop since we inject it
export type WalletSelectionProps = Omit<WalletSelectionBaseProps, "services">;

export function WalletSelection(props: WalletSelectionProps) {
  const typinkContext = usePolkadotWallet();
  const typinkAccountContext = useTypink();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useWallet: () => ({
        wallets: typinkContext.wallets,
        activeSigner: typinkContext.activeSigner,
        activeAccount: typinkContext.activeAccount
          ? {
              name: typinkContext.activeAccount.name,
              address: typinkContext.activeAccount.address,
            }
          : null,
        connectWallet: typinkContext.connectWallet,
      }),
      accountServices: {
        useAccountManagement: () => ({
          accounts: typinkAccountContext.accounts,
          connectedAccount: typinkAccountContext.connectedAccount || null,
          setConnectedAccount: typinkAccountContext.setConnectedAccount,
          disconnect: typinkAccountContext.disconnect,
          network: typinkAccountContext.network,
        }),
        useBalances,
      },
    }),
    [typinkContext, typinkAccountContext]
  );

  return <WalletSelectionBase {...props} services={services} />;
}

// Wrapped version with provider for drop-in usage
export function WalletSelectionWithProvider(props: WalletSelectionProps) {
  return (
    <TypinkProvider appName="dot-ui">
      <WalletSelection {...props} />
    </TypinkProvider>
  );
}

WalletSelectionWithProvider.displayName = "WalletSelectionWithProvider";
