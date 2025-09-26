import {
  InjectedSigner,
  NetworkId,
  NetworkInfo,
  TypinkAccount,
  Wallet,
} from "typink";

// interfaces related to polkadot-ui will be used by papi + dedot
export interface ChainConfig {
  readonly endpoints: string[];
  readonly displayName: string;
  readonly isTestnet: boolean;
  readonly icon?: string;
  readonly explorerUrls?: Partial<
    Record<keyof typeof SubstrateExplorer, string>
  >;
  readonly faucetUrls?: string[];
}

export const SubstrateExplorer = {
  Subscan: "Subscan",
  PolkadotJs: "PolkadotJs",
  PapiExplorer: "PapiExplorer",
} as const;

export enum JsonRpcApi {
  LEGACY = "legacy",
  NEW = "new",
}

// Base interface that both providers share
// TODO: uses the types from typink for now but should be replaced with our own generic types
export interface BasePolkadotContextValue<
  TApi,
  TApis = Partial<Record<NetworkId, TApi>>,
  TNetwork = NetworkInfo,
  TChainId = NetworkId,
  TWallet = Wallet,
  TAccount = TypinkAccount,
  TSigner = InjectedSigner,
> {
  // Current active chain and its API
  currentChain: TNetwork;
  currentChainId: TChainId;
  api: TApi | null;
  isLoading: (chainId: TChainId) => boolean;
  error: string | null;

  // All APIs for all registered chains (type varies by provider)
  apis: TApis;

  // Function to switch active chain (implementation varies by provider)
  setApi: (chainId: TChainId) => void;

  // Connection management (same for both)
  disconnect: () => void;
  isConnected: (chainId: TChainId) => boolean;
  initializeChain: (chainId: TChainId) => Promise<void>;

  // Chain information (same for both)
  chainName: string | null;
  availableChainIds: TChainId[];
  // TODO: remove this once we have a generic type for the chains
  availableChains: TNetwork[];
  // TODO: remove this once we have a generic type for the chains

  /*
   Wallet Connection Values + types
   */
  wallets: TWallet[];
  connectWallet: (walletId: string) => void;
  connectedWalletIds?: string[];
  activeSigner?: TSigner;

  accounts: TAccount[];
  setActiveAccount: (account: TAccount) => void;
  activeAccount?: TAccount;
  defaultCaller: string;
}

export interface PolkadotIdentity {
  display?: string | number;
  legal?: string | number;
  email?: string | number;
  twitter?: string | number;
  github?: string | number;
  discord?: string | number;
  matrix?: string | number; // for papi
  riot?: string | number; // for dedot (legacy)
  web?: string | number;
  image?: string | number;
  verified?: boolean;
}

export interface IdentitySearchResult {
  address: string;
  identity: PolkadotIdentity;
}

export enum ClientConnectionStatus {
  NotConnected = "NotConnected", // not yet connected or disconnected
  Connecting = "Connecting", // initial connecting or reconnecting
  Connected = "Connected",
  Error = "Error",
}

// SDK-agnostic structural types used by base components

export interface NetworkInfoLike<TNetworkId extends string = string> {
  id: TNetworkId;
  name: string;
  logo?: string;
  subscanUrl?: string;
  pjsUrl?: string;
  symbol?: string;
  decimals?: number;
}

export type TxResultLike = {
  status: { type: string };
  txHash?: string;
};

export interface BlockInfoLike {
  number: number;
  hash: string;
}

export interface UseBlockInfoLike {
  best?: BlockInfoLike;
  finalized?: BlockInfoLike;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyFn = (...args: any[]) => any;

export interface TxAdapter<TxFn extends AnyFn = AnyFn> {
  inProgress: boolean;
  inBestBlockProgress?: boolean;
  signAndSend: (opts: {
    args: Parameters<TxFn>;
    callback: (result: TxResultLike) => void;
  }) => Promise<void>;
}

export type ExtractTxFn<TTx> = TTx extends TxAdapter<infer U> ? U : never;

// Interface(s) related to Talisman's chaindata
export interface TokenInfo {
  id: string;
  symbol: string;
  decimals: number;
  name: string;
  assetId: string;
  coingeckoId?: string;
  logo?: string;
}

export interface ChainInfo {
  id: string;
  name: string;
  logo?: string;
  nativeTokenId?: string;
  nativeCurrency?: {
    decimals: number;
    symbol: string;
    name: string;
    coingeckoId?: string;
    logo?: string;
  };
  platform?: string;
  isTestnet?: boolean;
  isDefault?: boolean;
}

export const NATIVE_TOKEN_KEY = -1;
export const NATIVE_TOKEN_ID = "substrate-native";
