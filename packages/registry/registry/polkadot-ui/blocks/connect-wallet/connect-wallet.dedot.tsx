"use client";

import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
  ConnectWalletBase,
  type ConnectWalletBaseProps,
} from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.base";
import { useTypink } from "typink";

export type ConnectWalletProps = Omit<ConnectWalletBaseProps, "services">;

export function ConnectWallet(props: ConnectWalletProps) {
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
    <ConnectWalletBase
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

export function ConnectWalletWithProvider(props: ConnectWalletProps) {
  return (
    <PolkadotProvider>
      <ConnectWallet {...props} />
    </PolkadotProvider>
  );
}
