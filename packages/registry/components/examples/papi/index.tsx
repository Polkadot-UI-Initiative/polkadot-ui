import type { ComponentExample } from "../types.examples";
import { addressInputExample } from "./example-address-input";
import { txButtonExample } from "./example-tx-button";
import { requireConnectionExample } from "./example-require-connection";
import { requireAccountExample } from "./example-require-account";
import { connectWalletExample } from "./example-connect-wallet";
import { amountInputExample } from "./example-amount-input";
import { selectTokenExample } from "./example-select-token";
// import { selectTokenDialogExample } from "./example-select-token-dialog";
import { transactionDetailsExample } from "./example-transaction-details";
import { networkIndicatorExample } from "./example-network-indicator";
import { balanceDisplayExample } from "./example-balance-display";
// import { nftCardExample } from "./example-nft-card";
import DedotDemo from "@/registry/polkadot-ui/blocks/dedot-demo/dedot-demo";
import { accountInfoExample } from "./example-account-info";

export const demoExample: ComponentExample = {
  name: "Dedot Demo",
  href: "/docs/components/dedot-demo",
  code: "dedot-demo",
  description: "A demo component for dedot.",
  component: <DedotDemo />,
};

export const examples: ComponentExample[] = [
  // Order mirrors dedot examples
  connectWalletExample,
  txButtonExample,
  addressInputExample,
  accountInfoExample,
  networkIndicatorExample,
  amountInputExample,
  selectTokenExample,
  // selectTokenDialogExample,
  requireConnectionExample,
  requireAccountExample,
  transactionDetailsExample,
  balanceDisplayExample,
  // nftCardExample,
];
