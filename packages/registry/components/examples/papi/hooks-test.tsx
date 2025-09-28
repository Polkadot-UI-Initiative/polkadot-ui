"use client";

import {
  useAssetBalance,
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
import { useSelectedAccount } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

// import { useAssetBalances } from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
// import { useSelectedAccount } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import {
  NATIVE_TOKEN_KEY,
  safeStringify,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";

export function HooksTest() {
  const { selectedAccount } = useSelectedAccount();
  const balance = useNativeBalance({
    chainId: "polkadotAssetHub",
    address: selectedAccount?.address,
  });

  const nativeBalance = useAssetBalance({
    chainId: "polkadotAssetHub",
    assetId: NATIVE_TOKEN_KEY,
    address: selectedAccount?.address,
  });

  const asset1337Balance = useAssetBalance({
    chainId: "polkadotAssetHub",
    assetId: 1337,
    address: selectedAccount?.address,
  });

  const multipleAssetsBalance = useAssetBalances({
    chainId: "polkadotAssetHub",
    assetIds: [1337, -1],
    address: selectedAccount?.address,
  });

  return (
    <div className="text-xs">
      <pre>balance: {safeStringify(balance)}</pre>
      <pre>nativeBalance: {safeStringify(nativeBalance)}</pre>
      <pre>asset1337Balance: {safeStringify(asset1337Balance)}</pre>
      <pre>multipleAssetsBalance: {safeStringify(multipleAssetsBalance)}</pre>
    </div>
  );
}
