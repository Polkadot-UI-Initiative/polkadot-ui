import {
  paseo,
  paseo_asset_hub,
  paseo_people,
  polkadot_people,
} from "@polkadot-api/descriptors";
import { defineConfig } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { getWsProvider, WsJsonRpcProvider } from "polkadot-api/ws-provider/web";

let paseoPeopleProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/people-paseo"
);
let polkadotPeopleProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/people-polkadot"
);
let paseoProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/paseo"
);
let paseoAssetHubProvider: WsJsonRpcProvider | null = getWsProvider(
  "wss://sys.ibp.network/asset-hub-paseo"
);

export const destroyProviders = () => {
  paseoPeopleProvider = null;
  polkadotPeopleProvider = null;
  paseoProvider = null;
  paseoAssetHubProvider = null;
};

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
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list-assets/public/",
    },
    paseoPeople: {
      name: "Paseo People",
      descriptor: paseo_people,
      provider: paseoPeopleProvider,
      explorerUrl: "https://people-paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://paseo.network/logo.png",
    },
    polkadotPeople: {
      name: "Polkadot People",
      descriptor: polkadot_people,
      provider: polkadotPeopleProvider,
      explorerUrl: "https://people-polkadot.subscan.io",
      symbol: "DOT",
      decimals: 10,
      logo: "https://polkadot.network/logo.png",
    },
    paseoAssetHub: {
      name: "Paseo Asset Hub",
      descriptor: paseo_asset_hub,
      provider: paseoAssetHubProvider,
      explorerUrl: "https://assethub-paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://paseo.network/logo.png",
    },
  },
  wallets: [new InjectedWalletProvider()],
});
