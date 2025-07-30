"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ChainId, dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";
import {
  getChainIds,
  getChainConfig,
  isValidChainId,
} from "@/registry/dot-ui/lib/utils.dot-ui";
import { DedotClient, WsProvider } from "dedot";
import {
  BasePolkadotContextValue,
  BasePolkadotProviderProps,
} from "@/registry/dot-ui/lib/types.dot-ui";

// Dedot-specific context type extending the base
type DedotContextValue = BasePolkadotContextValue<
  DedotClient,
  Partial<Record<ChainId, DedotClient>>,
  ChainId
>;

const DedotContext = createContext<DedotContextValue | undefined>(undefined);

export function PolkadotProvider({
  children,
  defaultChain,
}: BasePolkadotProviderProps<ChainId>) {
  const [currentChain, setCurrentChain] = useState<ChainId>(
    defaultChain || dotUiConfig.defaultChain
  );
  const [apis, setApis] = useState<Partial<Record<ChainId, DedotClient>>>({});
  const [clients, setClients] = useState<Map<ChainId, DedotClient>>(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<ChainId, boolean>>(
    new Map()
  );
  const [errorStates, setErrorStates] = useState<Map<ChainId, string | null>>(
    new Map()
  );

  // Initialize the default chain on mount
  useEffect(() => {
    initializeChain(defaultChain || dotUiConfig.defaultChain);
    console.log("DedotProvider initialized");
  }, [defaultChain]);

  const initializeChain = useCallback(
    async (chainId: ChainId) => {
      // Don't initialize if already connected
      if (apis[chainId]) return;

      setLoadingStates((prev) => new Map(prev).set(chainId, true));
      setErrorStates((prev) => new Map(prev).set(chainId, null));

      try {
        const chainConfig = getChainConfig(dotUiConfig.chains, chainId);

        // Validate that endpoints array exists and has at least one element
        if (!chainConfig.endpoints || !chainConfig.endpoints[0]) {
          throw new Error(
            `Chain ${chainId} (${chainConfig.displayName}) has no endpoints configured. Please add at least one endpoint to the chain configuration.`
          );
        }

        console.log(`Connecting to ${chainConfig.displayName} using dedot`);

        const provider = new WsProvider(chainConfig.endpoints);
        provider.on("connected", (endpoint: string) => {
          console.log("Connected Endpoint", endpoint);
        });

        await provider.connect();

        const client = await DedotClient.new({
          provider,
          cacheMetadata: true,
        });

        setClients((prev) => new Map(prev).set(chainId, client));
        setApis((prev: Partial<Record<ChainId, DedotClient>>) => ({
          ...prev,
          [chainId]: client,
        }));

        console.log(`Successfully connected to ${chainConfig.displayName}`);
      } catch (err) {
        console.error(`Failed to initialize ${chainId}:`, err);
        setErrorStates((prev) =>
          new Map(prev).set(
            chainId,
            err instanceof Error
              ? err.message
              : "Failed to initialize Polkadot API"
          )
        );
      } finally {
        setLoadingStates((prev) => new Map(prev).set(chainId, false));
      }
    },
    [apis, setLoadingStates, setErrorStates, setClients, setApis]
  );

  const setApi = (chainId: ChainId) => {
    if (!isValidChainId(dotUiConfig.chains, chainId)) {
      console.error(`Invalid chain ID: ${chainId}`);
      return;
    }

    setCurrentChain(chainId);
    // Initialize the chain if not already connected and not already initializing
    if (!apis[chainId] && !loadingStates.get(chainId)) {
      initializeChain(chainId);
    }
  };

  const disconnect = () => {
    // Handle async disconnect operations properly
    Promise.all(
      Array.from(clients.values()).map(async (client) => {
        try {
          await client.disconnect();
        } catch (error) {
          console.error("Error disconnecting client:", error);
        }
      })
    )
      .then(() => {
        console.log("All clients disconnected successfully");
      })
      .catch((error) => {
        console.error("Error during disconnect:", error);
      });

    // Clear state immediately to maintain synchronous interface
    setClients(new Map());
    setApis({});
    setLoadingStates(new Map());
    setErrorStates(new Map());
    setCurrentChain(defaultChain || dotUiConfig.defaultChain);
  };

  const isConnected = (chainId: ChainId): boolean => {
    return !!apis[chainId];
  };

  const isLoading = (chainId: ChainId): boolean => {
    return loadingStates.get(chainId) || false;
  };

  const currentChainConfig = getChainConfig(dotUiConfig.chains, currentChain);

  const value: DedotContextValue = {
    currentChain,
    api: apis[currentChain] || null,
    error: errorStates.get(currentChain) || null,
    apis,
    setApi,
    disconnect,
    isConnected,
    isLoading,
    initializeChain,
    chainName: currentChainConfig.displayName,
    availableChains: getChainIds(dotUiConfig.chains),
  };

  return (
    <DedotContext.Provider value={value}>{children}</DedotContext.Provider>
  );
}

export function useDedot(): DedotContextValue {
  const context = useContext(DedotContext);
  if (!context) {
    throw new Error("useDedot must be used within a DedotProvider");
  }
  return context;
}

// Helper to get properly typed API (maintains backward compatibility)
export function useTypedPolkadotApi(): DedotClient | null {
  const { api } = useDedot();
  return api;
}

// Helper to get a specific chain's API (type-safe) - similar to papi-provider
export function usePolkadotApi(chainId: ChainId): DedotClient | null {
  const { apis, initializeChain, isLoading } = useDedot();

  // Auto-initialize the chain if not connected and not already initializing
  useEffect(() => {
    if (!apis[chainId] && !isLoading(chainId)) {
      initializeChain(chainId);
    }
  }, [chainId, apis, initializeChain, isLoading]);

  return apis[chainId] || null;
}

// Type exports (matching polkadot provider)
export type { ChainId };
