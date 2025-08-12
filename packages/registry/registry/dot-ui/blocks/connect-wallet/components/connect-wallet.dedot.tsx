"use client";

import { useMemo } from "react";
import { useBalances } from "typink";
import {
  TypinkProvider,
  usePolkadotWallet,
} from "@/registry/dot-ui/providers/typink-provider";
import {
  WalletSelectionBase,
  type WalletSelectionBaseProps,
} from "@/registry/dot-ui/blocks/connect-wallet/components/connect-wallet.base";

// Props type - removes services prop since we inject it
export type WalletSelectionProps = Omit<WalletSelectionBaseProps, "services">;

export function WalletSelection(props: WalletSelectionProps) {
  const typinkContext = usePolkadotWallet();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useWallet: () => ({
        wallets: typinkContext.wallets,
        activeSigner: typinkContext.signer,
        activeAccount: typinkContext.connectedAccount
          ? {
              name: typinkContext.connectedAccount.name,
              address: typinkContext.connectedAccount.address,
            }
          : null,
        connectWallet: typinkContext.connectWallet,
      }),
      accountServices: {
        useAccountManagement: () => ({
          accounts: typinkContext.accounts,
          activeAccount: typinkContext.connectedAccount,
          setActiveAccount: typinkContext.setConnectedAccount,
          disconnect: typinkContext.disconnect,
          network: typinkContext.network,
        }),
        useBalances,
      },
    }),
    [typinkContext]
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
