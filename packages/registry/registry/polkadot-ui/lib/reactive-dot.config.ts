import {
  paseo,
  paseo_asset_hub,
  paseo_people,
  polkadot_asset_hub,
  polkadot_people,
  polkadot,
} from "@polkadot-api/descriptors";
import { defineConfig } from "@reactive-dot/core";
import type { ChainId } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import {
  getWsProvider,
  type WsJsonRpcProvider,
} from "polkadot-api/ws-provider";

const paseoPeopleProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/people-paseo"
);
const polkadotPeopleProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/people-polkadot"
);
const paseoProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/paseo"
);
const paseoAssetHubProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/asset-hub-paseo"
);
const polkadotAssetHubProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/asset-hub-polkadot"
);
const polkadotProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://rpc.polkadot.io"
);

export const config = defineConfig({
  ssr: true,
  chains: {
    paseo: {
      name: "Paseo",
      descriptor: paseo,
      provider: paseoProvider,
      explorerUrl: "https://paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list-assets/public/assets/chain-assets/paseotest-native-pas.png",
    },
    paseoPeople: {
      name: "Paseo People",
      descriptor: paseo_people,
      provider: paseoPeopleProvider,
      explorerUrl: "https://people-paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://people-paseo.subscan.io/_next/image?url=%2Fchains%2Fpeople-paseo%2Flogo-mini.png&w=256&q=75",
    },
    paseoAssetHub: {
      name: "Paseo Asset Hub",
      descriptor: paseo_asset_hub,
      provider: paseoAssetHubProvider,
      explorerUrl: "https://assethub-paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list-assets/public/assets/chains/paseo_assethub.png",
    },
    polkadot: {
      name: "Polkadot",
      descriptor: polkadot,
      provider: polkadotProvider,
      explorerUrl: "https://polkadot.subscan.io",
      symbol: "DOT",
      decimals: 10,
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list-assets/public/assets/chains/polkadot.png",
    },
    polkadotPeople: {
      name: "Polkadot People",
      descriptor: polkadot_people,
      provider: polkadotPeopleProvider,
      explorerUrl: "https://people-polkadot.subscan.io",
      symbol: "DOT",
      decimals: 10,
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list-assets/public/assets/chains/polkadot_people.png",
    },
    polkadotAssetHub: {
      name: "Polkadot Asset Hub",
      descriptor: polkadot_asset_hub,
      provider: polkadotAssetHubProvider,
      explorerUrl: "https://assethub-polkadot.subscan.io",
      symbol: "DOT",
      decimals: 10,
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list/src/logo/polkadot-asset-hub.png",
    },
  },
  wallets: [new InjectedWalletProvider()],
});

export type ChainIdWithIdentity = Extract<
  keyof typeof config.chains,
  "polkadotPeople" | "paseoPeople"
>;

export function isChainWithIdentity(
  chainId: ChainId
): chainId is ChainIdWithIdentity {
  return chainId === "polkadotPeople" || chainId === "paseoPeople";
}

export type ChainIdsWithPalletAssets = Extract<
  keyof typeof config.chains,
  "polkadotAssetHub" | "paseoAssetHub"
>;

export function isChainWithPalletAssets(
  chainId: ChainId
): chainId is ChainIdsWithPalletAssets {
  return chainId === "polkadotAssetHub" || chainId === "paseoAssetHub";
}
