"use client";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  WalletSelectBase,
  type WalletSelectBaseProps,
} from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import { usePapi } from "@/registry/polkadot-ui/providers/polkadot-provider.papi";
import { useMemo, useCallback } from "react";

export type WalletSelectProps = Omit<WalletSelectBaseProps, "services">;

export function WalletSelect() {
  const {
    accounts,
    wallets,
    connectedWallets,
    connectWallet,
    disconnectWallet,
    selectedAccount,
    setSelectedAccount,
  } = usePapi();

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
      }) satisfies WalletSelectBaseProps["services"],
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

  return (
    <ClientOnly>
      <WalletSelectBase services={services} />
    </ClientOnly>
  );
}

export function WalletSelectWithProvider(props: WalletSelectProps) {
  return (
    <PolkadotProvider>
      <WalletSelect {...props} />
    </PolkadotProvider>
  );
}
