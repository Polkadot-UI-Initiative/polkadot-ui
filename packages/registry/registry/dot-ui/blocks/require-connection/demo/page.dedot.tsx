import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { RequireConnection } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.dedot";
import RequireConnectionDemo from "@/registry/dot-ui/blocks/require-connection/demo/require-connection-demo";

export default function RequireConnectionDedotPage() {
  return (
    <RequireConnectionDemo
      Provider={PolkadotProvider}
      RequireConnection={RequireConnection}
      libraryName="Dedot"
    />
  );
}
