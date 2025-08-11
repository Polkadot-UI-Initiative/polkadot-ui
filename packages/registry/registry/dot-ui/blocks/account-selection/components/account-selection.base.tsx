"use client";

import { ReactNode, useMemo, useEffect } from "react";
import { formatBalance } from "typink";
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";
import { NetworkInfo, InjectedAccount } from "typink";

// Balance data interface
export interface BalanceData {
  free: string | number | bigint;
}

// Services interface for dependency injection
export interface AccountSelectionServices {
  // Hook for account management
  useAccountManagement: () => {
    accounts: InjectedAccount[];
    setActiveAccount: (account: InjectedAccount) => void;
    disconnect: () => void;
    network: NetworkInfo;
    activeAccount?: InjectedAccount;
  };
  // Hook for balance queries
  useBalances: (addresses: string[]) => Record<string, BalanceData>;
}

export interface AccountSelectionBaseProps {
  // Injected services - this makes it reusable
  services: AccountSelectionServices;
}

// Provider wrapper interface
export interface AccountSelectionProviderProps {
  children: ReactNode;
}

export function AccountSelectionBase({ services }: AccountSelectionBaseProps) {
  // Extract services
  const { useAccountManagement, useBalances } = services;
  const { accounts, activeAccount, setActiveAccount, disconnect, network } =
    useAccountManagement();

  const addresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  );
  const balances = useBalances(addresses);

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

  if (!activeAccount) return null;

  const { name, address } = activeAccount;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Connect Account</DialogTitle>
        <DialogDescription>
          <span>Connected account: {name}</span>
          <span className="ml-2">{truncateAddress(address)}</span>
          <div>connected network: {network.name}</div>
        </DialogDescription>
        {accounts?.map((account) => (
          <DialogClose asChild key={account.address}>
            <Button onClick={() => setActiveAccount(account)}>
              <span>{account.name}</span>
              <span>{truncateAddress(account.address)}</span>
              <span>
                {formatBalance(balances[account.address]?.free || 0, network)}
              </span>
            </Button>
          </DialogClose>
        ))}
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </DialogFooter>
    </>
  );
}

AccountSelectionBase.displayName = "AccountSelectionBase";
