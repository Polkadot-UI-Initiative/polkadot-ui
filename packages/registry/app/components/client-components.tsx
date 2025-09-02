"use client";

import { usePolkadotApi } from "../../registry/polkadot-ui/providers/papi-provider";
import { usePapi } from "../../registry/polkadot-ui/providers/papi-provider";
import { RequireConnection } from "../../registry/polkadot-ui/blocks/require-connection/components/require-connection.papi";

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
