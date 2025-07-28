"use client";

import { useQuery } from "@tanstack/react-query";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";

export interface FormattedIdentity {
  display?: string;
  email?: string;
  legal?: string;
  twitter?: string;
  web?: string;
  verified?: boolean;
}

export interface IdentitySearchResult {
  address: string;
  identity: FormattedIdentity;
}

export function useIdentitySearch(
  displayName: string | null | undefined,
  identityChain: ChainId = "paseo_people"
) {
  const { apis, isConnected } = useDedot();

  return useQuery({
    queryKey: ["identity-search-dedot", displayName, identityChain],
    queryFn: async (): Promise<IdentitySearchResult[]> => {
      const api = apis[identityChain];

      if (
        !api ||
        !displayName ||
        displayName.length < 1 ||
        !isConnected(identityChain)
      ) {
        return [];
      }

      try {
        // Get all identity entries using Dedot API
        const entries = await api.query.identity.identityOf.entries();

        const MAX_RESULTS = 10;
        const matches: IdentitySearchResult[] = [];

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
        const hasPositiveJudgement = (judgements: unknown): boolean => {
          if (!Array.isArray(judgements)) return false;
          return judgements.some(
            ([, judgement]: [unknown, unknown]) =>
              judgement === "Reasonable" || judgement === "KnownGood"
          );
        };

        for (const [key, value] of entries) {
          if (!value || !value.info?.display) continue;

          const display = extractText(value.info.display);

          if (
            display &&
            display.toLowerCase().includes(displayName.toLowerCase())
          ) {
            const verified = hasPositiveJudgement(value.judgements);

            // Extract address from key (convert to string)
            const address = key.toString();

            matches.push({
              address,
              identity: {
                display,
                email: extractText(value.info?.email),
                legal: extractText(value.info?.legal),
                twitter: extractText(value.info?.twitter),
                web: extractText(value.info?.web),
                verified: verified || false,
              },
            });

            if (matches.length >= MAX_RESULTS) {
              break;
            }
          }
        }

        return matches;
      } catch (error) {
        console.error("Identity search failed:", error);
        throw error instanceof Error
          ? error
          : new Error("Identity search failed");
      }
    },
    enabled:
      !!apis[identityChain] &&
      !!displayName &&
      displayName.trim().length >= 1 &&
      isConnected(identityChain),
    staleTime: 5 * 60 * 1000, // 5 minutes - identities don't change often
    retry: 3, // Increased retry count
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}
