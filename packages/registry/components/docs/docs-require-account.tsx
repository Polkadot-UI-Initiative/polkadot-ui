"use client";

import { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { RequireAccountWithProvider } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { requireAccountExample as dedotRequireAccountExample } from "../examples/dedot/example-require-account";
import { Loader2, User, UserX } from "lucide-react";

export const requireAccountExamples: ComponentExample[] = [
  dedotRequireAccountExample,
  {
    name: "Require Account - Basic Example",
    description: "Render children only when an account is selected",
    code: "require-account",
    component: (
      <RequireAccountWithProvider
        chainId="paseo"
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserX className="w-4 h-4" />
            <span>Please select an account to continue</span>
          </div>
        }
      >
        <div className="flex items-center gap-2 text-green-600">
          <User className="w-4 h-4" />
          <span>🎉 Account selected! This content is now visible.</span>
        </div>
      </RequireAccountWithProvider>
    ),
    tsx: `import { RequireAccount } from "@/components/require-account.dedot";

function MyComponent() {
  return (
    <RequireAccount
      chainId="paseo"
      fallback={<div>Please select an account to continue</div>}
    >
      <div>🎉 Account selected! This content is now visible.</div>
    </RequireAccount>
  );
}`,
  },
  {
    name: "Require Account - With Loading State",
    description: "Show a loading fallback while resolving accounts",
    code: "require-account",
    component: (
      <RequireAccountWithProvider
        chainId="paseoPeople"
        loadingFallback={
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Resolving accounts...</span>
          </div>
        }
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserX className="w-4 h-4" />
            <span>No account selected</span>
          </div>
        }
      >
        <div className="flex items-center gap-2 text-green-600">
          <User className="w-4 h-4" />
          <span>Account present</span>
        </div>
      </RequireAccountWithProvider>
    ),
    tsx: `<RequireAccount
  chainId="paseoPeople"
  loadingFallback={<div>Resolving accounts...</div>}
  fallback={<div>No account selected</div>}
>
  <PeopleChainFeatures />
</RequireAccount>`,
  },
];

export function RequireAccountDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {requireAccountExamples.map((example) => (
          <ComponentPreview
            key={example.name}
            componentInfo={example}
            withDocs={false}
          />
        ))}
      </div>
    </PolkadotProvider>
  );
}
