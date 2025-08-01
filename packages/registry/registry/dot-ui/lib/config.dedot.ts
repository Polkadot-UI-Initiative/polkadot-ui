import { dotUiConfig } from "./config.dot-ui";
import { PaseoApi, PaseoPeopleApi } from "@dedot/chaintypes";

// export type ChainApiMap = {
//   paseo: PaseoApi;
//   paseo_people: PeoplePaseoApiDescriptor;
// };

// // Type helper to get properly typed DedotClient for each chain
// export type DedotClientMap = {
//   [K in ChainId]: DedotClient<ChainApiMap[K]>;
// };

// // Union type of all possible DedotClient types
// export type DedotClientUnion = DedotClientMap[ChainId];

// // Specific collection type for Dedot APIs - this is what TApis resolves to
// export type DedotApisCollection = {
//   paseo: DedotClient<PaseoApi>;
//   paseo_people: DedotClient<PaseoPeopleApi>;
// };

// export function generateTypedClient<T extends ChainId>(chainId: T): DedotClient<ChainApiMap[T]> {
//     const provider = new WsProvider(dotUiConfig.chains[chainId].endpoints);
//     switch (chainId) {
//         case 'paseo_people': {
//             return new DedotClient<ChainApiMap[T]>({
//                 provider,
//                 cacheMetadata: true,
//             });
//         }
//         case 'paseo': {
//             return new DedotClient<ChainApiMap[T]>({
//                 provider,
//                 cacheMetadata: true,
//             });
//         }
//         default: {
//             throw new Error(`Unsupported chain id: ${chainId}`);
//         }
//     }
// }

export const polkadotConfig = {
    ...dotUiConfig,
    chains: {
        paseo: {
            ...dotUiConfig.chains.paseo,
            // descriptor: PaseoApi
        },
        paseo_people: {
            ...dotUiConfig.chains.paseo_people,
            // descriptor: PaseoPeopleApi
        }
        // Add more chains here by simply following the pattern above
        // Get `ChainApi` interfaces from "@dedot/chaintypes" package
        // Benefit: enabling types and & APIs suggestions for the particular chain
        // Example:
        // 1. Import: import type { PolkadotApi } from "@dedot/chaintypes";
        // 2. Update DedotChainApiMap with the new chain:
        //    export type DedotChainApiMap = {
        //      paseo: PaseoApi;
        //      paseo_people: PaseoPeopleApi;
        //      polkadot: PolkadotApi; // <- Add this
        //    };
        // 3. Add configuration:
        // polkadot: {
        //   ...dotUiConfig.chains.polkadot,
        //   typedClient: async () => generateTypedClient('polkadot')
        // }
    },
    defaultChain: "paseo" as const,
} as const;