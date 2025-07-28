import { useQuery } from "@tanstack/react-query";
import { useDedot, useDedotApi } from "@/registry/dot-ui/providers/dedot-provider";
import {
  extractText,
  hasPositiveIdentityJudgement,
} from "@/registry/dot-ui/lib/utils.dot-ui";
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
  const { isLoading, isConnected } = useDedot();
  
  const peopleApi = useDedotApi(identityChain);
  
  return useQuery({
    queryKey: ["polkadot-identity", address, identityChain],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      if (
        !peopleApi ||
        !address ||
        isLoading(identityChain) ||
        !isConnected(identityChain)
      ) {
        return null;
      }

      try {
        const identity = await peopleApi.query.identity.identityOf(address);
        
        if (!identity) return null;

        // Check identity judgements for determining verified identity
        const hasPositiveJudgement = hasPositiveIdentityJudgement(
          identity.judgements
        );

        return {
          display: extractText(identity.info?.display),
          legal: extractText(identity.info?.legal),
          email: extractText(identity.info?.email),
          twitter: extractText(identity.info?.twitter),
          verified: hasPositiveJudgement || false,
        };
      } catch (error) {
        console.error("Identity lookup failed:", error);
        return null;
      }
    },
    enabled:
      !!peopleApi &&
      !!address &&
      address.length > 0 &&
      isConnected(identityChain),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 