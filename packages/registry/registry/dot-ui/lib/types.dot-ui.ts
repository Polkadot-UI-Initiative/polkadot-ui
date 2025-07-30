import { type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";

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
  readonly defaultChain: ChainId;
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

// Base interface that both providers share
export interface BasePolkadotContextValue<TApi, TApis, TChainId = string> {
  // Current active chain and its API
  currentChain: TChainId;
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
  availableChains: TChainId[];
}

// Common provider props interface
export interface BasePolkadotProviderProps<TChainId = string> {
  children: React.ReactNode;
  defaultChain?: TChainId;
}

// Common hook interface for getting specific chain APIs
export interface BasePolkadotHooks<TApi, TChainId = string> {
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
