/**
 * React hook for fetching chaindata directly from GitHub JSON
 * This fetches from https://raw.githubusercontent.com/TalismanSociety/chaindata/main/pub/v4/chaindata.json
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  chainIdToKebabCase,
  generateTokenId,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { ChainInfo, TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";

export interface ChaindataResponse {
  networks?: ChainInfo[];
  tokens?: TokenInfo[];
}

export interface UseChaindataResult {
  chains: ChainInfo[];
  tokens: TokenInfo[];
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  isRetrying: boolean;
  failureCount: number;
}

const CHAINDATA_URL =
  "https://raw.githubusercontent.com/TalismanSociety/chaindata/main/pub/v4/chaindata.json";

// Fetch function with timeout and abort signal support
const fetchChaindata = async ({
  signal,
}: {
  signal?: AbortSignal;
}): Promise<ChaindataResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  // Combine external abort signal with timeout
  if (signal) {
    const onAbort = () => controller.abort();
    try {
      signal.addEventListener("abort", onAbort);
      const response = await fetch(CHAINDATA_URL, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      signal.removeEventListener("abort", onAbort);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      signal.removeEventListener("abort", onAbort);
      throw error;
    }
  }

  try {
    const response = await fetch(CHAINDATA_URL, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Fetch chaindata from GitHub JSON
 */
export function useChaindata(): UseChaindataResult {
  const { data, isLoading, error, isError, failureCount, isRefetching } =
    useQuery({
      queryKey: ["chaindata"],
      queryFn: fetchChaindata,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    });

  return {
    chains: data?.networks || [],
    tokens: data?.tokens || [],
    isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : String(error)
      : null,
    isError,
    isRetrying: isRefetching,
    failureCount,
  };
}

/**
 * Get specific tokens by assetIds for a chain
 * Filters tokens using the pattern: chainId:substrate-assets:assetId
 * This will include the native token for the chain if includeNative is true
 */
export function useTokensByAssetIds(
  chainId: string,
  assetIds: number[],
  options?: { includeNative?: boolean }
) {
  const {
    tokens,
    chains,
    isLoading,
    error: fetchError,
    isError: fetchIsError,
    isRetrying,
    failureCount,
  } = useChaindata();

  // Memoize the filtered tokens calculation
  const { resultTokens, logicError } = useMemo(() => {
    if (!chainId || !tokens.length)
      return {
        resultTokens: [] as TokenInfo[],
        logicError: null as string | null,
      };

    const expectedTokenIds = new Set(
      (assetIds || []).map((assetId) =>
        generateTokenId(chainId, String(assetId))
      )
    );

    const matched = tokens.filter((token) => expectedTokenIds.has(token.id));

    if (!options?.includeNative)
      return { resultTokens: matched, logicError: null };

    const network = chains.find((c) => c.id === chainIdToKebabCase(chainId));
    const native = network?.nativeCurrency;

    if (!native) return { resultTokens: matched, logicError: null };

    const assetIdFromTokenId = network?.nativeTokenId
      ? network.nativeTokenId.split(":").slice(-1)[0] || "native"
      : "native";

    const nativeToken: TokenInfo = {
      id:
        network?.nativeTokenId || generateTokenId(chainId, assetIdFromTokenId),
      symbol: native.symbol,
      decimals: native.decimals,
      name: native.name,
      assetId: assetIdFromTokenId,
      coingeckoId: native.coingeckoId,
      logo: native.logo,
    };

    const isNativeInMatched = matched.some((t) => t.id === nativeToken.id);

    if (isNativeInMatched) {
      // both are native (requested native and includeNative) → surface logic error, keep native only
      return {
        resultTokens: [nativeToken],
        logicError: "Both tokens are native",
      };
    }

    // none is native → ensure native first, then first matched if exists
    if (matched.length >= 1)
      return { resultTokens: [nativeToken, matched[0]], logicError: null };

    // fallback to just native
    return { resultTokens: [nativeToken], logicError: null };
  }, [chainId, tokens, chains, assetIds, options?.includeNative]);

  return {
    tokens: resultTokens,
    isLoading,
    error:
      logicError ??
      (fetchError
        ? typeof fetchError === "object" &&
          fetchError &&
          "message" in fetchError
          ? ((fetchError as { message?: string }).message ?? String(fetchError))
          : String(fetchError)
        : null),
    isError: fetchIsError || Boolean(logicError),
    isRetrying,
    failureCount,
  };
}
