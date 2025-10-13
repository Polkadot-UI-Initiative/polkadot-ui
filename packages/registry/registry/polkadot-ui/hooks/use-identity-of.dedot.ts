"use client";

import { type PolkadotIdentity } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { hasPositiveIdentityJudgement } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { hexToU8a, isHex, u8aToString } from "@polkadot/util";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ClientConnectionStatus, usePolkadotClient } from "typink";

export function useIdentityOf({
  address,
  chainId,
}: {
  address: string;
  chainId?: string;
}): UseQueryResult<PolkadotIdentity | null, Error> {
  const { client, status } = usePolkadotClient(chainId);
  const isConnected = status === ClientConnectionStatus.Connected;

  const queryResult = useQuery({
    queryKey: ["dedot-identity-of", chainId, address],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      if (!client || !address) return null;

      try {
        const result = await client.query.identity.identityOf(address);
        if (!result) return null;

        const identity: PolkadotIdentity = {
          display: decodeText(result?.info?.display),
          legal: decodeText(result?.info?.legal),
          email: decodeText(result?.info?.email),
          twitter: decodeText(result?.info?.twitter),
          matrix: decodeText(result?.info?.riot),
          image: decodeText(result?.info?.image),
          discord: hasField(result?.info, "discord")
            ? decodeText(result.info.discord)
            : undefined,
          github: hasField(result?.info, "github")
            ? decodeText(result.info.github)
            : undefined,
          verified: hasPositiveIdentityJudgement(result?.judgements),
        };

        return identity;
      } catch (e) {
        console.error("identityOf failed", e);
        return null;
      }
    },
    enabled: isConnected && !!client && !!address,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return queryResult as UseQueryResult<PolkadotIdentity | null, Error>;
}

function decodeText(data: unknown): string | undefined {
  if (!data) return undefined;
  if (typeof data === "string") {
    if (isHex(data)) {
      try {
        return u8aToString(hexToU8a(data));
      } catch {
        return data;
      }
    }
    return data;
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // Option-like wrappers
    if (
      ("isSome" in obj &&
        typeof (obj as { unwrap?: () => unknown }).unwrap === "function") ||
      ("unwrap" in obj &&
        typeof (obj as { unwrap: () => unknown }).unwrap === "function")
    ) {
      try {
        const unwrapped = (obj as { unwrap: () => unknown }).unwrap();
        return decodeText(unwrapped);
      } catch {}
    }
    // Raw forms: string or bytes
    if ("Raw" in obj) {
      const raw = (obj as { Raw?: unknown }).Raw;
      if (typeof raw === "string") return raw;
      if (typeof raw === "string" && isHex(raw)) {
        try {
          return u8aToString(hexToU8a(raw));
        } catch {
          return raw;
        }
      }
      if (raw instanceof Uint8Array) return new TextDecoder().decode(raw);
    }
    if (typeof obj.value === "string") return obj.value;
    if (
      "toJSON" in obj &&
      typeof (obj as { toJSON: () => unknown }).toJSON === "function"
    ) {
      const json = (obj as { toJSON: () => unknown }).toJSON();
      if (typeof json === "string") return json;
    }
    // Avoid leaking [object Object]
    const str = (obj as { toString?: () => string }).toString?.();
    if (typeof str === "string" && str !== "[object Object]") return str;
  }
  return undefined;
}

function hasField<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}
