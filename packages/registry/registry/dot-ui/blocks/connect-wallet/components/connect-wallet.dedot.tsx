"use client";

import { useMemo } from "react";
import { useBalances } from "typink";
import {
  TypinkProvider,
  usePolkadotWallet,
} from "@/registry/dot-ui/providers/typink-provider";
import {
  ConnectWalletBase,
  type ConnectWalletBaseProps,
} from "@/registry/dot-ui/blocks/connect-wallet/components/connect-wallet.base";

// Props type - removes services prop since we inject it
export type ConnectWalletProps = Omit<ConnectWalletBaseProps, "services">;

export function ConnectWallet(props: ConnectWalletProps) {
  const {
    wallets,
    signer: activeSigner,
    accounts,
    connectedAccount: activeAccount,
    setConnectedAccount: setActiveAccount,
    disconnect,
    connectWallet,
    network,
  } = usePolkadotWallet();

  // Simple services object with type-compatible wrappers
  const services = useMemo(
    () => ({
      useWallet: () => ({
        wallets,
        activeSigner,
        activeAccount: activeAccount
          ? {
              name: activeAccount.name,
              address: activeAccount.address,
            }
          : null,
        connectWallet,
      }),
      accountServices: {
        useAccountManagement: () => ({
          accounts,
          activeAccount,
          setActiveAccount,
          disconnect,
          network,
        }),
        useBalances,
      },
    }),
    [wallets, activeSigner, accounts, activeAccount, disconnect, network]
  );

  return <ConnectWalletBase {...props} services={services} />;
}

// Wrapped version with provider for drop-in usage
export function ConnectWalletWithProvider(props: ConnectWalletProps) {
  return (
    <TypinkProvider appName="dot-ui">
      <ConnectWallet {...props} />
    </TypinkProvider>
  );
}

ConnectWalletWithProvider.displayName = "ConnectWalletWithProvider";
