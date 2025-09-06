import { useQuery } from "@tanstack/react-query";
// import {
//   usePapi,
//   usePolkadotApi,
// } from "@/registry/polkadot-ui/providers/__polkadot-provider.papi";
import {
  extractText,
  hasPositiveIdentityJudgement,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { type ChainIdWithIdentity } from "@/registry/polkadot-ui/lib/types.papi";
import {
  ClientConnectionStatus,
  usePapi,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { config } from "@/registry/polkadot-ui/reactive-dot.config";

export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  verified: boolean;
}

export function useIdentity(
  address: string,
  identityChain: ChainIdWithIdentity | undefined = "paseoPeople"
) {
  const { status, client } = usePapi(identityChain);
  const isLoading = status === ClientConnectionStatus.Connecting;
  const isConnected = status === ClientConnectionStatus.Connected;
  const peopleApi = client?.getTypedApi(
    config.chains[identityChain].descriptor
  );

  return useQuery({
    queryKey: ["polkadot-identity-papi", address, identityChain],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      if (!peopleApi || !address || isLoading || !isConnected) {
        return null;
      }

      try {
        const identityQuery =
          peopleApi?.query.Identity.IdentityOf.getValue(address);

        const identity = await identityQuery;
        if (!identity) return null;

        // Check identity judgements for determining verified identity
        const hasPositiveJudgement = hasPositiveIdentityJudgement(
          identity.judgements
        );

        return {
          display: extractText(identity.info?.display?.value),
          legal: extractText(identity.info?.legal?.value),
          email: extractText(identity.info?.email?.value),
          twitter: extractText(identity.info?.twitter?.value),
          verified: hasPositiveJudgement || false,
        };
      } catch (error) {
        console.error("Identity lookup failed:", error);
        return null;
      }
    },
    enabled: !!peopleApi && !!address && address.length > 0 && isConnected,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
