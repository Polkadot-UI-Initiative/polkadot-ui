"use client";

import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { Button } from "./ui/button";

export function TestTx() {
  const { activeAccount, apis, activeSigner } = useDedot();

  function handleClick() {
    if (!activeAccount) return;
    const tx = apis.polkadot.tx.system.remark("Hello, World!");
    tx.signAndSend(activeAccount.address, { signer: activeSigner });
  }

  return <Button onClick={handleClick}>Test Tx</Button>;
}
