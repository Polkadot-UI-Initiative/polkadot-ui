"use client";

import { RequireConnectionWithProvider } from "@/registry/polkadot-ui/blocks/require-connection/require-connection.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { requireConnectionExample as dedotRequireConnectionExample } from "../examples/dedot/example-require-connection";
import type { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";

export const requireConnectionExamples: ComponentExample[] = [
  dedotRequireConnectionExample,
  {
    name: "Require Connection - Basic Example",
    description: "Render content when connected to the target chain",
    code: "require-connection",
    component: (
      <RequireConnectionWithProvider
        chainId="paseo"
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <WifiOff className="w-4 h-4" />
            <span>Please connect to Paseo to continue</span>
          </div>
        }
      >
        <div className="flex items-center gap-2 text-green-600">
          <Wifi className="w-4 h-4" />
          <span>🎉 Connected to Paseo! This content is now visible.</span>
        </div>
      </RequireConnectionWithProvider>
    ),
    tsx: `import { RequireConnection } from "@/components/require-connection.dedot";

function MyComponent() {
  return (
    <RequireConnection
      chainId="paseo"
      fallback={<div>Please connect to Paseo to continue</div>}
    >
      <div>🎉 Connected to Paseo! This content is now visible.</div>
    </RequireConnection>
  );
}`,
  },
  {
    name: "Require Connection - With Loading State",
    description: "Show a loading fallback while connecting",
    code: "require-connection",
    component: (
      <RequireConnectionWithProvider
        chainId="paseo"
        loadingFallback={
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting to Paseo...</span>
          </div>
        }
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <WifiOff className="w-4 h-4" />
            <span>Failed to connect to Paseo</span>
          </div>
        }
      >
        <div className="flex items-center gap-2 text-green-600">
          <Wifi className="w-4 h-4" />
          <span>Connected to Paseo</span>
        </div>
      </RequireConnectionWithProvider>
    ),
    tsx: `<RequireConnection
  chainId="paseo"
  loadingFallback={<div>Connecting to Paseo...</div>}
  fallback={<div>Failed to connect to Paseo</div>}
>
  <PeopleChainFeatures />
</RequireConnection>`,
  },
  {
    name: "Require Connection - Protecting Transaction UI",
    description: "Gate transaction interfaces behind connection status",
    code: "require-connection",
    component: (
      <RequireConnectionWithProvider
        chainId="paseo"
        fallback={
          <div className="flex items-center gap-2 text-muted-foreground">
            <WifiOff className="w-4 h-4" />
            <span>Please connect to Paseo to submit transactions</span>
          </div>
        }
      >
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Transaction Form</h3>
          <p className="text-sm text-muted-foreground">
            Transaction interface is available when connected.
          </p>
        </div>
      </RequireConnectionWithProvider>
    ),
    tsx: `<RequireConnection
  chainId="paseo"
  fallback={
    <div className="flex items-center gap-2 text-muted-foreground">
      <WifiOff className="w-4 h-4" />
      <span>Please connect to Paseo to submit transactions</span>
    </div>
  }
>
  <TransactionForm />
</RequireConnection>`,
  },
];

export function RequireConnectionDocs() {
  return (
    <div className="not-prose">
      <PolkadotProvider>
        <div className="flex flex-col gap-4">
          {requireConnectionExamples.map((example) => (
            <ComponentPreview
              key={example.name}
              componentInfo={example}
              withDocs={false}
            />
          ))}
        </div>
      </PolkadotProvider>
    </div>
  );
}
