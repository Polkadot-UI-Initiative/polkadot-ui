import { useQuery } from "@tanstack/react-query";
import { useDedot, useDedotApi } from "@/registry/dot-ui/providers/dedot-provider";
import {
  hasPositiveIdentityJudgement,
  extractDedotText,
} from "@/registry/dot-ui/lib/utils.dot-ui";
import { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import type {
  FormattedIdentity,
  IdentitySearchResult,
} from "@/registry/dot-ui/lib/types.dot-ui";

function extractDedotIdentityInfo(info: {
  display?: unknown;
  email?: unknown;
  legal?: unknown;
  riot?: unknown;
  twitter?: unknown;
  web?: unknown;
}): FormattedIdentity {
  return {
    display: extractDedotText(info?.display),
    email: extractDedotText(info?.email),
    legal: extractDedotText(info?.legal),
    matrix: extractDedotText(info?.riot), // Dedot uses 'riot' instead of 'matrix'
    twitter: extractDedotText(info?.twitter),
    web: extractDedotText(info?.web),
  };
}

export function useIdentityByDisplayName(
  displayName: string | null | undefined,
  identityChain: ChainId = "paseo_people"
) {
  const { isLoading, isConnected } = useDedot();

  const peopleApi = useDedotApi(identityChain);

  return useQuery({
    queryKey: ["identity-search-dedot", displayName, identityChain],
    queryFn: async (): Promise<IdentitySearchResult[]> => {
      if (
        !peopleApi ||
        !displayName ||
        displayName.length < 3 ||
        isLoading(identityChain) ||
        !isConnected(identityChain)
      ) {
        return [];
      }

      try {
        const entries = await peopleApi.query.identity.identityOf.entries();

        const MAX_RESULTS = 10;
        const matches: IdentitySearchResult[] = [];

        for (const entry of entries) {
          // dedot data format is [AccountId32, PalletIdentityRegistration]
          const [key, value] = entry;

          if (!value || !value.info?.display) continue;

          const identityInfo = extractDedotIdentityInfo(value.info);
          const display = identityInfo.display;

          if (
            display &&
            display.toLowerCase().includes(displayName.toLowerCase())
          ) {
            const hasPositiveJudgement = hasPositiveIdentityJudgement(
              value.judgements
            );

            const address = key.address();

            matches.push({
              address,
              identity: {
                ...identityInfo,
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
        return [];
      }
    },
    enabled:
      !!peopleApi &&
      !!displayName &&
      displayName.length >= 3 &&
      isConnected(identityChain) &&
      !isLoading(identityChain),
    staleTime: 5 * 60 * 1000, // 5 minutes - identities don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep cached longer for search
  });
} 