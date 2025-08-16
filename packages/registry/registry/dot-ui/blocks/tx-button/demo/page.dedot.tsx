"use client";
import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";

export default function TxButtonDedotPage() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <TxButton
        tx={(tx) =>
          tx.system.remarkWithEvent(
            "Hello, World from Polkadot Next.js Starter!"
          )
        }
      >
        Send Remark
      </TxButton>
    </div>
  );
}
