"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClientConnectionStatus, usePolkadotClient } from "typink";
import { isHex, hexToU8a, u8aToString } from "@polkadot/util";

export interface PolkadotIdentity {
  display?: string;
  legal?: string;
  email?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  matrix?: string;
  image?: string;
  verified: boolean;
}

export function useIdentityOf({
  chainId,
  address,
}: {
  chainId: string;
  address: string;
}) {
  const { client, status } = usePolkadotClient(chainId);
  const isConnected = status === ClientConnectionStatus.Connected;

  const queryResult = useQuery({
    queryKey: ["dedot-identity-of", chainId, address],
    queryFn: async (): Promise<PolkadotIdentity | null> => {
      if (!client || !address) return null;

      try {
        const result = await client.query.identity.identityOf(address);
        if (!result) return null;

        interface RawIdentityInfo {
          display?: unknown;
          legal?: unknown;
          email?: unknown;
          twitter?: unknown;
          github?: unknown;
          discord?: unknown;
          matrix?: unknown;
          image?: unknown;
        }
        interface RawIdentity {
          info?: RawIdentityInfo;
          judgements?: unknown[];
        }
        const r = result as unknown as RawIdentity;
        const info: RawIdentityInfo =
          r.info ??
          (result as unknown as { info?: RawIdentityInfo }).info ??
          {};
        const judgements = (r.judgements as unknown[]) ?? [];

        const hasPositive = Array.isArray(judgements)
          ? judgements.some((j) => {
              const arr = j as unknown as [unknown, unknown];
              const second = arr?.[1] as unknown;
              const type = (second as { type?: string })?.type ?? second;
              return type === "Reasonable" || type === "KnownGood";
            })
          : false;

        const identity: PolkadotIdentity = {
          display: decodeText(info?.display),
          legal: decodeText(info?.legal),
          email: decodeText(info?.email),
          twitter: decodeText(info?.twitter),
          github: decodeText(info?.github),
          discord: decodeText(info?.discord),
          matrix: decodeText(info?.matrix),
          image: decodeText(info?.image),
          verified: hasPositive,
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

  const data = useMemo(() => queryResult.data ?? null, [queryResult.data]);
  return {
    data,
    isLoading: queryResult.isLoading,
    error: (queryResult.error as Error) ?? null,
  } as const;
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
