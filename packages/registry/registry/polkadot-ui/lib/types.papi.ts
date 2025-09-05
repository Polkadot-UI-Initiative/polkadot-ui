import { type TypedApi } from "polkadot-api";
import { type ChainId } from "@reactive-dot/core";
import { config } from "../reactive-dot.config";

export type ChainDescriptor<T extends ChainId> =
  (typeof config.chains)[T]["descriptor"];

// Type to constrain chains to only those with Identity pallet
type HasIdentityPallet<T extends ChainId> =
  TypedApi<ChainDescriptor<T>> extends {
    query: {
      Identity: {
        IdentityOf: unknown;
      };
    };
  }
    ? T
    : never;

export type ChainIdWithIdentity = {
  [K in ChainId]: HasIdentityPallet<K>;
}[ChainId];
