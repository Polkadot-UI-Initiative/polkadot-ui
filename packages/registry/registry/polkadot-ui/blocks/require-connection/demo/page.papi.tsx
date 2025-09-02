import { PolkadotProvider } from "@/registry/polkadot-ui/providers/papi-provider";
import { RequireConnection } from "@/registry/polkadot-ui/blocks/require-connection/components/require-connection.papi";
import RequireConnectionDemo from "@/registry/polkadot-ui/blocks/require-connection/demo/require-connection-demo";

export default function RequireConnectionPage() {
  return (
    <RequireConnectionDemo
      Provider={PolkadotProvider}
      RequireConnection={RequireConnection}
      libraryName="polkadot-api (PAPI)"
    />
  );
}
