"use client";

import { useQuery } from "@tanstack/react-query";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";

export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  verified: boolean;
}

export function usePolkadotIdentity(
  address: string,
  identityChain: ChainId = "paseo_people"
) {
  const { apis, isConnected } = useDedot();

  return useQuery({
    queryKey: ["polkadot-identity-dedot", address, identityChain],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      const api = apis[identityChain];
      if (!api || !address || !isConnected(identityChain)) {
        return null;
      }

      try {
        // Query identity using Dedot API
        const identity = await api.query.identity.identityOf(address);

        if (!identity || !identity.info) {
          return null;
        }

        const info = identity.info;

        // Extract text from Dedot's data structure
        const extractText = (data: unknown): string | undefined => {
          if (!data) return undefined;
          if (typeof data === "string") return data;
          if (data && typeof data === "object") {
            const obj = data as Record<string, unknown>;
            if (obj.Raw && obj.Raw instanceof Uint8Array) {
              return new TextDecoder().decode(obj.Raw);
            }
            if (obj.value && typeof obj.value === "string") {
              return obj.value;
            }
          }
          return undefined;
        };

        // Check for positive judgements
        const hasPositiveJudgement =
          identity.judgements?.some(
            ([, judgement]: [unknown, unknown]) =>
              judgement === "Reasonable" || judgement === "KnownGood"
          ) || false;

        return {
          display: extractText(info.display),
          legal: extractText(info.legal),
          email: extractText(info.email),
          twitter: extractText(info.twitter),
          verified: hasPositiveJudgement,
        };
      } catch (error) {
        console.error("Identity lookup failed:", error);
        return null;
      }
    },
    enabled: !!apis[identityChain] && !!address && isConnected(identityChain),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
