"use client";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { PolkadotProvider } from "@/registry/polkadot-ui/providers/papi-provider";
import { type WalletSelectBaseProps } from "@/registry/polkadot-ui/blocks/connect-wallet/components/wallet-select.base";
import { Badge } from "@/components/ui/badge";

export type WalletSelectProps = Omit<WalletSelectBaseProps, "services">;

export function WalletSelect() {
  return (
    <ClientOnly>
      <Badge variant="destructive">
        papi wallet select not yet implemented
      </Badge>
    </ClientOnly>
  );
}

export function WalletSelectWithProvider(props: WalletSelectProps) {
  return (
    <PolkadotProvider>
      <WalletSelect {...props} />
    </PolkadotProvider>
  );
}
