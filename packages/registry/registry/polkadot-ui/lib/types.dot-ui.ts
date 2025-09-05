import type { ReactNode } from "react";
import { type ChainId } from "@/registry/polkadot-ui/lib/config.dot-ui";
import {
  InjectedSigner,
  NetworkId,
  NetworkInfo,
  TypinkAccount,
  Wallet,
} from "typink";

// interfaces related to dot-ui will be used by papi + dedot
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

// Base config chain type (used by base config and helpers)
export interface BaseChainConfig extends ChainConfig {}

export interface DotUiConfig {
  readonly chains: Record<string, ChainConfig>;
  readonly defaultChain: ChainId;
}

export interface PolkadotConfig<
  TChains extends Readonly<Record<ChainId, ChainConfig>> = Readonly<
    Record<string, ChainConfig>
  >,
> {
  readonly chains: TChains;
  readonly defaultChain: keyof TChains;
}

export function definePolkadotConfig<
  TChains extends Readonly<Record<ChainId, ChainConfig>>,
>(config: PolkadotConfig<TChains>) {
  return config;
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

// Common provider props interface
export interface BasePolkadotProviderProps<TChainId = ChainId> {
  children: ReactNode;
  defaultChain?: TChainId;
  availableChains?: NetworkInfo[];
}

// Common hook interface for getting specific chain APIs
export interface BasePolkadotHooks<TApi, TChainId = ChainId> {
  useTypedPolkadotApi: () => TApi | null;
  usePolkadotApi: (chainId: TChainId) => TApi | null;
}

export interface FormattedIdentity {
  display?: string;
  email?: string;
  legal?: string;
  matrix?: string; // for papi
  riot?: string; // for dedot
  twitter?: string;
  web?: string;
  verified?: boolean;
}

export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  verified: boolean;
}

export interface IdentitySearchResult {
  address: string;
  identity: FormattedIdentity;
}

export enum ClientConnectionStatus {
  NotConnected = "NotConnected", // not yet connected or disconnected
  Connecting = "Connecting", // initial connecting or reconnecting
  Connected = "Connected",
  Error = "Error",
}

// SDK-agnostic structural types used by base components

export interface NetworkInfoLike {
  name: string;
  logo?: string;
  subscanUrl?: string;
  pjsUrl?: string;
}

export type TxResultLike = {
  status: { type: string };
  txHash?: string;
};

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
