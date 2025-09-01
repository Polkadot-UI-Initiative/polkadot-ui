"use client";

import { useMemo } from "react";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";
import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import {
  WalletSelectBase,
  type WalletSelectBaseProps,
  type AccountInfo,
  type WalletInfo,
} from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select.base";
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

  const services = useMemo(
    () => ({
      accounts: accounts as unknown as AccountInfo[],
      wallets: wallets as unknown as WalletInfo[],
      connectedWallets: connectedWallets as unknown as WalletInfo[],
      connectedAccount: connectedAccount as unknown as AccountInfo | undefined,
      connectWallet,
      disconnect,
      setConnectedAccount: setConnectedAccount as unknown as (
        account: AccountInfo
      ) => void,
    }),
    [
      accounts,
      wallets,
      connectedWallets,
      connectedAccount,
      connectWallet,
      disconnect,
      setConnectedAccount,
    ]
  );

  return (
    <ClientOnly>
      <WalletSelectBase {...props} services={services} />
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
