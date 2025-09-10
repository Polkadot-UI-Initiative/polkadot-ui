import type { ComponentExample } from "../types.examples";
import { addressInputExample } from "./example-address-input";
import { requireConnectionExample } from "./example-require-connection";
import { requireAccountExample } from "./example-require-account";
import { walletSelectExample } from "./example-wallet-select";
import { amountInputExample } from "./example-amount-input";
import { selectTokenExample } from "./example-select-token";
import { transactionDetailsExample } from "./example-transaction-details";
import { networkIndicatorExample } from "./example-network-indicator";
import { balanceDisplayExample } from "./example-balance-display";
import { nftCardExample } from "./example-nft-card";
import { txButtonExample } from "./example-tx-button";

export const examples: ComponentExample[] = [
  txButtonExample,
  walletSelectExample,
  addressInputExample,
  requireConnectionExample,
  requireAccountExample,
  amountInputExample,
  selectTokenExample,
  transactionDetailsExample,
  networkIndicatorExample,
  balanceDisplayExample,
  nftCardExample,
];
