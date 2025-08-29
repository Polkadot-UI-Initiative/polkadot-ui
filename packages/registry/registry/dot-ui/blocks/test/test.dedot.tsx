"use client";

import {
  ClientConnectionStatus,
  paseoPeople,
  usePolkadotClient,
  useTypink,
} from "typink";

export function WrappedTest() {
  const { connectionStatus } = useTypink();

  return (
    <div>
      {connectionStatus.get(paseoPeople?.id ?? "") ===
      ClientConnectionStatus.Connected ? (
        <Test />
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
}

export function Test() {
  const { status, network } = usePolkadotClient(paseoPeople.id);
  return (
    <div className="flex flex-col gap-2">
      Status: {status} Network: {network?.name}
    </div>
  );
}
