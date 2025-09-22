"use client";

import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
  WalletSelectBase,
  type WalletSelectBaseProps,
} from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.base";
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
  );
}

export function WalletSelectWithProvider(props: WalletSelectProps) {
  return (
    <PolkadotProvider>
      <WalletSelect {...props} />
    </PolkadotProvider>
  );
}
