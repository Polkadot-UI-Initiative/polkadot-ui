"use client";

import { useAssetBalances } from "@/registry/polkadot-ui/hooks/use-asset-balance.dedot";
import { safeStringify } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { polkadotAssetHub, useTypink } from "typink";

export function HooksTest() {
  const { connectedAccount } = useTypink();
  const assets = useAssetBalances({
    chainId: polkadotAssetHub.id,
    address: connectedAccount?.address ?? "",
    assetIds: [-1, 1337, 7777],
  });
  console.log(assets);
  return (
    <div>
      <pre>{safeStringify(assets)}</pre>
    </div>
  );
}
