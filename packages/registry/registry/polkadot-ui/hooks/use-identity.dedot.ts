"use client";

import { useQuery } from "@tanstack/react-query";

import { hasPositiveIdentityJudgement } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  usePolkadotClient,
  paseoPeople,
  NetworkId,
  ClientConnectionStatus,
} from "typink";

export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  verified: boolean;
}

export function useIdentity(
  address: string,
  identityChain: NetworkId = paseoPeople.id
) {
  const { client: peopleClient, status: peopleStatus } = usePolkadotClient(
    identityChain ?? paseoPeople.id
  );

  return useQuery({
    queryKey: ["polkadot-identity-dedot", address, identityChain],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      if (
        !peopleClient ||
        !address ||
        peopleStatus !== ClientConnectionStatus.Connected
      ) {
        return null;
      }

      try {
        // Query identity using Dedot API
        const identity = await peopleClient.query.identity.identityOf(address);

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
        const hasPositiveJudgement = hasPositiveIdentityJudgement(
          identity.judgements
        );

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
    enabled:
      !!peopleClient &&
      !!address &&
      peopleStatus === ClientConnectionStatus.Connected,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
