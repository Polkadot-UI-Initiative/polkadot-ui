"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { JsonRpcApi } from '../lib/types.polkadot-ui';
import { ChainId, substrateConfig } from '../lib/config.polkadot-ui';
import { DedotClient, LegacyClient, WsProvider } from 'dedot';
import { PropsWithChildren } from 'react';
import { useLocalStorage, useAsync, useToggle } from 'react-use';
import { SubstrateChain } from '../lib/types.polkadot-ui';
import { getChainConfig, getChainIds } from '../lib/utils.polkadot-ui';

interface ApiContextProps {
  jsonRpc: JsonRpcApi;
  api?: DedotClient;
  legacy?: LegacyClient;
  apiReady: boolean;
  currentChain: ChainId;
  chain?: SubstrateChain;
  setChainId: (chainId: ChainId) => void;
  availableChains: ChainId[];
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export default function ApiProvider({ children }: PropsWithChildren) {
  const [currentChain, setCurrentChain] = useLocalStorage<ChainId>('SELECTED_CHAIN', 'paseoAssetHub');
  const [chain, setChain] = useState<SubstrateChain | undefined>();
  const availableChains = getChainIds(substrateConfig.chains);
  
  // API connection logic (moved from use-api.ts)
  const [jsonRpc] = useLocalStorage<JsonRpcApi>('SETTINGS/JSON_RPC_API', JsonRpcApi.NEW);
  const [cacheMetadata] = useLocalStorage<boolean>('SETTINGS/CACHE_METADATA', true);
  const [apiReady, setApiReady] = useToggle(false);
  const [api, setApi] = useState<DedotClient>();
  const [legacy, setLegacy] = useState<LegacyClient>();

  useAsync(async () => {
    if (!chain) {
      return;
    }

    if (api) {
      await api.disconnect();
    }

    if (legacy) {
      await legacy.disconnect();
    }

    setApiReady(false);

    const provider = new WsProvider(chain.rpcUrls);
    provider.on('connected', (endpoint) => {
      console.log('Connected Endpoint', endpoint);
    });

    if (jsonRpc === JsonRpcApi.LEGACY) {
      const legacyClient = await LegacyClient.new({ provider, cacheMetadata });
      await legacyClient.connect();
      setLegacy(legacyClient);
      setApi(undefined);
    } else {
      const apiClient = await DedotClient.new({ provider, cacheMetadata });
      await apiClient.connect();
      setApi(apiClient);
      setLegacy(undefined);
    }

    setApiReady(true);
  }, [jsonRpc, chain?.rpcUrls]);

  useEffect(() => {
    if (currentChain && availableChains.includes(currentChain)) {
      setChain(getChainConfig(substrateConfig.chains, currentChain));
    }
  }, [currentChain, availableChains]);

  const setChainId = (chainId: ChainId) => {
    setCurrentChain(chainId);
    setChain(getChainConfig(substrateConfig.chains, chainId));
  };

  const value: ApiContextProps = {
    jsonRpc: jsonRpc!,
    api,
    legacy,
    apiReady,
    currentChain: currentChain || 'paseoAssetHub',
    chain,
    setChainId,
    availableChains,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext(): ApiContextProps {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}