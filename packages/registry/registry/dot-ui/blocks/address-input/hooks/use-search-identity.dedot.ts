import { useQuery } from "@tanstack/react-query";
import { useDedot, useDedotApi } from "@/registry/dot-ui/providers/dedot-provider";
import {
  extractText,
  hasPositiveIdentityJudgement,
} from "@/registry/dot-ui/lib/utils.dot-ui";
import { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";

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
  displayName: string | null | undefined,
  identityChain: ChainId = "paseo_people"
) {
  const { isLoading, isConnected } = useDedot();
  
  const peopleApi = useDedotApi(identityChain);
  


  return useQuery({
    queryKey: ["identity-search", displayName, identityChain],
    queryFn: async (): Promise<IdentitySearchResult[]> => {
      console.log(`🔍 DEDOT Search starting for: "${displayName}" on chain: ${identityChain}`);
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

        for (const [keyArgs, value] of entries) {
          if (!value || !value.info?.display) continue;

          const display = extractText(value.info.display);

          if (
            display &&
            display.toLowerCase().includes(displayName.toLowerCase())
          ) {
            const hasPositiveJudgement = hasPositiveIdentityJudgement(
              value.judgements
            );

            matches.push({
              address: keyArgs.toString(),
              identity: {
                display,
                email: extractText(value.info?.email),
                legal: extractText(value.info?.legal),
                matrix: extractText(value.info?.riot), // Dedot uses 'riot' instead of 'matrix'
                twitter: extractText(value.info?.twitter),
                web: extractText(value.info?.web),
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