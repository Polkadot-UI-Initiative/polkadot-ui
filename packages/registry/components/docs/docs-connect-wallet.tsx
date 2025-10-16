import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ComponentPreview } from "../layout/component-preview";
import { connectWalletExample } from "../examples/dedot/examlpe-connect-wallet";

export function ConnectWalletDocs() {
  return (
    <div className="not-prose">
      <PolkadotProvider>
        <ComponentPreview componentInfo={connectWalletExample} />
      </PolkadotProvider>
    </div>
  );
}
