import { useTypink } from "typink";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOnly } from "../../registry/polkadot-ui/blocks/client-only";
import { RemarkButton } from "../examples/dedot/remark-button";

export function DemoTxButton() {
  const { supportedNetworks } = useTypink();
  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue={supportedNetworks[0].name}>
        <TabsList>
          {supportedNetworks.slice(0, 3).map((network) => (
            <TabsTrigger
              key={network.name}
              value={network.name}
              className="text-xs"
            >
              {network.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {supportedNetworks.slice(0, 3).map((network) => (
          <TabsContent
            key={network.name}
            value={network.name}
            className="w-full items-center justify-center h-full flex my-8"
          >
            <ClientOnly>
              <RemarkButton networkId={network.id} />
            </ClientOnly>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
