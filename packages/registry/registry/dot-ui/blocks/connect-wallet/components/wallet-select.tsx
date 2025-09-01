"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Identicon } from "@polkadot/react-identicon";
import { ViewSelectWallet } from "./view-select-wallet";
import { ViewSelectAccount } from "./view-select-account";

import { useTypink } from "typink";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WalletSelectProps extends Omit<ButtonProps, "children"> {
  placeholder?: string;
}

export function WalletSelect({
  className,
  placeholder,
  ...buttonProps
}: WalletSelectProps) {
  const { wallets, connectedWallets, connectedAccount } = useTypink();

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
            "inline-flex items-center gap-2 transition-[min-width] duration-300",
            className
          )}
          {...buttonProps}
        >
          <Wallet className="w-4 h-4" /> {placeholder}
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
              ? `Wallet (${wallets.length} connected)`
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
            next={() => setCurrentView(1)}
            previous={() => setCurrentView(0)}
          />
        ) : (
          <ViewSelectAccount previous={() => setCurrentView(0)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
