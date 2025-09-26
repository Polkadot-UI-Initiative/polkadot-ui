"use client";

import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { paseoAssetHub } from "typink";

export const amountInputExamples: ComponentExample[] = [
  {
    name: "Amount Input - Multiple Tokens with Selector",
    code: "amount-input",
    description:
      "Amount input with token selector for multiple tokens including native token",
    component: (
      <RequireAccount
        chainId={paseoAssetHub.id}
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue with amount input.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="amount-multi">Multiple Tokens (with selector)</Label>
          <AmountInput
            id="amount-multi"
            withTokenSelector
            chainId={paseoAssetHub.id}
            assetIds={[1984, 1337, 7777]}
            className="w-full"
            showMaxButton
            showAvailableBalance
            placeholder="Enter an amount"
          />
        </div>
      </RequireAccount>
    ),
    tsx: `import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { paseoAssetHub } from "typink";

<RequireAccount chainId={paseoAssetHub.id}>
  <div className="flex flex-col gap-2 w-full">
    <Label htmlFor="amount-multi">
      Multiple Tokens (with selector)
    </Label>
    <AmountInput
      id="amount-multi"
      withTokenSelector
      chainId={paseoAssetHub.id}
      assetIds={[1984, 1337, 7777]}
      className="w-full"
      showMaxButton
      showAvailableBalance
      placeholder="Enter an amount"
    />
  </div>
</RequireAccount>`,
  },
  {
    name: "Amount Input - Single Token Fixed Display",
    code: "amount-input",
    description:
      "Amount input with single token showing fixed display with symbol",
    component: (
      <RequireAccount
        chainId={paseoAssetHub.id}
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue with amount input.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="amount-single">
            Single Token (fixed display with symbol)
          </Label>
          <AmountInput
            id="amount-single"
            withTokenSelector
            chainId={paseoAssetHub.id}
            assetIds={[1984]} // Single token
            className="w-full"
            showMaxButton
            showAvailableBalance
            includeNative={false}
            placeholder="Enter DOT amount"
          />
        </div>
      </RequireAccount>
    ),
    tsx: `import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { paseoAssetHub } from "typink";

<RequireAccount chainId={paseoAssetHub.id}>
  <div className="flex flex-col gap-2 w-full">
    <Label htmlFor="amount-single">
      Single Token (fixed display with symbol)
    </Label>
    <AmountInput
      id="amount-single"
      withTokenSelector
      chainId={paseoAssetHub.id}
      assetIds={[1984]} // Single token
      className="w-full"
      showMaxButton
      showAvailableBalance
      includeNative={false}
      placeholder="Enter DOT amount"
    />
  </div>
</RequireAccount>`,
  },
  {
    name: "Amount Input - Simple Native Token",
    code: "amount-input",
    description: "Simple amount input for native token without token selector",
    component: (
      <RequireAccount
        chainId={paseoAssetHub.id}
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue with amount input.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="amount-simple">Simple Input (native token)</Label>
          <AmountInput
            id="amount-simple"
            chainId={paseoAssetHub.id}
            className="w-full"
            showMaxButton
            showAvailableBalance
            placeholder="Enter native token amount"
          />
        </div>
      </RequireAccount>
    ),
    tsx: `import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { paseoAssetHub } from "typink";

<RequireAccount chainId={paseoAssetHub.id}>
  <div className="flex flex-col gap-2 w-full">
    <Label htmlFor="amount-simple">Simple Input (native token)</Label>
    <AmountInput
      id="amount-simple"
      chainId={paseoAssetHub.id}
      className="w-full"
      showMaxButton
      showAvailableBalance
      placeholder="Enter native token amount"
    />
  </div>
</RequireAccount>`,
  },
  {
    name: "Amount Input - Without Balance Display",
    code: "amount-input",
    description: "Amount input without showing available balance",
    component: (
      <RequireAccount
        chainId={paseoAssetHub.id}
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue with amount input.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="amount-no-balance">Without Balance Display</Label>
          <AmountInput
            id="amount-no-balance"
            withTokenSelector
            chainId={paseoAssetHub.id}
            assetIds={[1984, 1337, 7777]}
            className="w-full"
            showMaxButton
            showAvailableBalance={false}
            placeholder="Enter an amount"
          />
        </div>
      </RequireAccount>
    ),
    tsx: `import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { paseoAssetHub } from "typink";

<RequireAccount chainId={paseoAssetHub.id}>
  <div className="flex flex-col gap-2 w-full">
    <Label htmlFor="amount-no-balance">Without Balance Display</Label>
    <AmountInput
      id="amount-no-balance"
      withTokenSelector
      chainId={paseoAssetHub.id}
      assetIds={[1984, 1337, 7777]}
      className="w-full"
      showMaxButton
      showAvailableBalance={false}
      placeholder="Enter an amount"
    />
  </div>
</RequireAccount>`,
  },
  {
    name: "Amount Input - Without Max Button",
    code: "amount-input",
    description: "Amount input without the MAX button",
    component: (
      <RequireAccount
        chainId={paseoAssetHub.id}
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue with amount input.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="amount-no-max">Without Max Button</Label>
          <AmountInput
            id="amount-no-max"
            withTokenSelector
            chainId={paseoAssetHub.id}
            assetIds={[1984, 1337, 7777]}
            className="w-full"
            showMaxButton={false}
            showAvailableBalance
            placeholder="Enter an amount"
          />
        </div>
      </RequireAccount>
    ),
    tsx: `import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { paseoAssetHub } from "typink";

<RequireAccount chainId={paseoAssetHub.id}>
  <div className="flex flex-col gap-2 w-full">
    <Label htmlFor="amount-no-max">Without Max Button</Label>
    <AmountInput
      id="amount-no-max"
      withTokenSelector
      chainId={paseoAssetHub.id}
      assetIds={[1984, 1337, 7777]}
      className="w-full"
      showMaxButton={false}
      showAvailableBalance
      placeholder="Enter an amount"
    />
  </div>
</RequireAccount>`,
  },
];

export function AmountInputDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {amountInputExamples.map((example) => (
          <ComponentPreview
            ComponentWrapper={<div className="w-full max-w-md"></div>}
            key={example.name}
            componentInfo={example}
            withDocs={false}
          />
        ))}
      </div>
    </PolkadotProvider>
  );
}
