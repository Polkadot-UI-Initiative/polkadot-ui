import { type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { PaseoApi, PaseoPeopleApi } from "@dedot/chaintypes";
import { DedotClient, WsProvider } from "dedot";
import { InjectedAccount, InjectedSigner, useTypink, Wallet } from "typink";

// Dedot relies on ChainApi in the form of interfaces
// to generate the types and APIs suggestions,
// so we can simply add more chains below:
// 1. import { PolkadotApi } from "@dedot/chaintypes";
// 2. add the chain to the type below
export type ChainApiMap = {
  paseo: PaseoApi;
  paseo_people: PaseoPeopleApi;
  // polkadot: PolkadotApi;
};

export type ChainApiType<T extends ChainId> = T extends keyof ChainApiMap
  ? ChainApiMap[T]
  : never;

export type AnyChainApi = ChainApiMap[keyof ChainApiMap];

export type ConfiguredChainApi = DedotClient<AnyChainApi>;

export type CompositeApi = {
  [K in ChainId]: DedotClient<ChainApiType<K>>;
};

export async function createTypedClient<T extends ChainId>(
  chainId: T,
  provider: WsProvider
): Promise<DedotClient<ChainApiType<T>>> {
  const client = await DedotClient.new<ChainApiType<T>>({
    provider,
    cacheMetadata: true,
  });
  return client;
}

export interface AccountManagementHookProps {
  accounts: InjectedAccount[];
  setActiveAccount: (account: InjectedAccount) => void;
  activeAccount?: InjectedAccount;
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