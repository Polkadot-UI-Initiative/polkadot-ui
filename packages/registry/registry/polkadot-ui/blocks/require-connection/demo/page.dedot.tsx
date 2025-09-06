import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { RequireConnection } from "@/registry/polkadot-ui/blocks/require-connection/components/require-connection.dedot";
import RequireConnectionDemo from "@/registry/polkadot-ui/blocks/require-connection/demo/require-connection-demo";

export default function RequireConnectionDedotPage() {
  return (
    <RequireConnectionDemo
      Provider={PolkadotProvider}
      RequireConnection={RequireConnection}
      libraryName="Dedot"
    />
  );
}
