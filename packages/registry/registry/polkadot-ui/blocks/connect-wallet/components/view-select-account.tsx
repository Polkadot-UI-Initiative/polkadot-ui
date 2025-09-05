"use client";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Identicon from "@polkadot/react-identicon";
import { ArrowLeft } from "lucide-react";
import { truncateAddress } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type ViewSelectAccountProps } from "@/registry/polkadot-ui/blocks/connect-wallet/components/connect-wallet.base";

export function ViewSelectAccount({
  previous,
  accounts,
  connectedAccount,
  setConnectedAccount,
  wallets,
}: ViewSelectAccountProps) {
  const sortedAccounts = (accounts || [])
    .slice()
    .sort((a, b) => a.source.localeCompare(b.source));

  return (
    <>
      <div className="flex flex-col gap-2 overflow-y-scroll scroll-shadows max-h-[60vh] min-h-[100px]">
        {sortedAccounts.map((account) => {
          const wallet = wallets.find((w) => w.id === account.source);

          return (
            <div key={`${account.address}-${account.source}`}>
              <DialogClose asChild>
                <Button
                  variant={
                    connectedAccount?.address === account.address
                      ? "default"
                      : "ghost"
                  }
                  className="w-full flex flex-row h-auto justify-start items-center gap-2 px-2 hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    setConnectedAccount(account);
                  }}
                >
                  <div className="relative inline-block">
                    {wallet?.logo && (
                      <div className="rounded-full overflow-hidden border-2 border-background h-6 w-6 absolute bottom-0 right-0 shadow-md z-10 bg-background">
                        <Image
                          src={wallet.logo}
                          alt={wallet.id}
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                    <div className="rounded-full overflow-hidden border-background w-12 h-12 relative">
                      <Identicon
                        value={account.address}
                        size={64}
                        theme="polkadot"
                        className="w-12 h-12 [&>svg]:!h-full [&>svg]:!w-full [&>svg>circle:first-child]:fill-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <span className="font-bold">{account.name}</span>
                    {account.address && (
                      <div>{truncateAddress(account.address)}</div>
                    )}
                  </div>
                </Button>
              </DialogClose>
            </div>
          );
        })}
      </div>
      <DialogFooter className="pt-4">
        <Button
          variant="outline"
          onClick={previous}
          className="flex flex-row items-center gap-2"
        >
          <ArrowLeft className="w-3 h-3" /> Back to wallet selection
        </Button>
      </DialogFooter>
    </>
  );
}
