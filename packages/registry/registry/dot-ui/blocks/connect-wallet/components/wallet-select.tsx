"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Identicon } from "@polkadot/react-identicon";
import { MultiViewDialog, DialogView } from "./multi-view-dialog";
import { ViewSelectWallet } from "./view-select-wallet";
import { ViewSelectAccount } from "./view-select-account";

import { useTypink } from "typink";
import { cn } from "@/lib/utils";

interface WalletSelectProps extends Omit<ButtonProps, "children"> {
  placeholder?: string;
}

export function WalletSelect({
  className,
  placeholder,
  ...buttonProps
}: WalletSelectProps) {
  const { wallets, connectedWallets, connectedAccount } = useTypink();

  const views: DialogView[] = [
    {
      title: `Connect Wallets (${wallets.length} connected)`,
      description:
        "Select a wallet to connect to your account. If you don't have a wallet installed, you can install one from the list.",
      content: ({ next, previous }) => (
        <ViewSelectWallet next={next} previous={previous} />
      ),
    },
    {
      title: "Select Account",
      description: "Select an account to use for app interactions",
      content: ({ previous }) => <ViewSelectAccount previous={previous} />,
    },
  ];

  return (
    <MultiViewDialog
      initialView={connectedWallets.length > 0 ? 1 : 0}
      trigger={
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
      }
      views={views}
    />
  );
}
