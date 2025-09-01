"use client";

import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { type RequireAccountBaseProps } from "@/registry/dot-ui/blocks/require-account/components/require-account.base";

export type RequireAccountProps = Omit<RequireAccountBaseProps, "services">;

export function RequireAccount() {
  return <>not implemented</>;
}

export function RequireAccountWithProvider() {
  return (
    <PolkadotProvider>
      <RequireAccount />
    </PolkadotProvider>
  );
}

RequireAccountWithProvider.displayName = "RequireAccountWithProvider";
