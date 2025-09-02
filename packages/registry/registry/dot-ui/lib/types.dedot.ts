import { PaseoApi, PaseoPeopleApi } from "@dedot/chaintypes";
import { DedotClient } from "dedot";
import type { ISubmittableExtrinsic, ISubmittableResult } from "dedot/types";
import { UseTxReturnType, useTypink } from "typink";
import { type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { TxButtonBaseProps } from "../blocks/tx-button/components/tx-button.base";

// Map from network IDs to their corresponding chain APIs
interface ChainApiKindMap {
  paseo: PaseoApi;
  paseo_people: PaseoPeopleApi;
}

export type ChainApiType<T extends ChainId> = ChainApiKindMap[T];

export type AnyChainApi = ChainApiKindMap[keyof ChainApiKindMap];

export type ConfiguredChainApi<T extends ChainId = ChainId> = DedotClient<
  ChainApiType<T>
>;

export type ConfiguredAnyChainApi = DedotClient<AnyChainApi>;

export type CompositeApi = {
  [K in ChainId]: ConfiguredChainApi<K>;
};

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
