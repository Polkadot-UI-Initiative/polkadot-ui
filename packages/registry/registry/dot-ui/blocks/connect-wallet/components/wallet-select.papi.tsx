"use client";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";
import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { type WalletSelectBaseProps } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select.base";

export type WalletSelectProps = Omit<WalletSelectBaseProps, "services">;

export function WalletSelect() {
  return <ClientOnly>Not yet implemented</ClientOnly>;
}

export function WalletSelectWithProvider(props: WalletSelectProps) {
  return (
    <PolkadotProvider>
      <WalletSelect {...props} />
    </PolkadotProvider>
  );
}
