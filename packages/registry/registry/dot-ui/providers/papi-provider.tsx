"use client";

import { createClient, TypedApi } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { polkadotConfig } from "@/registry/dot-ui/lib/config.papi";
import {
  getChainIds,
  getChainConfig,
  isValidChainId,
} from "@/registry/dot-ui/lib/utils.dot-ui";
import { ChainDescriptor } from "@/registry/dot-ui/lib/types.papi";
import { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import {
  BasePolkadotContextValue,
  BasePolkadotProviderProps,
} from "@/registry/dot-ui/lib/types.dot-ui";

// PAPI-specific types
type ConfiguredChainApi<T extends ChainId> = TypedApi<ChainDescriptor<T>>;

// Create a composite API types that includes all registered chains
type CompositeApi = {
  [K in ChainId]: ConfiguredChainApi<K>;
};

// PAPI-specific context type extending the base
type PapiContextValue = BasePolkadotContextValue<
  ConfiguredChainApi<ChainId>,
  Partial<CompositeApi>,
  ChainId
>;

const PolkadotContext = createContext<PapiContextValue | undefined>(undefined);

export function PolkadotProvider({
  children,
  defaultChain,
}: BasePolkadotProviderProps<ChainId>) {
  const [currentChain, setCurrentChain] = useState<ChainId>(
    defaultChain || polkadotConfig.defaultChain
  );
  const [apis, setApis] = useState<Partial<CompositeApi>>({});
  const [clients, setClients] = useState<
    Map<ChainId, ReturnType<typeof createClient>>
  >(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<ChainId, boolean>>(
    new Map()
  );
  const [errorStates, setErrorStates] = useState<Map<ChainId, string | null>>(
    new Map()
  );

  const initializeChain = useCallback(
    async (chainId: ChainId) => {
      // Don't initialize if already connected
      if (apis[chainId]) return;

      setLoadingStates((prev) => new Map(prev).set(chainId, true));
      setErrorStates((prev) => new Map(prev).set(chainId, null));

      try {
        const chainConfig = getChainConfig(polkadotConfig.chains, chainId);

        // Validate that endpoints array exists and has at least one element
        if (!chainConfig.endpoints || !chainConfig.endpoints[0]) {
          throw new Error(
            `Chain ${chainId} (${chainConfig.displayName}) has no endpoints configured. Please add at least one endpoint to the chain configuration.`
          );
        }

        const endpoint = chainConfig.endpoints[0];
        console.log(`Connecting to ${chainConfig.displayName} at ${endpoint}`);

        // Create client with the selected chain
        const client = createClient(
          withPolkadotSdkCompat(getWsProvider(endpoint))
        );

        // Get typed API for the selected chain
        const typedApi = client.getTypedApi(
          polkadotConfig.chains[chainId].descriptor
        ) as ConfiguredChainApi<typeof chainId>;

        setClients((prev) => new Map(prev).set(chainId, client));
        setApis((prev) => ({ ...prev, [chainId]: typedApi }));

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

  // Initialize the default chain on mount
  useEffect(() => {
    initializeChain(defaultChain || polkadotConfig.defaultChain);
  }, [defaultChain, initializeChain]);

  const setApi = (chainId: ChainId) => {
    if (!isValidChainId(polkadotConfig.chains, chainId)) {
      console.error(`Invalid chain ID: ${chainId}`);
      return;
    }

    setCurrentChain(chainId);
    // Initialize the chain if not already connected
    if (!apis[chainId]) {
      initializeChain(chainId);
    }
  };

  const disconnect = () => {
    clients.forEach((client) => client.destroy());
    setClients(new Map());
    setApis({});
    setLoadingStates(new Map());
    setErrorStates(new Map());
    setCurrentChain(defaultChain || polkadotConfig.defaultChain);
  };

  const isConnected = (chainId: ChainId): boolean => {
    return !!apis[chainId];
  };

  const isLoading = (chainId: ChainId): boolean => {
    return loadingStates.get(chainId) || false;
  };

  const currentChainConfig = getChainConfig(
    polkadotConfig.chains,
    currentChain
  );

  const value: PapiContextValue = {
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
    availableChains: getChainIds(polkadotConfig.chains),
  };

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  );
}

export function usePapi(): PapiContextValue {
  const context = useContext(PolkadotContext);

  if (context === undefined) {
    throw new Error("usePapi must be used within a PolkadotProvider");
  }

  return context;
}

// Helper to get properly typed API (maintains backward compatibility)
export function useTypedPolkadotApi(): ConfiguredChainApi<ChainId> | null {
  const { api } = usePapi();
  return api;
}

// Helper to get a specific chain's API (type-safe)
export function usePolkadotApi<T extends ChainId>(
  chainId: T
): ConfiguredChainApi<T> | null {
  const { apis, initializeChain } = usePapi();

  // Auto-initialize the chain if not connected
  useEffect(() => {
    if (!apis[chainId]) {
      initializeChain(chainId);
    }
  }, [chainId, apis, initializeChain]);

  return (apis[chainId] as ConfiguredChainApi<T>) || null;
}

// Type exports
export type { ChainId, ConfiguredChainApi, CompositeApi };
