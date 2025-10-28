"use client";
import {
  ConnectWalletBase,
  ConnectWalletSkeleton,
  type ConnectWalletBaseProps,
} from "./connect-wallet.base";
import {
  PolkadotProvider,
  useSelectedAccount,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import {
  useAccounts,
  useConnectedWallets,
  useWalletConnector,
  useWalletDisconnector,
  useWallets,
} from "@reactive-dot/react";
import { Suspense, useCallback, useMemo } from "react";

export type ConnectWalletProps = Omit<ConnectWalletBaseProps, "services">;

export function ConnectWallet(props: ConnectWalletProps) {
  return (
    <Suspense fallback={<ConnectWalletSkeleton />}>
      <ConnectWalletInner {...props} />
    </Suspense>
  );
}

function ConnectWalletInner(props: ConnectWalletProps) {
  const wallets = useWallets();
  const accounts = useAccounts();
  const connectedWallets = useConnectedWallets();
  const { selectedAccount, setSelectedAccount } = useSelectedAccount();
  const [, connectWallet] = useWalletConnector();
  const [, disconnectWallet] = useWalletDisconnector();

  const installedWalletIds = useMemo(
    () => new Set(wallets.map((w) => w.id)),
    [wallets]
  );

  const mappedAccounts = useMemo(
    () =>
      accounts.map((a) => ({
        address: a.address,
        name: a.name,
        source: a.wallet.id,
      })),
    [accounts]
  );

  const mappedWallets = useMemo(
    () =>
      (wallets ?? []).map((w) => ({
        id: w.id,
        name: w.name,
        logo: undefined,
        installed: installedWalletIds.has(w.id),
      })),
    [wallets, installedWalletIds]
  );

  const mappedConnectedWallets = useMemo(
    () =>
      connectedWallets.map((w) => ({
        id: w.id,
        name: w.name,
        logo: undefined,
        installed: installedWalletIds.has(w.id),
      })),
    [connectedWallets, installedWalletIds]
  );

  const handleConnect = useCallback(
    async (id: string) => {
      await connectWallet(wallets.find((w) => w.id === id));
    },
    [wallets, connectWallet]
  );

  const handleDisconnect = useCallback(
    async (walletId?: string) => {
      await disconnectWallet(wallets.find((w) => w.id === walletId));
    },
    [wallets, disconnectWallet]
  );

  const mappedConnectedAccount = useMemo(
    () =>
      selectedAccount
        ? {
            name: selectedAccount.name,
            source: selectedAccount.wallet.id,
            address: selectedAccount.address,
          }
        : undefined,
    [selectedAccount]
  );

  const handleSetConnectedAccount = useCallback(
    (account: { address: string; name?: string }) => {
      const found = accounts.find((a) => a.address === account.address) || null;
      setSelectedAccount(found);
    },
    [accounts, setSelectedAccount]
  );

  const services = useMemo(
    () =>
      ({
        accounts: mappedAccounts,
        wallets: mappedWallets,
        connectedWallets: mappedConnectedWallets,
        connectWallet: handleConnect,
        disconnect: handleDisconnect,
        connectedAccount: mappedConnectedAccount,
        setConnectedAccount: handleSetConnectedAccount,
      }) satisfies ConnectWalletBaseProps["services"],
    [
      mappedAccounts,
      mappedWallets,
      mappedConnectedWallets,
      handleConnect,
      handleDisconnect,
      mappedConnectedAccount,
      handleSetConnectedAccount,
    ]
  );

  return <ConnectWalletBase services={services} {...props} />;
}

export function ConnectWalletWithProvider(props: ConnectWalletProps) {
  return (
    <PolkadotProvider>
      <ConnectWallet {...props} />
    </PolkadotProvider>
  );
}
