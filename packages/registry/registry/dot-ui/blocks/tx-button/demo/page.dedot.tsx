"use client";
import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";
import { useTx } from "typink";

export default function TxButtonDedotPage() {
  const tx = useTx((tx) => tx.system.remark);

  return (
    <div className="flex flex-col gap-2 w-full">
      <TxButton tx={tx} args={["Hello, World from Polkadot Next.js Starter!"]}>
        Send Remark
      </TxButton>
    </div>
  );
}
