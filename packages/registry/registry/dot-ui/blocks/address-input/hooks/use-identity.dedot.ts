import { useQuery } from "@tanstack/react-query";
import { useDedot, useDedotApi } from "@/registry/dot-ui/providers/dedot-provider";
import {
  hasPositiveIdentityJudgement,
  extractDedotText,
} from "@/registry/dot-ui/lib/utils.dot-ui";
import { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import type { PolkadotIdentity } from "@/registry/dot-ui/lib/types.dot-ui";

function extractDedotIdentityInfo(info: {
  display?: unknown;
  email?: unknown;
  legal?: unknown;
  twitter?: unknown;
}): Omit<PolkadotIdentity, "verified"> {
  return {
    display: extractDedotText(info?.display),
    legal: extractDedotText(info?.legal),
    email: extractDedotText(info?.email),
    twitter: extractDedotText(info?.twitter),
  };
}

export function usePolkadotIdentity(
  address: string,
  identityChain: ChainId = "paseo_people"
) {
  const { isLoading, isConnected } = useDedot();

  const peopleApi = useDedotApi(identityChain);

  return useQuery({
    queryKey: ["polkadot-identity-dedot", address, identityChain],
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

        const identityInfo = extractDedotIdentityInfo(identity.info);
        return {
          ...identityInfo,
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