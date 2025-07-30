import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { RequireConnection } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.papi";
import RequireConnectionDemo from "@/registry/dot-ui/blocks/require-connection/demo/require-connection-demo";

export default function RequireConnectionPage() {
  return (
    <RequireConnectionDemo
      Provider={PolkadotProvider}
      RequireConnection={RequireConnection}
      libraryName="polkadot-api (PAPI)"
    />
  );
}
