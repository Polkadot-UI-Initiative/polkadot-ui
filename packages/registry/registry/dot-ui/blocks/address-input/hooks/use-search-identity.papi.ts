"use client";

import { useQuery } from "@tanstack/react-query";
import {
  usePapi,
  usePolkadotApi,
} from "@/registry/dot-ui/providers/papi-provider";
import { extractText } from "@/registry/dot-ui/lib/utils.dot-ui";

export interface FormattedIdentity {
  display?: string;
  email?: string;
  legal?: string;
  matrix?: string;
  twitter?: string;
  web?: string;
  verified?: boolean;
}

export interface IdentitySearchResult {
  address: string;
  identity: FormattedIdentity;
}

export function useIdentityByDisplayName(
  displayName: string | null | undefined
) {
  const IDENTITY_CHAIN = "paseo_people";
  const { isLoading, isConnected } = usePapi();
  const peopleApi = usePolkadotApi(IDENTITY_CHAIN);

  return useQuery({
    queryKey: ["identity-search", displayName, IDENTITY_CHAIN],
    queryFn: async (): Promise<IdentitySearchResult[]> => {
      if (
        !peopleApi ||
        !displayName ||
        displayName.length < 3 ||
        isLoading(IDENTITY_CHAIN) ||
        !isConnected(IDENTITY_CHAIN)
      ) {
        return [];
      }

      try {
        // Get all identity entries
        const entries = await peopleApi.query.Identity.IdentityOf.getEntries();

        const MAX_RESULTS = 10;
        const matches: IdentitySearchResult[] = [];

        for (const { keyArgs, value } of entries) {
          if (!value || !value.info?.display?.value) continue;

          const display = extractText(value.info.display.value);

          if (
            display &&
            display.toLowerCase().includes(displayName.toLowerCase())
          ) {
            // Check identity judgements for determining verified identity
            const hasPositiveJudgement = value.judgements && 
              value.judgements.length > 0 && 
              value.judgements.some((judgement: [number, unknown]) => {
                // Judgement types: Unknown, FeePaid, Reasonable, KnownGood, OutOfDate, LowQuality, Erroneous
                // More info: https://wiki.polkadot.network/learn/learn-identity/#judgements
                const judgementType = (judgement[1] as { type?: string })?.type || judgement[1];
                return judgementType === "Reasonable" || judgementType === "KnownGood";
              });

            matches.push({
              address: keyArgs[0] as string,
              identity: {
                display,
                email: extractText(value.info?.email?.value),
                legal: extractText(value.info?.legal?.value),
                matrix: extractText(value.info?.matrix?.value),
                twitter: extractText(value.info?.twitter?.value),
                web: extractText(value.info?.web?.value),
                verified: hasPositiveJudgement || false,
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
      !!peopleApi &&
      !!displayName &&
      displayName.length >= 3 &&
      isConnected(IDENTITY_CHAIN),
    staleTime: 5 * 60 * 1000, // 5 minutes - identities don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep cached longer for search
  });
}
