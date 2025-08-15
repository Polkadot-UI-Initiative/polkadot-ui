"use client";

import { ReactNode, useMemo, useEffect } from "react";
import { Balances, formatBalance } from "typink";
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";
import {
  AccountManagementHookProps,
  WalletManagementHookProps,
} from "@/registry/dot-ui/lib/types.dedot";
import { useActiveChain } from "@/registry/dot-ui/blocks/connect-wallet/hooks/use-polkadot-hooks";
import { Identicon } from "@polkadot/react-identicon";
import { Badge } from "@/registry/dot-ui/ui/badge";
import Image from "next/image";

export interface AccountSelectionServices {
  useAccountManagement: () => AccountManagementHookProps;
  useWalletManagement: () => WalletManagementHookProps;
  usePolkadotBalances: (addresses: string[]) => Balances;
}

export interface AccountSelectionBaseProps {
  services: AccountSelectionServices;
}

export interface AccountSelectionProviderProps {
  children: ReactNode;
}

interface AccountItemProps {
  account: {
    address: string;
    source: string;
    name?: string;
  };
  balance: string;
  isSelected: boolean;
  onSelect: () => void;
  services: AccountSelectionServices;
  identiconSize?: number;
}

function AccountItem({
  account,
  balance,
  isSelected,
  onSelect,
  services,
  identiconSize = 24,
}: AccountItemProps) {
  const { address, name, source } = account;
  const { wallets } = services.useWalletManagement();

  const getWalletBySource = (source: string) =>
    wallets.find((wallet) => wallet.id === source);

  const wallet = getWalletBySource(source);

  const handleSelect = () => {
    onSelect();
  };

  // Badge size is 40% of the identicon size with minimum size 16px
  const badgeSize = Math.max(Math.floor(identiconSize * 0.4), 16);

  return (
    <DialogClose asChild>
      <Button
        onClick={handleSelect}
        variant="outline"
        className={`flex items-center justify-start gap-6 w-full h-auto rounded-lg border cursor-pointer hover:bg-muted hover:text-muted-foreground hover:border-muted-foreground transition-colors [&_svg]:!w-auto [&_svg]:!h-auto ${
          isSelected
            ? "bg-muted text-muted-foreground border-muted-foreground shadow-sm"
            : "bg-background border-border"
        }`}
        aria-label={`Select account ${name} with address ${truncateAddress(address)}`}
      >
        {/* Identicon with wallet badge */}
        <div className="relative">
          <Identicon
            value={address}
            theme="polkadot"
            size={identiconSize}
            className="rounded-full"
          />
          {wallet && wallet.logo && (
            <Image
              src={wallet.logo}
              alt={wallet.name}
              width={badgeSize}
              height={badgeSize}
              className="rounded-full border-2 border-background absolute -bottom-1 -right-1"
            />
          )}
        </div>

        {/* Account info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 w-full">
            <span className="text-lg font-medium truncate">{name || " "}</span>
            {isSelected && (
              <Badge variant="default" className="text-xs">
                Active
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            {truncateAddress(address)}
          </span>
          <span className="text-sm text-muted-foreground">{balance}</span>
        </div>
      </Button>
    </DialogClose>
  );
}

export function AccountSelectionBase({ services }: AccountSelectionBaseProps) {
  // Extract services
  const { useAccountManagement, usePolkadotBalances } = services;
  const { accounts, activeAccount, setActiveAccount } = useAccountManagement();
  const activeChain = useActiveChain();

  const addresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  );
  const balances = usePolkadotBalances(addresses);

  useEffect(() => {
    if (
      activeAccount &&
      accounts.map((account) => account.address).includes(activeAccount.address)
    ) {
      return;
    }

    if (accounts[0]) {
      setActiveAccount(accounts[0]);
    }
  }, [accounts, activeAccount, setActiveAccount]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Select Account</DialogTitle>
        <DialogDescription>Choose an account to connect</DialogDescription>
      </DialogHeader>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {accounts?.map((account) => (
          <AccountItem
            key={`${account.address}-${account.source}`}
            account={account}
            balance={formatBalance(
              balances[account.address]?.free || 0,
              activeChain
            )}
            isSelected={
              activeAccount?.address === account.address &&
              activeAccount?.source === account.source
            }
            onSelect={() => setActiveAccount(account)}
            services={services}
          />
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No accounts available. Please connect a wallet first.
        </div>
      )}
    </>
  );
}

AccountSelectionBase.displayName = "AccountSelectionBase";
