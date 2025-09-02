// import { AddressInput } from "@/registry/dot-ui/blocks/address-input/components/address-input.dedot";
// import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
// import { ClientComponent } from "@/app/components/client-components";
// import { Suspense } from "react";

import { RequireConnection } from "@/registry/polkadot-ui/blocks/require-connection/components/require-connection.dedot";
import RequireConnectionDemo from "@/registry/polkadot-ui/blocks/require-connection/demo/require-connection-demo";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/dedot-provider";

export default async function Components() {
  return (
    <RequireConnectionDemo
      Provider={PolkadotProvider}
      RequireConnection={RequireConnection}
      libraryName="Dedot"
    />
  );
}
