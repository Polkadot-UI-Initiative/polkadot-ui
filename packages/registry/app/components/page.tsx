"use client";

import { AddressInput } from "@/registry/dot-ui/blocks/address-input/components/address-input.dedot";
import { RequireConnection } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.papi";
import { usePolkadotApi } from "../../registry/dot-ui/providers/papi-provider";
import {
  PolkadotProvider,
  usePapi,
} from "@/registry/dot-ui/providers/papi-provider";

export default function Components() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-2 max-w-md mx-auto py-12">
        <ClientComponent />
        <AddressInput />
      </div>
    </PolkadotProvider>
  );
}

export function ClientComponent() {
  const api = usePolkadotApi("paseo_people");
  const { isConnected } = usePapi();
  console.log("api", api);
  console.log("isConnected", isConnected);
  return (
    <div>
      is paseo_people connected:{" "}
      {isConnected("paseo_people") ? "true" : "false"}
      <RequireConnection
        chainId="paseo_people"
        fallback={<div>Not connected</div>}
      >
        <div>ClientComponent, {"paseo_people"} </div>
      </RequireConnection>
    </div>
  );
}
