import { useQuery } from "@tanstack/react-query";
import {
  usePapi,
  usePolkadotApi,
} from "@/registry/dot-ui/providers/papi-provider";

export interface PolkadotIdentity {
  display?: any;
  legal?: string;
  email?: string;
  twitter?: string;
  verified: boolean;
}

export function usePolkadotIdentity(address: string) {
  const { api, isLoading, currentChain, isConnected } = usePapi();
  const peopleApi = usePolkadotApi("paseo_people");

  return useQuery({
    queryKey: ["polkadot-identity", address, currentChain],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      if (
        !api ||
        !address ||
        isLoading(currentChain) ||
        !isConnected(currentChain)
      ) {
        return null;
      }

      try {
        const identityQuery = peopleApi?.query?.Identity?.IdentityOf;
        if (!identityQuery) return null;

        const identity = await identityQuery.getValue(address);
        if (!identity) return null;

        console.log(identity);

        return {
          display: identity.info?.display?.value.asText() || undefined,
          legal: identity.info?.legal?.value?.toString() || undefined,
          email: identity.info?.email?.value?.toString() || undefined,
          twitter: identity.info?.twitter?.value?.toString() || undefined,
          verified: false, // TODO: Implement proper judgement verification
        };
      } catch (error) {
        console.error("Identity lookup failed:", error);
        return null;
      }
    },
    enabled:
      !!api && !!address && address.length > 0 && isConnected(currentChain),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
