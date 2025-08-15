"use client";

import { ReactNode, useMemo, useEffect } from "react";
import { Balances, formatBalance } from "typink";
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";
import {
  AccountManagementHookProps,
  WalletManagementHookProps,
} from "@/registry/dot-ui/lib/types.dedot";
import {
  useActiveChain,
  useWalletManagement,
} from "../../connect-wallet/hooks/use-polkadot-hooks";

// Services interface for dependency injection
export interface AccountSelectionServices {
  useAccountManagement: () => AccountManagementHookProps;
  useWalletManagement: () => WalletManagementHookProps;
  usePolkadotBalances: (addresses: string[]) => Balances;
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
  const { useAccountManagement, usePolkadotBalances } = services;
  const { accounts, activeAccount, setActiveAccount } = useAccountManagement();
  const { disconnect } = useWalletManagement();
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

  if (!activeAccount) return null;

  const { name, address } = activeAccount;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Connect Account</DialogTitle>
        <DialogDescription>
          <span>Connected account: {name}</span>
          <span className="ml-2">{truncateAddress(address)}</span>
          <span>connected network: {activeChain.name}</span>
        </DialogDescription>
        {accounts?.map((account) => (
          <DialogClose asChild key={`${account.address}-${account.source}`}>
            <Button
              onClick={() => setActiveAccount(account)}
              aria-label={`Select account ${account.name} with address ${truncateAddress(account.address)}`}
            >
              <span>{account.name}</span>
              <span>{truncateAddress(account.address)}</span>
              <span>
                {formatBalance(
                  balances[account.address]?.free || 0,
                  activeChain
                )}
              </span>
            </Button>
          </DialogClose>
        ))}
      </DialogHeader>
    </>
  );
}

AccountSelectionBase.displayName = "AccountSelectionBase";
