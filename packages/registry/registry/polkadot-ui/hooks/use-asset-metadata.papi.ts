"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";
import { useClient } from "@reactive-dot/react";
import { useConnectionStatus } from "../lib/polkadot-provider.papi";

import { type TokenMetadata } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { useChaindata } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import {
  NATIVE_TOKEN_KEY,
  chainIdToKebabCase,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";

type ExtractAssetMetadataValue<A> = A extends {
  query: {
    Assets: {
      Metadata: { getValue: (assetId: number) => Promise<infer V> };
    };
  };
}
  ? V
  : never;

export function hasAssetMetadataPallet<A>(api: A): api is A & {
  query: {
    Assets: {
      Metadata: {
        getValue: (assetId: number) => Promise<ExtractAssetMetadataValue<A>>;
      };
    };
  };
} {
  const a = api as {
    query?: {
      Assets?: {
        Metadata?: { getValue?: (assetId: number) => Promise<never> };
      };
    };
  } | null;
  return (
    !!a &&
    typeof a === "object" &&
    !!a.query &&
    !!a.query.Assets &&
    !!a.query.Assets.Metadata &&
    typeof a.query.Assets.Metadata.getValue === "function"
  );
}

export function useAssetMetadata({
  chainId = "paseoAssetHub",
  assetIds,
}: {
  chainId?: ChainId;
  assetIds: number[];
}) {
  const { status } = useConnectionStatus({ chainId });
  const client = useClient({ chainId });
  const isConnected = status === ClientConnectionStatus.Connected;

  const sortedIds = useMemo(() => {
    const sanitized = assetIds
      .map((id) =>
        typeof id === "number" && Number.isFinite(id) ? Math.floor(id) : NaN
      )
      .filter((id) => Number.isInteger(id) && id >= -1) as number[];
    return [...new Set(sanitized)].sort((a, b) => a - b);
  }, [assetIds]);

  const includesNative = sortedIds.includes(NATIVE_TOKEN_KEY);
  const palletAssetIds = useMemo(
    () => sortedIds.filter((id) => id >= 0),
    [sortedIds]
  );

  const {
    chains,
    isLoading: isChaindataLoading,
    error: chaindataError,
  } = useChaindata();
  const nativeMeta: TokenMetadata | null = useMemo(() => {
    if (!includesNative) return null;
    const kebabId = chainIdToKebabCase(chainId);
    const network = chains.find(
      (c) => c.id === kebabId || c.id === (chainId as string)
    );
    const native = network?.nativeCurrency;
    if (!native) return null;
    return {
      assetId: NATIVE_TOKEN_KEY,
      name: native.name || "Native",
      symbol: native.symbol || "UNIT",
      decimals:
        typeof native.decimals === "number"
          ? native.decimals
          : Number(native.decimals ?? 12),
    } as TokenMetadata;
  }, [includesNative, chains, chainId]);

  const queryResult = useQuery({
    queryKey: ["papi-assets-metadata", String(chainId), palletAssetIds],
    queryFn: async (): Promise<TokenMetadata[]> => {
      const typedApiUnknown = client!.getTypedApi(
        config.chains[chainId].descriptor
      );
      if (!hasAssetMetadataPallet(typedApiUnknown)) return [];
      const assetApi = typedApiUnknown;

      const results = await Promise.all(
        palletAssetIds.map(async (assetId) => {
          try {
            type AssetMetadataValue = ExtractAssetMetadataValue<
              typeof assetApi
            >;
            const meta: AssetMetadataValue =
              await assetApi.query.Assets.Metadata.getValue(assetId);

            const nameField = (meta as { name?: unknown }).name;
            const symbolField = (meta as { symbol?: unknown }).symbol;

            const name = decodeBinaryField(nameField);
            const symbol = decodeBinaryField(symbolField);
            const decimals = (meta as { decimals?: number }).decimals ?? 0;
            const deposit = (meta as { deposit?: bigint }).deposit ?? 0n;
            const isFrozen = (meta as { isFrozen?: boolean }).isFrozen ?? false;

            return {
              assetId,
              deposit,
              isFrozen,
              name: name ?? `Asset ${assetId}`,
              symbol: symbol ?? String(assetId),
              decimals,
            } as TokenMetadata;
          } catch {
            return {
              assetId,
              deposit: 0n,
              isFrozen: false,
              name: `Asset ${assetId}`,
              symbol: String(assetId),
              decimals: 0,
            } as TokenMetadata;
          }
        })
      );

      return results;
    },
    enabled: isConnected && !!client && palletAssetIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const assets = useMemo(() => {
    const list = queryResult.data ?? [];
    if (nativeMeta) return [nativeMeta, ...list];
    return list;
  }, [queryResult.data, nativeMeta]);

  return {
    assets,
    isLoading: queryResult.isLoading || (includesNative && isChaindataLoading),
    error:
      queryResult.error ??
      (includesNative && chaindataError ? new Error(chaindataError) : null),
  } as const;
}

function decodeBinaryField(binaryField: unknown): string | undefined {
  if (!binaryField) return undefined;

  try {
    const field = binaryField as {
      asText?: () => string;
      asBytes?: () => Uint8Array;
      asHex?: () => string;
      asOpaqueBytes?: () => Uint8Array;
      asOpaqueHex?: () => string;
    };

    // Try asText() method first (most common for readable metadata)
    if (typeof field?.asText === "function") {
      const text = field.asText();
      return text && text.length > 0 ? text : undefined;
    }

    // Try asBytes() method and decode as UTF-8
    if (typeof field?.asBytes === "function") {
      const bytes = field.asBytes();
      if (bytes && bytes.length > 0) {
        return new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes);
      }
    }

    // Try asHex() method and convert hex to string
    if (typeof field?.asHex === "function") {
      const hex = field.asHex();
      if (hex && hex.length > 2) {
        // Skip '0x' prefix
        const hexString = hex.startsWith("0x") ? hex.slice(2) : hex;
        const bytes = new Uint8Array(
          hexString
            .match(/.{1,2}/g)
            ?.map((byte: string) => parseInt(byte, 16)) || []
        );
        return new TextDecoder("utf-8", { ignoreBOM: true }).decode(bytes);
      }
    }

    // Fallback: check if it's already a string
    if (typeof binaryField === "string") {
      return binaryField;
    }

    // Fallback: check if it's a Uint8Array
    if (binaryField instanceof Uint8Array) {
      return new TextDecoder("utf-8", { ignoreBOM: true }).decode(binaryField);
    }
  } catch (error) {
    console.warn("Failed to decode binary field:", error);
  }

  return undefined;
}
