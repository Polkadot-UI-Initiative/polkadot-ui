import type { ComponentExample } from "../types.examples";
import { walletSelectExample } from "./example-wallet-select";
import { addressInputExample } from "./example-address-input";
import { txButtonExample } from "./example-tx-button";
import { requireConnectionExample } from "./example-require-connection";
import { requireAccountExample } from "./example-require-account";
import { networkIndicatorExample } from "./example-network-indicator";
import { amountInputExample } from "./example-amount-input";
import { selectTokenExample } from "./example-select-token";
import { transactionDetailsExample } from "./example-transaction-details";

import { balanceDisplayExample } from "./example-balance-display";
import { nftCardExample } from "./example-nft-card";
import DedotDemo from "@/registry/polkadot-ui/blocks/dedot-demo/dedot-demo";

export const demoExample: ComponentExample = {
  name: "Dedot Demo",
  href: "/docs/components/dedot-demo",
  code: "dedot-demo",
  description: "A demo component for dedot.",
  component: <DedotDemo />,
};

export const examples: ComponentExample[] = [
  // demoExample,
  walletSelectExample,
  txButtonExample,
  addressInputExample,
  requireConnectionExample,
  requireAccountExample,
  networkIndicatorExample,
  amountInputExample,
  selectTokenExample,
  transactionDetailsExample,
  balanceDisplayExample,
  nftCardExample,
];
