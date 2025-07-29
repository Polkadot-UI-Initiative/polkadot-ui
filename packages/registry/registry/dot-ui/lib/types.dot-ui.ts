import type { UseQueryResult } from "@tanstack/react-query";

// interfaces related to dot-ui will be used by papi + dedot
export interface ChainConfig {
  readonly endpoints: string[];
  readonly displayName: string;
  readonly isTestnet: boolean;
  readonly icon?: string;
  readonly explorerUrls?: Partial<Record<SubstrateExplorer, string>>;
  readonly faucetUrls?: string[];
}

export interface DotUiConfig {
  readonly chains: Record<string, ChainConfig>;
  readonly defaultChain: string;
}

export interface PolkadotConfig<
  TChains extends Readonly<Record<string, ChainConfig>> = Readonly<
    Record<string, ChainConfig>
  >,
> {
  readonly chains: TChains;
  readonly defaultChain: keyof TChains;
}

export function definePolkadotConfig<
  const TChains extends Readonly<Record<string, ChainConfig>>,
>(config: PolkadotConfig<TChains>) {
  return config;
}

export enum SubstrateExplorer {
  Subscan = "subscan",
  PolkadotJs = "polkadot-js",
  PapiExplorer = "papi-explorer",
}

export enum JsonRpcApi {
  LEGACY = "legacy",
  NEW = "new",
}

export enum supportedLibraries {
  Papi = "papi",
  Dedot = "dedot",
}

// Unified identity types for hooks
export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  verified: boolean;
}

export interface FormattedIdentity {
  display?: string;
  email?: string;
  legal?: string;
  matrix?: string;
  twitter?: string;
  web?: string;
  verified?: boolean;
}

export interface IdentitySearchResult {
  address: string;
  identity: FormattedIdentity;
}

// Provider hook interface
export interface ProviderHookInterface {
  isLoading: (chain: string) => boolean;
  currentChain: string;
  isConnected: (chain: string) => boolean;
}

export interface IdentityResult {
  type: "polkadot" | "ens";
  data: {
    display?: string;
    legal?: string;
    email?: string;
    twitter?: string;
    verified?: boolean;
  };
}

// Identity hook interfaces
export interface IdentityHookInterface {
  usePolkadotIdentity: (
    address: string,
    identityChain?: string
  ) => UseQueryResult<PolkadotIdentity | null, Error>;
  useIdentityByDisplayName: (
    displayName: string | null | undefined,
    identityChain?: string
  ) => UseQueryResult<IdentitySearchResult[], Error>;
  useProvider: () => ProviderHookInterface;
}
