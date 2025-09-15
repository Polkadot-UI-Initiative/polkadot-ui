import { paseo, paseo_asset_hub } from "@polkadot-api/descriptors";
import { defineConfig } from "@reactive-dot/core";
import { WalletProvider } from "@reactive-dot/core/wallets.js";
import { getWsProvider, JsonRpcProvider } from "polkadot-api/ws-provider/web";

// const isServer = typeof window === "undefined";

// Build wallets array lazily to avoid touching browser APIs on the server
// let wallets: WalletProvider[] = [];
// if (!isServer) {
//   const { InjectedWalletProvider } = await import(
//     "@reactive-dot/core/wallets.js"
//   );
//   wallets = [new InjectedWalletProvider()];
// }

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
      chainId: "paseo",
    },
    paseo_asset_hub: {
      name: "Paseo Asset Hub",
      descriptor: paseo_asset_hub,
      provider: getWsProvider("wss://sys.ibp.network/paseo-asset-hub"),
      explorerUrl: "https://paseo-asset-hub.subscan.io",
      symbol: "ASSETH",
      decimals: 10,
      chainId: "paseo_asset_hub",
    },
  },
  // reactive-dot expects an array of wallet providers
  // wallets: wallets,
});
