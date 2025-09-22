import {
  paseo,
  paseo_people,
  polkadot_people,
} from "@polkadot-api/descriptors";
import { defineConfig } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { getWsProvider } from "polkadot-api/ws-provider/web";

export const config = defineConfig({
  ssr: true,
  chains: {
    paseo: {
      name: "Paseo",
      descriptor: paseo,
      provider: getWsProvider("wss://sys.ibp.network/paseo"),
      explorerUrl: "https://paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://raw.githubusercontent.com/Koniverse/SubWallet-ChainList/refs/heads/master/packages/chain-list-assets/public/",
    },
    paseoPeople: {
      name: "Paseo People",
      descriptor: paseo_people,
      provider: getWsProvider("wss://sys.ibp.network/people-paseo"),
      explorerUrl: "https://people-paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
      logo: "https://paseo.network/logo.png",
    },
    polkadotPeople: {
      name: "Polkadot People",
      descriptor: polkadot_people,
      provider: getWsProvider("wss://sys.ibp.network/people-polkadot"),
      explorerUrl: "https://people-polkadot.subscan.io",
      symbol: "DOT",
      decimals: 10,
      logo: "https://polkadot.network/logo.png",
    },
  },
  wallets: [new InjectedWalletProvider()],
});
