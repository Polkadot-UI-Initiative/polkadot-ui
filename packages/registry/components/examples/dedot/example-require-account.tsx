"use client";

import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import type { ComponentExample } from "../types.examples";
import { useTypink } from "typink";

export const requireAccountExample: ComponentExample = {
  name: "Require Account",
  href: "/docs/components/require-account",
  code: "require-account",
  description: "Render children only when an account is selected",
  component: <Component />,
  tsx: `import { RequireAccount } from "@/components/require-account.dedot";
import { paseo } from "typink";

<RequireAccount
  fallback={
    <div>
      Please select an account to continue.
    </div>
  }
>
  <div>You are connected with some account</div>
</RequireAccount>`,
};

function Component() {
  const { connectedAccount } = useTypink();
  return (
    <div className="w-full space-y-3">
      <RequireAccount
        fallback={
          <div className="border border-foreground/10 w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md">
            Please select an account to continue.
          </div>
        }
      >
        <div className="border border-foreground/10 w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md flex-col">
          <div>Account name: {connectedAccount?.name}</div>
          <div>Wallet: {connectedAccount?.source}</div>
        </div>
      </RequireAccount>
    </div>
  );
}
