"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Identicon } from "@polkadot/react-identicon";
import { ViewSelectWallet } from "@/registry/polkadot-ui/blocks/connect-wallet/view-select-wallet";
import { ViewSelectAccount } from "@/registry/polkadot-ui/blocks/connect-wallet/view-select-account";
import { Wallet as WalletIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface WalletInfo {
  id: string;
  name: string;
  logo?: string;
  installed: boolean;
  installUrl?: string;
}

export interface AccountInfo {
  address: string;
  name?: string;
  source: string;
}

export interface ConnectWalletServices {
  wallets: WalletInfo[];
  connectedWallets: WalletInfo[];
  accounts: AccountInfo[];
  connectedAccount?: AccountInfo;
  connectWallet: (id: string) => Promise<void>;
  disconnect: (walletId?: string) => void;
  setConnectedAccount: (account: AccountInfo) => void;
}

export interface ViewSelectWalletProps {
  next: () => void;
  wallets: WalletInfo[];
  connectedWallets: WalletInfo[];
  accounts: AccountInfo[];
  connectWallet: (id: string) => Promise<void>;
  disconnect: (walletId?: string) => void;
}

export interface ViewSelectAccountProps<
  TAccount extends AccountInfo = AccountInfo,
> {
  previous: () => void;
  wallets: WalletInfo[];
  accounts: AccountInfo[];
  connectedAccount?: TAccount;
  setConnectedAccount: (account: TAccount) => void;
}

export interface ConnectWalletBaseProps extends Omit<ButtonProps, "children"> {
  placeholder?: string;
  services: ConnectWalletServices;
}

export function ConnectWalletBase({
  className,
  placeholder,
  services,
  ...buttonProps
}: ConnectWalletBaseProps) {
  const {
    accounts,
    wallets,
    connectedWallets,
    connectedAccount,
    connectWallet,
    disconnect,
    setConnectedAccount,
  } = services;

  const [open, setOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState(0);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setCurrentView(connectedWallets.length > 0 ? 1 : 0);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "inline-flex items-center gap-2 transition-[min-width]",
            "transition-transform duration-150 ease-out active:scale-[0.98] active:translate-y-[0.5px]",
            className
          )}
          {...buttonProps}
        >
          <WalletIcon className="w-4 h-4" /> {placeholder}
          {connectedAccount?.name && (
            <span className="hidden sm:block max-w-[100px] truncate">
              {connectedAccount?.name}
            </span>
          )}
          {connectedAccount?.address && (
            <Identicon
              value={connectedAccount?.address}
              size={30}
              theme="polkadot"
              className="[&>svg>circle:first-child]:fill-none"
            />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle>
            {currentView === 0
              ? `SelectWallet (${connectedWallets.length} connected)`
              : "Select Account"}
          </DialogTitle>
          <DialogDescription>
            {currentView === 0
              ? "Select a wallet to connect to your account. If you don't have a wallet installed, you can install one from the list."
              : "Select an account to use for app interactions"}
          </DialogDescription>
        </DialogHeader>

        {currentView === 0 ? (
          <ViewSelectWallet
            wallets={wallets}
            connectedWallets={connectedWallets}
            accounts={accounts}
            connectWallet={connectWallet}
            disconnect={disconnect}
            next={() => setCurrentView(1)}
          />
        ) : (
          <ViewSelectAccount
            previous={() => setCurrentView(0)}
            wallets={wallets}
            accounts={accounts}
            connectedAccount={connectedAccount}
            setConnectedAccount={setConnectedAccount}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
