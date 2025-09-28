"use client";

import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { useSelectedAccount } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import {
  NATIVE_TOKEN_KEY,
  safeStringify,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  useAssetBalances,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
import { useAssetBalance } from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";

export default function PapiTest() {
  return (
    <div>
      <PolkadotProvider>
        <PapiTestComponent />
      </PolkadotProvider>
    </div>
  );
}
export function PapiTestComponent() {
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
    <div>
      <pre>balance: {safeStringify(balance)}</pre>
      <pre>nativeBalance: {safeStringify(nativeBalance)}</pre>
      <pre>asset1337Balance: {safeStringify(asset1337Balance)}</pre>
      <pre>multipleAssetsBalance: {safeStringify(multipleAssetsBalance)}</pre>
    </div>
  );
}
