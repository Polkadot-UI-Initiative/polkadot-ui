"use client";

import { Wallet, ExtensionWallet } from "typink";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, Users, Wallet as WalletIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AccountSelectionBase,
  AccountSelectionServices,
} from "@/registry/dot-ui/blocks/account-selection/components/account-selection.base";
import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";
import {
  AccountManagementHookProps,
  WalletManagementHookProps,
} from "@/registry/dot-ui/lib/types.dedot";
import { useCallback, useState } from "react";

export interface ConnectWalletServices {
  useWalletManagement: () => WalletManagementHookProps;
  useAccountManagement: () => AccountManagementHookProps;
}

interface WalletItemProps {
  walletInfo: Wallet;
  services: ConnectWalletServices;
}

function WalletItem({ walletInfo, services }: WalletItemProps) {
  const { name, id, logo, ready, installed } = walletInfo;
  const { connectWallet, disconnect, connectedWalletIds } =
    services.useWalletManagement();
  const { accounts } = services.useAccountManagement();

  const isConnected = connectedWalletIds.includes(id);
  const walletAccountCount = accounts.filter((acc) => acc.source === id).length;

  const handleConnectWallet = () => {
    if (!installed) {
      if (walletInfo instanceof ExtensionWallet) {
        const newWindow = window.open(
          walletInfo.installUrl,
          "_blank",
          "noopener,noreferrer"
        );
        if (newWindow) newWindow.opener = null;
      }
      return;
    }
    connectWallet(id);
  };

  const handleDisconnectWallet = () => {
    disconnect(id);
  };

  const isLoading = installed && !ready;

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          <Image src={logo} alt={name} width={32} height={32} />
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
        <Button disabled variant="outline" size="sm">
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
        isConnected
          ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
          : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image src={logo} alt={name} width={32} height={32} />
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-muted-foreground">
            {isConnected
              ? `Connected • ${walletAccountCount} account${walletAccountCount !== 1 ? "s" : ""}`
              : installed
                ? "Available"
                : "Not installed"}
          </span>
        </div>
      </div>

      {!installed ? (
        <Button onClick={handleConnectWallet} variant="outline" size="sm">
          Install
        </Button>
      ) : isConnected ? (
        <Button onClick={handleDisconnectWallet} variant="outline" size="sm">
          Disconnect
        </Button>
      ) : (
        <Button onClick={handleConnectWallet} size="sm">
          Connect
        </Button>
      )}
    </div>
  );
}

export interface ConnectWalletBaseProps {
  buttonLabel?: string;
  services: AccountSelectionServices;
}

function WalletManagement({
  services,
}: {
  services: AccountSelectionServices;
}) {
  const { wallets, disconnect, connectedWalletIds } =
    services.useWalletManagement();
  const { accounts } = services.useAccountManagement();
  const [showAccountSelection, setShowAccountSelection] = useState(false);

  const connectedWalletCount = connectedWalletIds.length;

  const totalAccountCount = accounts?.length ?? 0;

  const handleDisconnectAllWallets = useCallback(() => {
    disconnect();
  }, [disconnect]);

  if (showAccountSelection) {
    return <AccountSelectionBase services={services} />;
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <WalletIcon className="w-5 h-5" />
          Wallet Management
        </DialogTitle>
        <DialogDescription>
          Manage your wallet connections and accounts
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {wallets.map((wallet) => (
          <WalletItem key={wallet.id} walletInfo={wallet} services={services} />
        ))}
      </div>

      {connectedWalletCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {connectedWalletCount} wallet{connectedWalletCount !== 1 ? "s" : ""}{" "}
            connected • {totalAccountCount} account
            {totalAccountCount !== 1 ? "s" : ""} available
          </span>
        </div>
      )}

      <DialogFooter className="flex-col sm:flex-row gap-2">
        {connectedWalletCount > 0 && (
          <>
            <Button
              variant="outline"
              onClick={handleDisconnectAllWallets}
              className="w-full sm:w-auto"
            >
              Disconnect All Wallets
            </Button>
            {totalAccountCount > 0 && (
              <Button
                onClick={() => setShowAccountSelection(true)}
                className="w-full sm:w-auto"
              >
                Select Account
              </Button>
            )}
          </>
        )}
      </DialogFooter>
    </>
  );
}

export function ConnectWalletBase({
  buttonLabel = "Connect Wallet",
  services,
}: ConnectWalletBaseProps) {
  const { connectedWalletIds } = services.useWalletManagement();
  const { activeAccount, accounts } = services.useAccountManagement();

  const hasConnectedWallets = connectedWalletIds.length > 0;
  const totalAccountCount = accounts.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-4 h-4" />
            {activeAccount ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {activeAccount.name ? `${activeAccount.name}:` : ""}
                </span>
                <span>{truncateAddress(activeAccount.address)}</span>
              </div>
            ) : hasConnectedWallets ? (
              <div className="flex items-center gap-1">
                <span>
                  {totalAccountCount} account
                  {totalAccountCount !== 1 ? "s" : ""}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {connectedWalletIds.length} wallet
                  {connectedWalletIds.length !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              buttonLabel
            )}
          </div>
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <WalletManagement services={services} />
      </DialogContent>
    </Dialog>
  );
}