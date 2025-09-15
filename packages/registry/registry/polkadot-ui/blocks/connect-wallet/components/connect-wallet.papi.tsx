"use client";
import {
  WalletSelectBase,
  type WalletSelectBaseProps,
} from "@/registry/polkadot-ui/blocks/connect-wallet/components/connect-wallet.base";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { useMemo, useCallback, Suspense, useEffect } from "react";
import { usePolkadotExtension } from "@/registry/polkadot-ui/lib/polkadot-extension-provider.papi";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";

export type WalletSelectProps = Omit<WalletSelectBaseProps, "services">;

export function WalletSelect() {
  const {
    selectedAccount,
    setSelectedAccount,
    selectedExtensions,
    availableExtensions,
    onToggleExtension,
  } = usePolkadotExtension();

  useEffect(() => {
    availableExtensions.forEach((extension) => {
      onToggleExtension(extension);
    });
  }, []);

  return <pre>{JSON.stringify(selectedExtensions, null, 2)}</pre>;
}
