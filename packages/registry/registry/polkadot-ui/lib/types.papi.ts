import { type TypedApi } from "polkadot-api";
import { polkadotConfig } from "@/registry/polkadot-ui/lib/config.papi";
import { type ChainId } from "@/registry/polkadot-ui/lib/config.dot-ui";

export type ChainDescriptor<T extends ChainId> =
  (typeof polkadotConfig.chains)[T]["descriptor"];

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
