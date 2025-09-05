import { paseo, paseo_people } from "@polkadot-api/descriptors";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { defineConfig } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";

// Helper to create provider only on client-side
const createProvider = (url: string) => {
  // During build/SSR, return a mock provider to prevent WebSocket connections
  if (typeof window === "undefined") {
    return () => Promise.resolve({} as any);
  }
  return getWsProvider(url);
};

export const config = defineConfig({
  ssr: false, // Disable SSR to prevent server-side subscriptions during build
  chains: {
    paseo: {
      name: "Paseo",
      descriptor: paseo,
      provider: createProvider("wss://sys.ibp.network/paseo"),
      explorerUrl: "https://paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
    },
    paseoPeople: {
      name: "Paseo People",
      descriptor: paseo_people,
      provider: createProvider("wss://sys.ibp.network/people-paseo"),
      explorerUrl: "https://people-paseo.subscan.io",
      symbol: "PAS",
      decimals: 10,
    },
  },
  wallets: typeof window !== "undefined" ? [new InjectedWalletProvider()] : [],
});
