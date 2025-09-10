import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComponentExample } from "../types.examples";
import { RemarkButton } from "./remark-button.papi";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

export const txButtonExample: ComponentExample = {
  name: "Tx Button",
  href: "/docs/components/tx-button",
  code: "tx-button",
  description:
    "Button component for sending arbitrary transactions. Supports all chains, all signers with default notification. Fees and error states are handled by the component.",
  component: <DemoTxButton />,
};

export function DemoTxButton() {
  const { supportedNetworks } = usePapi();

  return (
    <Tabs defaultValue={supportedNetworks[0].id}>
      <TabsList>
        {supportedNetworks.slice(0, 3).map((network) => (
          <TabsTrigger key={network.id} value={network.id} className="text-xs">
            {network.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {supportedNetworks.slice(0, 3).map((network) => (
        <TabsContent
          key={network.id}
          value={network.id}
          className="w-full items-center justify-center h-full flex my-8"
        >
          <RemarkButton chainId={network.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
