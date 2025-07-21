import type { ChainDefinition } from "polkadot-api";

// interfaces related to dot-ui
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

export interface PapiConfig extends ChainConfig {
  readonly descriptor: ChainDefinition;
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

// interfaces related to dedot
export enum SubstrateExplorer {
  Subscan = "subscan",
  PolkadotJs = "polkadot-js",
  PapiExplorer = "papi-explorer",
}

export enum JsonRpcApi {
  LEGACY = "legacy",
  NEW = "new",
}
