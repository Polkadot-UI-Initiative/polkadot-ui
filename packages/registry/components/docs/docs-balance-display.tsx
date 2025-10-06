"use client";

import { balanceDisplayExample } from "@/components/examples/dedot/example-balance-display";
import { ComponentPreview } from "@/components/layout/component-preview";
import { BalanceDisplay } from "@/registry/polkadot-ui/blocks/balance-display/balance-display.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { polkadotAssetHub } from "typink";
import type { ComponentExample } from "../examples/types.examples";

export const balanceDisplayExamples: ComponentExample[] = [
  balanceDisplayExample,
  {
    name: "Balance Display - Custom Thousands Separator and Decimal Separator ",
    code: "balance-display-custom-thousands-separator",
    description:
      "Formatted Polkadot USDT treasury balance with custom thousands and decimal separator",
    component: (
      <BalanceDisplay
        networkId={polkadotAssetHub.id}
        tokenId={1984}
        accountAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
        thousandsSeparator=""
        decimalSeparator=","
      />
    ),
    tsx: `import { BalanceDisplay } from "@/registry/polkadot-ui/blocks/balance-display/balance-display.dedot";
import { polkadotAssetHub } from "typink";

<BalanceDisplay
  networkId={polkadotAssetHub.id}
  tokenId={1984}
  accountAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
  thousandsSeparator=""
  decimalSeparator=","
/>`,
  },
  {
    name: "Balance Display - Compare Token",
    code: "balance-display-compare-token",
    description:
      "With compare token. Use any other token as compare token and pass the conversion rate.",
    component: (
      <BalanceDisplay
        networkId={polkadotAssetHub.id}
        tokenId={1984} //USDT
        accountAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
        thousandsSeparator=""
        decimalSeparator=","
        compareTokenId={1337} //USDC
        tokenConversionRate={1} //1 USDC = 1 USDT
      />
    ),
    tsx: `import { BalanceDisplay } from "@/registry/polkadot-ui/blocks/balance-display/balance-display.dedot";
import { polkadotAssetHub } from "typink";

<BalanceDisplay
  networkId={polkadotAssetHub.id}
  tokenId={1984}
  accountAddress="14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
  thousandsSeparator=""
  decimalSeparator=","
  compareTokenId={1337}
  tokenConversionRate={1}
/>`,
  },
];

export function BalanceDisplayDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {balanceDisplayExamples.map((example) => (
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
