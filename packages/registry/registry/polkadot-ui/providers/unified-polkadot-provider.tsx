"use client";

import { createContext, useContext } from "react";
import {
  PolkadotProvider as OriginalPapiProvider,
  usePapi as usePapiProvider,
  type ConfiguredChainApi,
} from "./papi-provider";
import DedotProvider, { useDedot as useDedotProvider } from "./dedot-provider";
import type { ChainId } from "@/registry/polkadot-ui/lib/config.polkadot-ui";
import type { DedotClient } from "dedot";

// API type selection
export type ApiType = "papi" | "dedot";

// Union type for API instances
export type PolkadotApi = ConfiguredChainApi<ChainId> | DedotClient;

// Union type for APIs collection
export type PolkadotApis = Partial<Record<ChainId, PolkadotApi>>;

// Unified context interface that works with both providers
export interface UnifiedPolkadotContextValue {
  // Current active chain and its API
  currentChain: ChainId;
  api: PolkadotApi | null;
  isLoading: (chainId: ChainId) => boolean;
  error: string | null;

  // All APIs for all registered chains
  apis: PolkadotApis;

  // Function to switch active chain (type-safe)
  setApi: (chainId: ChainId) => void;

  // Connection management
  disconnect: () => void;
  isConnected: (chainId: ChainId) => boolean;

  // Chain information
  chainName: string | null;
  availableChains: ChainId[];
}

// Context for the API type
const ApiTypeContext = createContext<ApiType>("papi");

interface UnifiedPolkadotProviderProps {
  children: React.ReactNode;
  api?: ApiType; // Default to "papi"
}

export function PolkadotProvider({
  children,
  api = "papi",
}: UnifiedPolkadotProviderProps) {
  return (
    <ApiTypeContext.Provider value={api}>
      {api === "papi" ? (
        <OriginalPapiProvider>
          <PapiWrapper>{children}</PapiWrapper>
        </OriginalPapiProvider>
      ) : (
        <DedotProvider>
          <DedotWrapper>{children}</DedotWrapper>
        </DedotProvider>
      )}
    </ApiTypeContext.Provider>
  );
}

// Wrapper components that always call their respective hooks
function PapiWrapper({ children }: { children: React.ReactNode }) {
  const context = usePapiProvider();

  // Convert papi context to unified format
  const unifiedContext: UnifiedPolkadotContextValue = {
    ...context,
  };

  return (
    <UnifiedContextProvider value={unifiedContext}>
      {children}
    </UnifiedContextProvider>
  );
}

function DedotWrapper({ children }: { children: React.ReactNode }) {
  const context = useDedotProvider();

  // Convert dedot context to unified format
  const unifiedContext: UnifiedPolkadotContextValue = {
    ...context,
  };

  return (
    <UnifiedContextProvider value={unifiedContext}>
      {children}
    </UnifiedContextProvider>
  );
}

// Create the unified context
const UnifiedContext = createContext<UnifiedPolkadotContextValue | undefined>(
  undefined
);

// Context provider that normalizes the interface
function UnifiedContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: UnifiedPolkadotContextValue;
}) {
  return (
    <UnifiedContext.Provider value={value}>{children}</UnifiedContext.Provider>
  );
}

// Unified hook that works with both providers
export function usePolkadot(): UnifiedPolkadotContextValue {
  const context = useContext(UnifiedContext);
  if (!context) {
    throw new Error("usePolkadot must be used within a PolkadotProvider");
  }
  return context;
}

// Hook to get the current API type
export function useApiType(): ApiType {
  return useContext(ApiTypeContext);
}

// Type exports
export type { ChainId };
