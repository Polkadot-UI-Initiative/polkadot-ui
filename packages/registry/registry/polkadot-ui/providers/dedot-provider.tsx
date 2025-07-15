"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { JsonRpcApi } from '@/registry/polkadot-ui/lib/types.polkadot-ui';
import { ChainId, polkadotConfig } from '@/registry/polkadot-ui/lib/config.polkadot-ui';
import { DedotClient, LegacyClient, WsProvider } from 'dedot';
import { PropsWithChildren } from 'react';
import { useLocalStorage, useAsync, useToggle } from 'react-use';
import { ChainConfig } from '@/registry/polkadot-ui/lib/types.polkadot-ui';
import { getChainConfig, getChainIds } from '@/registry/polkadot-ui/lib/utils.polkadot-ui';

interface DedotContextProps {
  // Current active chain and its API
  currentChain: ChainId;
  api?: DedotClient | null;
  legacy?: LegacyClient | null;
  jsonRpc: JsonRpcApi;
  apiReady: boolean;
  isLoading: boolean;
  error: string | null;

  // API for switching active chain
  setApi: (chainId: ChainId) => void;
  
  // API for connection management
  disconnect: () => Promise<void>;
  isConnected: (chainId: ChainId) => boolean;

  // Chain info
  chainName: string | null;
  availableChains: ChainId[];
}

const DedotContext = createContext<DedotContextProps | undefined>(undefined);

export default function DedotProvider({ children }: PropsWithChildren) {
  const [chain, setChain] = useState<ChainConfig | undefined>();
  const [currentChain, setCurrentChain] = useState<ChainId>(
    polkadotConfig.defaultChain
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const availableChains = getChainIds(polkadotConfig.chains);
  
  const [jsonRpc] = useLocalStorage<JsonRpcApi>('SETTINGS/JSON_RPC_API', JsonRpcApi.NEW);
  const [apiReady, setApiReady] = useToggle(false);
  const [api, setApiClient] = useState<DedotClient>();
  const [legacy, setLegacy] = useState<LegacyClient>();

  const currentChainConfig = getChainConfig(
    polkadotConfig.chains,
    currentChain
  );

  useAsync(async () => {
        if (!chain) {
        return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (api) {
            await api.disconnect();
            }

            if (legacy) {
            await legacy.disconnect();
            }

            setApiReady(false);

            const provider = new WsProvider(chain.endpoints);
            provider.on('connected', (endpoint: string) => {
            console.log('Connected Endpoint', endpoint);
            });

            await provider.connect();

            if (jsonRpc === JsonRpcApi.LEGACY) {
            const legacyClient = await LegacyClient.new({ provider, cacheMetadata: true });
            setLegacy(legacyClient);
            setApiClient(undefined);
            } else {
            const apiClient = await DedotClient.new({ provider, cacheMetadata: true });
            setApiClient(apiClient);
            setLegacy(undefined);
            }

            setApiReady(true);
        } catch (err) {
            console.error(`Failed to initialize ${currentChain}:`, err);
            setError(err instanceof Error ? err.message : "Failed to initialize Polkadot API");
        } finally {
            setIsLoading(false);
        }
    }, [jsonRpc, chain?.endpoints]);

  useEffect(() => {
    if (currentChain && availableChains.includes(currentChain)) {
      setChain(getChainConfig(polkadotConfig.chains, currentChain));
    }
  }, [currentChain, availableChains]);

  const isConnected = (chainId: ChainId) => {
    return currentChain === chainId;
  };

  const disconnect = async () => {
    if (api) {
      await api.disconnect();
    }
    if (legacy) {
      await legacy.disconnect();
    }

    setApiClient(undefined);
    setLegacy(undefined);
    setApiReady(false);

    setCurrentChain(polkadotConfig.defaultChain);
  };

  const setApi = (chainId: ChainId) => {
    setCurrentChain(chainId);
  };

  const value: DedotContextProps = {
    currentChain,
    api,
    legacy,
    setApi,
    disconnect,
    isConnected,
    isLoading,
    error: error || null,
    jsonRpc: jsonRpc!,
    apiReady,
    chainName: currentChainConfig.displayName,
    availableChains,
  };

  return (
    <DedotContext.Provider value={value}>
      {children}
    </DedotContext.Provider>
  );
}

export function useDedot(): DedotContextProps {
  const context = useContext(DedotContext);
  if (!context) {
    throw new Error('useDedotContext must be used within a DedotProvider');
  }
  return context;
} 