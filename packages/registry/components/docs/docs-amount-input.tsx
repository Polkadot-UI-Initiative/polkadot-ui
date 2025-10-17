"use client";

import { amountInputExample } from "@/components/examples/dedot/example-amount-input";
import type { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.dedot";
import { AmountInputBase } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";
import { ConnectWallet } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { useState } from "react";
import { paseoAssetHub } from "typink";

export const amountInputExamples: ComponentExample[] = [
  amountInputExample,
  {
    name: "Amount Input - Controlled",
    href: "/docs/components/amount-input",
    code: "amount-input",
    description:
      "This Amount input is controlled. Open the console to see the value changes.",
    component: <ControlledAmountInput />,
    tsx: `import { AmountInput } from "@/components/amount-input.dedot";

function ControlledAmountInput() {
  const [value, setValue] = useState("");
  <AmountInput
    chainId={paseoAssetHub.id}
    withMaxButton={false}
    value={value}
    onChange={(value) => {
      setValue(value);
      console.log("Value changed:", value);
    }}
  />
}
`,
  },
  {
    name: "Amount Input - With Required Account",
    href: "/docs/components/amount-input",
    code: "amount-input",
    description:
      "This Amount input has the requiredAccount set to true. Try disconnecting the wallet and see the input being disabled. Connect the wallet and see the input being enabled.",
    component: (
      <AmountInput chainId={paseoAssetHub.id} requiredAccount={true} />
    ),
    tsx: `import { AmountInput } from "@/components/amount-input.dedot";

<AmountInput
  chainId={paseoAssetHub.id}
  requiredAccount={true}
/>
`,
  },
  {
    name: "Amount Input - Without Max Button",
    href: "/docs/components/amount-input",
    code: "amount-input",
    description: "This Amount input does not have a Max button",
    component: (
      <AmountInput
        chainId={paseoAssetHub.id}
        assetId={NATIVE_TOKEN_KEY}
        withMaxButton={false}
      />
    ),
    tsx: `import { AmountInput } from "@/components/amount-input.dedot";

<AmountInput
  chainId={paseoAssetHub.id}
  assetId={NATIVE_TOKEN_KEY}
  withMaxButton={false}
/>`,
  },
  {
    name: "Amount Input - Not bound to an asset",
    href: "/docs/components/amount-input",
    code: "amount-input",
    description:
      "This Amount input is not bound to an asset and uses own formatting and icons",
    component: (
      <AmountInput
        chainId={paseoAssetHub.id}
        withMaxButton={false}
        assetId={undefined}
        decimals={8}
        leftIconUrl={paseoAssetHub.logo}
        leftIconAlt={paseoAssetHub.name}
      />
    ),
    tsx: `import { AmountInput } from "@/components/amount-input.dedot";

<AmountInput
  chainId={paseoAssetHub.id}
  assetId={undefined}
  withMaxButton
  decimals={8}
  leftIconUrl={paseoAssetHub.logo}
  leftIconAlt={paseoAssetHub.name}
/>`,
  },
  {
    name: "Amount Input - With custom step",
    href: "/docs/components/amount-input",
    code: "amount-input",
    description: "This Amount Input has the step set to 0.05",
    component: (
      <AmountInput
        chainId={paseoAssetHub.id}
        assetId={NATIVE_TOKEN_KEY}
        withMaxButton={false}
        step={0.05}
      />
    ),
    tsx: `import { AmountInput } from "@/components/amount-input.dedot";

<AmountInput
  chainId={paseoAssetHub.id}
  withMaxButton={false}
  step={0.00001}
/>`,
  },
  {
    name: "Amount Input Base - Manual values",
    href: "/docs/components/amount-input",
    code: "amount-input",
    description:
      "Using the base component directly with manual decimals, max, and icon.",
    component: (
      <AmountInputBase
        decimals={8}
        maxValue={123456789n}
        withMaxButton
        leftIconUrl={paseoAssetHub.logo}
        leftIconAlt={paseoAssetHub.name}
        placeholder="Enter amount"
        className="w-full"
        tokenConversionRate={4.07}
      />
    ),
    tsx: `import { AmountInputBase } from "@/components/amount-input.base";
import { paseoAssetHub } from "typink";

<AmountInputBase
  decimals={8}
  maxValue={123456789n}
  withMaxButton
  leftIconUrl={paseoAssetHub.logo}
  leftIconAlt={paseoAssetHub.name}
  placeholder="Enter amount"
  className="w-full"
  tokenConversionRate={4.07}
/>`,
  },
  // BigInt controlled example is covered by ControlledAmountInput
];

export function ControlledAmountInput() {
  const [value, setValue] = useState<bigint | null>(null);
  return (
    <>
      <AmountInput
        chainId={paseoAssetHub.id}
        withMaxButton={false}
        value={value}
        onChange={(value) => {
          console.log("Value changed:", value);
          setValue(value);
        }}
      />
      <p>Value: {String(value ?? "null")}</p>
    </>
  );
}

export function AmountInputDocs() {
  return (
    <div className="not-prose">
      <PolkadotProvider>
        <ConnectWallet className="mb-4" />
        <div className="flex flex-col gap-4">
          {amountInputExamples.map((example) => (
            <ComponentPreview
              ComponentWrapper={<div className="md:w-[400px]"></div>}
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

// Removed separate PlanckExample; base AmountInput handles bigint now
