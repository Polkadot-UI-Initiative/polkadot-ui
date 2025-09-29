import type { ISubmittableExtrinsic, ISubmittableResult } from "dedot/types";
import { type UseTxReturnType, useTypink } from "typink";
import { type TxButtonBaseProps } from "../blocks/tx-button/components/tx-button.base";

export interface AccountManagementHookProps {
  accounts: import("typink").TypinkAccount[];
  setActiveAccount: (account: import("typink").TypinkAccount) => void;
  activeAccount?: import("typink").TypinkAccount;
}

export interface WalletManagementHookProps {
  wallets: import("typink").Wallet[];
  connectWallet: (walletId: string) => void;
  disconnect: () => void;
  connectedWalletId?: string;
  activeSigner?: import("typink").InjectedSigner;
}

export interface ClientHookProps {
  client: ReturnType<typeof useTypink>["client"] | undefined;
}

export type AnyTxFn = (
  ...args: unknown[]
) => ISubmittableExtrinsic<ISubmittableResult>;
export type AnyUseTx = UseTxReturnType<AnyTxFn>;

export type TxButtonProps<TTx extends AnyUseTx = AnyUseTx> = Omit<
  TxButtonBaseProps<TTx>,
  "services"
>;

export type ExtractUseTxFn<T> = T extends UseTxReturnType<infer U> ? U : never;
