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

export const JsonRpcApi = {
  LEGACY: "legacy",
  NEW: "new",
} as const;
export type JsonRpcApi = (typeof JsonRpcApi)[keyof typeof JsonRpcApi];

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

export const ClientConnectionStatus = {
  NotConnected: "NotConnected", // not yet connected or disconnected
  Connecting: "Connecting", // initial connecting or reconnecting
  Connected: "Connected",
  Error: "Error",
} as const;
export type ClientConnectionStatus =
  (typeof ClientConnectionStatus)[keyof typeof ClientConnectionStatus];

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
