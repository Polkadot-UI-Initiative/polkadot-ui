"use client";

import { Wallet, ExtensionWallet } from "typink";
import { Button } from "@/registry/dot-ui/ui/button";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AccountSelectionBase,
  type AccountSelectionServices,
} from "@/registry/dot-ui/blocks/account-selection/components/account-selection.base";
import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";

// Services interface for dependency injection
export interface WalletConnectServices {
  // Hook for wallet management
  useWallet: () => {
    wallets: Wallet[];
    activeSigner: unknown;
    activeAccount: { name?: string; address: string } | null;
    connectWallet: (walletId: string) => void;
  };
  // Account selection services
  accountServices: AccountSelectionServices;
}

interface WalletButtonProps {
  walletInfo: Wallet;
  afterSelectWallet?: () => void;
  services: WalletConnectServices;
}

function WalletButton({
  walletInfo,
  afterSelectWallet,
  services,
}: WalletButtonProps) {
  const { name, id, logo, ready, installed } = walletInfo;
  const { connectWallet } = services.useWallet();

  const doConnectWallet = () => {
    if (!installed) {
      if (walletInfo instanceof ExtensionWallet) {
        const newWindow = window.open(walletInfo.installUrl, "_blank");
        if (newWindow) newWindow.opener = null;
      }
      return;
    }
    connectWallet(id);
    afterSelectWallet?.();
  };

  const isLoading = installed && !ready;

  if (isLoading) return <Button>Loading...</Button>;

  return (
    <Button onClick={doConnectWallet} className="group">
      <div className="flex items-center gap-2">
        <Image src={logo} alt={name} width={24} height={24} />
        <span>{installed ? name : `Install ${name}`}</span>
      </div>
      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
    </Button>
  );
}

export interface WalletSelectionBaseProps {
  buttonLabel?: string;
  // Injected services - this makes it reusable
  services: WalletConnectServices;
}

function WalletOption({ services }: { services: WalletConnectServices }) {
  const { wallets } = services.useWallet();
  return (
    <>
      <DialogHeader>
        <DialogTitle>Connect Wallet</DialogTitle>
        <DialogDescription>Select a wallet to connect to</DialogDescription>
      </DialogHeader>
      {wallets.map((wallet) => (
        <DialogClose asChild key={wallet.id}>
          <WalletButton walletInfo={wallet} services={services} />
        </DialogClose>
      ))}
    </>
  );
}

export function WalletSelectionBase({
  buttonLabel = "Connect Wallet",
  services,
}: WalletSelectionBaseProps) {
  const { activeSigner, activeAccount } = services.useWallet();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex items-center gap-2">
            <span>{activeAccount ? `(${activeAccount.name})` : ""}</span>
            <span>
              {activeAccount
                ? truncateAddress(activeAccount.address)
                : buttonLabel}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {activeSigner ? (
          <AccountSelectionBase services={services.accountServices} />
        ) : (
          <WalletOption services={services} />
        )}
      </DialogContent>
    </Dialog>
  );
}
