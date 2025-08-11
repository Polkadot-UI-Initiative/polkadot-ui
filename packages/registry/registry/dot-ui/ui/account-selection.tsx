"use client";

import { formatBalance, useTypink, useBalances } from "typink";
import { useMemo, useEffect } from "react";
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "../lib/utils.dot-ui";

export default function AccountSelection() {
  const {
    accounts,
    connectedAccount,
    setConnectedAccount,
    disconnect,
    network,
  } = useTypink();
  const addresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  );
  const balances = useBalances(addresses);

  useEffect(() => {
    if (
      connectedAccount &&
      accounts
        .map((account) => account.address)
        .includes(connectedAccount.address)
    ) {
      return;
    }

    setConnectedAccount(accounts[0]);
  }, [accounts]);

  if (!connectedAccount) return null;

  const { name, address } = connectedAccount;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Connect Account</DialogTitle>
        <DialogDescription>
          <span>Connected account: {name}</span>
          <span className="ml-2">{truncateAddress(address)}</span>
          <div>connected network: {network.name}</div>
        </DialogDescription>
        {accounts.map((account) => (
          <DialogClose asChild key={account.address}>
            <Button onClick={() => setConnectedAccount(account)}>
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
