"use client";

// no-op
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import {
  ClientConnectionStatus,
  PolkadotIdentity,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import type { IdentityData } from "@polkadot-api/descriptors";

// Extract the resolved return type of Identity.IdentityOf.getValue from any API-like shape
type ExtractIdentityOfValue<A> = A extends {
  query: {
    Identity: {
      IdentityOf: {
        getValue: (address: string) => Promise<infer V>;
      };
    };
  };
}
  ? V
  : never;

type ExtractIdentityOfEntries<A> = A extends {
  query: {
    Identity: {
      IdentityOf: { getEntries: () => Promise<infer E> };
    };
  };
}
  ? E
  : never;

// Generic guard that preserves the extracted value type for getValue
export function hasIdentityPallet<A>(api: A): api is A & {
  query: {
    Identity: {
      IdentityOf: {
        getValue: (address: string) => Promise<ExtractIdentityOfValue<A>>;
        getEntries: () => Promise<ExtractIdentityOfEntries<A>>;
      };
    };
  };
} {
  const a = api as {
    query?: {
      Identity?: {
        IdentityOf?: { getValue?: (address: string) => Promise<never> };
      };
    };
  } | null;
  return (
    !!a &&
    typeof a === "object" &&
    !!a.query &&
    !!a.query.Identity &&
    !!a.query.Identity.IdentityOf &&
    typeof a.query.Identity.IdentityOf.getValue === "function"
  );
}

export function useIdentityOf({
  address,
  chainId = "paseoPeople",
}: {
  address: string;
  chainId?: keyof typeof config.chains;
}): UseQueryResult<PolkadotIdentity | null, Error> {
  const { status, client } = usePapi(chainId);
  const isConnected = status === ClientConnectionStatus.Connected;
  const isEnabled = isConnected && !!client && !!address;

  const queryResult = useQuery({
    queryKey: ["papi-identity-of", chainId, address],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      const typedApiUnknown = client!.getTypedApi(
        config.chains[chainId].descriptor
      );
      if (!hasIdentityPallet(typedApiUnknown)) return null;
      const peopleApi = typedApiUnknown;

      try {
        type IdentityOfValue = ExtractIdentityOfValue<typeof peopleApi>;
        const raw: IdentityOfValue =
          await peopleApi.query.Identity.IdentityOf.getValue(address);
        if (!raw) return null;

        const info = raw.info;
        const judgements = raw.judgements;

        const parseIdentityData = (
          d?: IdentityData
        ): string | number | undefined => {
          if (typeof d?.value === "number") return d.value;
          return d?.value?.asText();
        };

        return {
          display: parseIdentityData(info?.display),
          legal: parseIdentityData(info?.legal),
          email: parseIdentityData(info?.email),
          twitter: parseIdentityData(info?.twitter),
          github: parseIdentityData(info?.github),
          discord: parseIdentityData(info?.discord),
          matrix: parseIdentityData(info?.matrix),
          image: parseIdentityData(info?.image),
          verified:
            // is some judgement is Reasonable or KnownGood, then the identity is verified
            (Array.isArray(judgements)
              ? judgements.some(([, judgement]) => {
                  const type = (judgement as { type?: string } | undefined)
                    ?.type;
                  return type === "Reasonable" || type === "KnownGood";
                })
              : false) ?? false,
        };
      } catch (e) {
        console.error("useIdentityOf (papi) failed", e);
        return null;
      }
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return queryResult as UseQueryResult<PolkadotIdentity | null, Error>;
}
