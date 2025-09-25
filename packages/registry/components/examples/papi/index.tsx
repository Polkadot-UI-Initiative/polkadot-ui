import type { ComponentExample } from "../types.examples";
import { addressInputExample } from "./example-address-input";
import { txButtonExample } from "./example-tx-button";
import { requireConnectionExample } from "./example-require-connection";
import { requireAccountExample } from "./example-require-account";
import { connectWalletExample } from "./example-connect-wallet";
import { amountInputExample } from "./example-amount-input";
import { selectTokenExample } from "./example-select-token";
import { selectTokenDialogExample } from "./example-select-token-dialog";
import { transactionDetailsExample } from "./example-transaction-details";
import { networkIndicatorExample } from "./example-network-indicator";
import { balanceDisplayExample } from "./example-balance-display";
import { accountInfoExample } from "./example-account-info";
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
