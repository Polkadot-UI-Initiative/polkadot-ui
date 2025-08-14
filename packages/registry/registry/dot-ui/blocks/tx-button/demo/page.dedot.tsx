import { TxButton } from "@/registry/dot-ui/blocks/tx-button/components/tx-button.dedot";
import { useClient } from "@/registry/dot-ui/hooks/polkadot-hooks.dedot";

export default function TxButtonDedotPage() {
  const client = useClient();

  const tx = client?.tx.system.remarkWithEvent(
    "Hello, World from Polkadot Next.js Starter!"
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <TxButton tx={tx}>Send Remark</TxButton>
    </div>
  );
}
