import type { ComponentExample } from "@/components/examples/types.examples";
import { addressInputExample } from "./example-address-input";
import { amountInputExample } from "./example-amount-input";
import { networkIndicatorExample } from "./example-network-indicator";
import { requireAccountExample } from "./example-require-account";
import { requireConnectionExample } from "./example-require-connection";
import { selectTokenExample } from "./example-select-token";
import { selectTokenDialogExample } from "./example-select-token-dialog";
import { transactionDetailsExample } from "./example-transaction-details";
import { txButtonExample } from "./example-tx-button";
import { connectWalletExample } from "./examlpe-connect-wallet";
import { accountInfoExample } from "./example-account-info";
import { balanceDisplayExample } from "./example-balance-display";
// import { nftCardExample } from "./example-nft-card";

export const examples: ComponentExample[] = [
  connectWalletExample,
  txButtonExample,
  addressInputExample,
  accountInfoExample,
  networkIndicatorExample,
  amountInputExample,
  selectTokenExample,
  selectTokenDialogExample,
  requireConnectionExample,
  requireAccountExample,
  transactionDetailsExample,
  balanceDisplayExample,
  // nftCardExample,
];
