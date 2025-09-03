"use client";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/polkadot-provider.dedot";
import {
  WalletSelectBase,
  type WalletSelectBaseProps,
} from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.base";
import { useTypink } from "typink";

export type WalletSelectProps = Omit<WalletSelectBaseProps, "services">;

export function WalletSelect(props: WalletSelectProps) {
  const {
    accounts,
    wallets,
    connectedWallets,
    connectedAccount,
    connectWallet,
    disconnect,
    setConnectedAccount,
  } = useTypink();

  return (
    <ClientOnly>
      <WalletSelectBase
        {...props}
        services={{
          accounts,
          wallets,
          connectedWallets,
          connectedAccount,
          connectWallet,
          disconnect,
          setConnectedAccount,
        }}
      />
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
