import { ChainDefinition } from "polkadot-api";
import { polkadotConfig } from "./config.papi";
import { ChainConfig } from "./config.dot-ui";

// types/interfaces related to papi
export type ChainId = keyof typeof polkadotConfig.chains;

export interface PapiConfig extends ChainConfig<ChainId> {
  readonly descriptor: ChainDefinition;
}

// export type ChainDescriptor<T extends ChainId> =
//   (typeof polkadotConfig.chains)[T]["descriptor"];

// // Type to constrain chains to only those with Identity pallet
// type HasIdentityPallet<T extends ChainId> =
//   TypedApi<ChainDescriptor<T>> extends {
//     query: {
//       Identity: {
//         IdentityOf: unknown;
//       };
//     };
//   }
//     ? T
//     : never;

// export type ChainIdWithIdentity = {
//   [K in ChainId]: HasIdentityPallet<K>;
// }[ChainId];
