"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  polkadotConfig,
  type ChainId,
} from "@/registry/polkadot-ui/lib/config.polkadot-ui";
import {
  getChainIds,
  getChainConfig,
  isValidChainId,
} from "@/registry/polkadot-ui/lib/utils.polkadot-ui";
import { DedotClient, WsProvider } from "dedot";

// Type for dedot API
type DedotApi = DedotClient;

// Create a composite API type that includes all registered chains
type CompositeApi = {
  [K in ChainId]: DedotApi;
};

interface DedotContextValue {
  // Current active chain and its API
  currentChain: ChainId;
  api: DedotApi | null;
  isLoading: (chainId: ChainId) => boolean;
  error: string | null;

  // All APIs for all registered chains
  apis: Partial<CompositeApi>;

  // Function to switch active chain (type-safe)
  setApi: (chainId: ChainId) => void;

  // Connection management
  disconnect: () => void;
  isConnected: (chainId: ChainId) => boolean;

  // Chain information
  chainName: string | null;
  availableChains: ChainId[];
}

const DedotContext = createContext<DedotContextValue | undefined>(undefined);

interface DedotProviderProps {
  children: React.ReactNode;
}

export default function DedotProvider({ children }: DedotProviderProps) {
  const [currentChain, setCurrentChain] = useState<ChainId>(
    polkadotConfig.defaultChain
  );
  const [apis, setApis] = useState<Partial<CompositeApi>>({});
  const [clients, setClients] = useState<Map<ChainId, DedotClient>>(new Map());
  const [loadingStates, setLoadingStates] = useState<Map<ChainId, boolean>>(
    new Map()
  );
  const [errorStates, setErrorStates] = useState<Map<ChainId, string | null>>(
    new Map()
  );

  // Initialize the default chain on mount
  useEffect(() => {
    initializeChain(polkadotConfig.defaultChain);
  }, []);

  const initializeChain = async (chainId: ChainId) => {
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
      setApis((prev) => ({ ...prev, [chainId]: client }));

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
  };

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
    clients.forEach(async (client) => {
      await client.disconnect();
    });
    setClients(new Map());
    setApis({});
    setLoadingStates(new Map());
    setErrorStates(new Map());
    setCurrentChain(polkadotConfig.defaultChain);
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

  const value: DedotContextValue = {
    currentChain,
    api: apis[currentChain] || null,
    error: errorStates.get(currentChain) || null,
    apis,
    setApi,
    disconnect,
    isConnected,
    isLoading,
    chainName: currentChainConfig.displayName,
    availableChains: getChainIds(polkadotConfig.chains),
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

// Type exports (matching polkadot provider)
export type { ChainId, CompositeApi };
