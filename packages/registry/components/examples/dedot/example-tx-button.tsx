import { useTypink } from "typink";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RemarkButton } from "@/components/examples/dedot/remark-button";

import type { ComponentExample } from "../types.examples";

export const txButtonExample: ComponentExample = {
  name: "Tx Button",
  href: "/docs/components/tx-button",
  code: "tx-button",
  description:
    "Button component for sending arbitrary transactions. Supports all chains, all signers with default notification. Fees and error states are handled by the component.",
  component: <DemoTxButton />,
  tsx: `import { TxButton } from "@/components/tx-button.dedot";
import { paseo } from "typink";

export function RemarkTxButton() {
  const tx = useTx((tx) => tx.system.remark);

  return (
    <TxButton
      tx={tx}
      args={["Hello World from polkadot-ui"]}
      className="w-full"
      notifications={{
        title: "Remark Welcome Message",
      }}
      networkId={paseo.id}
    >
      Remark a message on{" "}
      <img src={paseo.logo} alt={paseo.name} className="w-4 h-4" />
    </TxButton>
  );
}
`,
};

export function DemoTxButton() {
  const { supportedNetworks } = useTypink();

  const nets = supportedNetworks?.slice() || [];

  if (nets.length === 0) {
    return (
      <div className="flex w-full items-center justify-center p-8 text-muted-foreground">
        No supported networks available
      </div>
    );
  }

  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue={nets[0].id}>
        <TabsList>
          {nets.slice(0, 3).map((network) => (
            <TabsTrigger
              key={network.id}
              value={network.id}
              className="text-xs"
            >
              {network.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {nets.slice(0, 3).map((network) => (
          <TabsContent
            key={network.id}
            value={network.id}
            className="w-full items-center justify-center h-full flex my-8"
          >
            <RemarkButton networkId={network.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
