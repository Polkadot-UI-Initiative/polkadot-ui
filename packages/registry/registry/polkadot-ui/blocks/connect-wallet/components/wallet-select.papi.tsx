"use client";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import {
  WalletSelectBase,
  type WalletSelectBaseProps,
} from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";
import { usePapi } from "@/registry/polkadot-ui/providers/polkadot-provider.reactive-dot";

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

  // Map reactive-dot shapes to base props
  const services = {
    accounts: accounts.map((a) => ({
      address: a.address,
      name: a.name,
      source: "not implemented",
    })),
    wallets: (wallets ?? []).map((w) => ({
      id: w.id,
      name: w.name,
      logo: undefined,
      //TODO: fix this
      installed: true,
      installUrl: "not implemented",
    })),
    connectedWallets: connectedWallets.map((w) => ({
      id: w.id,
      name: w.name,
      logo: undefined,
      installed: true,
      installUrl: "not implemented",
    })),

    connectWallet: async (id: string) => {
      await connectWallet(wallets.find((w) => w.id === id));
    },
    disconnect: async (walletId?: string) => {
      await disconnectWallet(wallets.find((w) => w.id === walletId));
    },
    connectedAccount: selectedAccount
      ? {
          name: selectedAccount.name,
          source: "not implemented",
          address: selectedAccount.address,
        }
      : undefined,
    setConnectedAccount: (account) =>
      setSelectedAccount(
        selectedAccount
          ? {
              ...selectedAccount,
              id: account.address,
              name: account.name,
              address: account.address,
              polkadotSigner: selectedAccount?.polkadotSigner,
            }
          : null
      ),
  } satisfies WalletSelectBaseProps["services"];

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
