"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { JsonRpcApi } from '@/registry/polkadot-ui/lib/types.polkadot-ui';
import { ChainId, substrateConfig } from '@/registry/polkadot-ui/lib/config.polkadot-ui';
import { DedotClient, LegacyClient, WsProvider } from 'dedot';
import { PropsWithChildren } from 'react';
import { useLocalStorage, useAsync, useToggle } from 'react-use';
import { SubstrateChain } from '@/registry/polkadot-ui/lib/types.polkadot-ui';
import { getChainConfig, getChainIds } from '@/registry/polkadot-ui/lib/utils.polkadot-ui';

interface PolkadotContextProps {
  jsonRpc: JsonRpcApi;
  api?: DedotClient;
  legacy?: LegacyClient;
  apiReady: boolean;
  currentChain: ChainId;
  chain?: SubstrateChain;
  setChainId: (chainId: ChainId) => void;
  availableChains: ChainId[];
}

const PolkadotContext = createContext<PolkadotContextProps | undefined>(undefined);

export default function PolkadotProvider({ children }: PropsWithChildren) {
  const [currentChain, setCurrentChain] = useLocalStorage<ChainId>('SELECTED_CHAIN', 'paseoAssetHub');
  const [chain, setChain] = useState<SubstrateChain | undefined>();
  const availableChains = getChainIds(substrateConfig.chains);
  
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

  const value: PolkadotContextProps = {
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
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  );
}

export function usePolkadotContext(): PolkadotContextProps {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error('usePolkadotContext must be used within a PolkadotProvider');
  }
  return context;
} 