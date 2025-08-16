import { PaseoApi, PaseoPeopleApi } from "@dedot/chaintypes";
import { DedotClient } from "dedot";
import {
  InjectedSigner,
  NetworkId,
  TypinkAccount,
  useTypink,
  Wallet,
} from "typink";
import { supportedChains } from "../lib/config.dedot";

// Supported chain id type derived from the configured supported networks
export type SupportedChainId = (typeof supportedChains)[number]["id"];

// Map from network IDs to their corresponding chain APIs
interface ChainApiKindMap {
  paseo: PaseoApi;
  pop_testnet: PaseoApi; // POP Network uses Paseo-compatible API
  paseoPeople: PaseoPeopleApi;
  // polkadot: PolkadotApi;
}

type KnownTypedChainId = keyof ChainApiKindMap & SupportedChainId;

export type ChainApiType<T extends NetworkId> = T extends KnownTypedChainId
  ? ChainApiKindMap[T]
  : AnyChainApi; // Fallback to generic API for unknown/test ids

export type AnyChainApi = ChainApiKindMap[keyof ChainApiKindMap];

export type ConfiguredChainApi<T extends NetworkId = NetworkId> = DedotClient<
  ChainApiType<T>
>;

export type CompositeApi = {
  [K in SupportedChainId]: ConfiguredChainApi<K>;
};

export interface AccountManagementHookProps {
  accounts: TypinkAccount[];
  setActiveAccount: (account: TypinkAccount) => void;
  activeAccount?: TypinkAccount;
}

export interface WalletManagementHookProps {
  wallets: Wallet[];
  connectWallet: (walletId: string) => void;
  disconnect: () => void;
  connectedWalletId?: string;
  activeSigner?: InjectedSigner;
}

export interface ClientHookProps {
  client: ReturnType<typeof useTypink>["client"] | undefined;
}
