import { paseo, paseo_people } from "@polkadot-api/descriptors";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { defineConfig } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";

export const config = defineConfig({
  ssr: true,
  chains: {
    paseo: {
      descriptor: paseo,
      provider: getWsProvider("wss://sys.ibp.network/paseo"),
    },
    paseoPeople: {
      descriptor: paseo_people,
      provider: getWsProvider("wss://sys.ibp.network/people-paseo"),
    },
  },
  wallets: [new InjectedWalletProvider()],
});
