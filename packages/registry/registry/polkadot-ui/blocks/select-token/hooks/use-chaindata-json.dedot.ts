/**
 * React hook for fetching chaindata directly from GitHub JSON
 * This fetches from https://raw.githubusercontent.com/TalismanSociety/chaindata/main/pub/v4/chaindata.json
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { generateTokenId } from "@/registry/polkadot-ui/lib/utils.dot-ui";

export interface TokenInfo {
  id: string;
  symbol: string;
  decimals: number;
  name: string;
  assetId: string;
  coingeckoId?: string;
  logo?: string;
}

export interface ChainInfo {
  id: string;
  name: string;
  logo?: string;
  nativeTokenId?: string;
  nativeCurrency?: {
    decimals: number;
    symbol: string;
    name: string;
    coingeckoId?: string;
    logo?: string;
  };
  platform?: string;
  isTestnet?: boolean;
  isDefault?: boolean;
}

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
    signal.addEventListener("abort", () => controller.abort());
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
 * This won't grab the native token for the chain
 */
export function useTokensByAssetIds(chainId: string, assetIds: number[]) {
  const { tokens, isLoading, error, isError, isRetrying, failureCount } =
    useChaindata();

  // Memoize the filtered tokens calculation
  const filteredTokens = useMemo(() => {
    if (!chainId || !assetIds.length || !tokens.length) {
      return [];
    }

    // Convert assetIds to strings and generate expected token IDs
    const expectedTokenIds = assetIds.map((assetId) =>
      generateTokenId(chainId, String(assetId))
    );

    // Filter tokens that match the expected token IDs
    return tokens.filter((token) => expectedTokenIds.includes(token.id));
  }, [chainId, assetIds, tokens]);

  return {
    tokens: filteredTokens,
    isLoading,
    error,
    isError,
    isRetrying,
    failureCount,
  };
}
