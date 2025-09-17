/**
 * Simple React hook for fetching chaindata directly from GitHub JSON
 * This fetches from https://raw.githubusercontent.com/TalismanSociety/chaindata/main/pub/v4/chaindata.json
 */

import { useEffect, useState } from "react";
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
}

const CHAINDATA_URL =
  "https://raw.githubusercontent.com/TalismanSociety/chaindata/main/pub/v4/chaindata.json";

/**
 * Hook to fetch chaindata from GitHub JSON
 */
export function useChaindata(): UseChaindataResult {
  const [data, setData] = useState<UseChaindataResult>({
    chains: [],
    tokens: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchChaindata = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await fetch(CHAINDATA_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch chaindata: ${response.status} ${response.statusText}`
          );
        }

        const chaindata: ChaindataResponse = await response.json();

        if (isMounted) {
          setData({
            chains: chaindata.networks || [],
            tokens: chaindata.tokens || [],
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error fetching chaindata:", error);
        if (isMounted) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          }));
        }
      }
    };

    fetchChaindata();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}

/**
 * Hook to get tokens for a specific chain
 */
export function useTokensForChain(chainId?: string) {
  const { chains, tokens, isLoading, error } = useChaindata();

  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (!chainId || !tokens.length) {
      setFilteredTokens([]);
      return;
    }

    // Filter tokens that belong to the specified chain
    // This assumes token IDs follow a pattern like "chainId:token-type" or similar
    const chainTokens = tokens.filter(
      (token) =>
        token.id.startsWith(chainId + ":") || token.id.includes(chainId)
    );

    setFilteredTokens(chainTokens);
  }, [chainId, tokens]);

  return {
    tokens: filteredTokens,
    allTokens: tokens,
    chains,
    isLoading,
    error,
  };
}

/**
 * Hook to search tokens by symbol or name
 */
export function useTokenSearch(query: string) {
  const { tokens, isLoading, error } = useChaindata();

  const [searchResults, setSearchResults] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (!query.trim() || !tokens.length) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery) ||
        token.id.toLowerCase().includes(lowerQuery)
    );

    setSearchResults(results);
  }, [query, tokens]);

  return {
    results: searchResults,
    isLoading,
    error,
  };
}

/**
 * Hook to get specific tokens by assetIds for a chain
 * Filters tokens using the pattern: chainId:substrate-assets:assetId
 */
export function useTokensByAssetIds(chainId: string, assetIds: number[]) {
  const { tokens, isLoading, error } = useChaindata();

  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (!chainId || !assetIds.length || !tokens.length) {
      setFilteredTokens([]);
      return;
    }

    // Convert assetIds to strings and generate expected token IDs
    const expectedTokenIds = assetIds.map((assetId) =>
      generateTokenId(chainId, String(assetId))
    );

    // Filter tokens that match the expected token IDs
    const matchedTokens = tokens.filter((token) =>
      expectedTokenIds.includes(token.id)
    );

    setFilteredTokens(matchedTokens);
  }, [chainId, assetIds, tokens]);

  return {
    tokens: filteredTokens,
    isLoading,
    error,
  };
}
