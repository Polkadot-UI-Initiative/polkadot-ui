import { defineSubstrateChainConfig, SubstrateExplorer } from "./types.polkadot-ui"

export const substrateConfig = defineSubstrateChainConfig({
    chains: {
        paseo: {
            network: 'paseo',
            displayName: 'Paseo Relay Chain',
            rpcUrls: ['wss://sys.ibp.network/paseo'],
            explorerUrls: {
                [SubstrateExplorer.PolkadotJs]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent('wss://sys.ibp.network/paseo')}#/explorer`,
            },
            isTestnet: true,
        },
        paseoAssetHub: {
            network: 'paseo-asset-hub',
            displayName: 'Paseo Asset Hub',
            rpcUrls: ['wss://sys.ibp.network/asset-hub-paseo'],
            explorerUrls: {
                [SubstrateExplorer.PolkadotJs]: `https://polkadot.js.org/apps/?rpc=${encodeURIComponent('wss://sys.ibp.network/asset-hub-paseo')}#/explorer`,
            },
            isTestnet: true,
        },
    },
    defaultChain: 'paseoAssetHub',
} as const);

export type ChainId = keyof typeof substrateConfig.chains
export type ChainNetwork<T extends ChainId> = typeof substrateConfig.chains[T]['network']