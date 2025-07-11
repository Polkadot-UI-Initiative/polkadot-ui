"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { JsonRpcApi } from '../lib/types.polkadot-ui';
import { ChainId, substrateConfig } from '../lib/config.polkadot-ui';
import { DedotClient, LegacyClient } from 'dedot';
import { PropsWithChildren } from 'react';
import { useLocalStorage } from 'react-use';
import { SubstrateChain } from '../lib/types.polkadot-ui';
import { getChainConfig, getChainIds } from '../lib/utils.polkadot-ui';
import useApi from '../blocks/block-number/hooks/use-api';
import { useWalletContext } from './wallet-provider';

interface ApiContextProps {
  jsonRpc: JsonRpcApi;
  api?: DedotClient;
  legacy?: LegacyClient;
  apiReady: boolean;
  chain: SubstrateChain;
  setChainId: (id: ChainId) => void;
  currentChain: ChainId;
  availableChains: ChainId[];
}

const DEFAULT_CHAIN = substrateConfig.chains.paseo;

export const ApiContext = createContext<ApiContextProps>({
  apiReady: false,
  jsonRpc: JsonRpcApi.NEW,
  chain: DEFAULT_CHAIN,
  currentChain: DEFAULT_CHAIN.network,
  availableChains: getChainIds(substrateConfig.chains),
  setChainId: () => {},
});


// This is a wrapper for the api provider.
// It should be wrapped around the app to provide the api context to the app, below the WalletProvider.
export default function ApiProvider({ children }: PropsWithChildren) {
  const { injectedApi } = useWalletContext();
  const [chainId, setChainId] = useLocalStorage<ChainId>('SELECTED_CHAIN_ID');
  const [chain, setChain] = useState<SubstrateChain>();
  const { ready, api, legacy, jsonRpc } = useApi(chain);

  useEffect(() => {
    if (chainId) {
      setChain(getChainConfig(substrateConfig.chains, chainId as ChainId))
    } else {
      setChain(DEFAULT_CHAIN)
    }
  }, [chainId]);

  useEffect(() => {
    api?.setSigner(injectedApi?.signer as any);
    legacy?.setSigner(injectedApi?.signer as any);
  }, [injectedApi, api, legacy])

  const value: ApiContextProps = {  
    api,
    legacy,
    jsonRpc,
    apiReady: ready,
    chain: chain!,
    setChainId,
    currentChain: chainId!,
    availableChains: getChainIds(substrateConfig.chains),
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext(): ApiContextProps {
  const context = useContext(ApiContext);

  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return context;
}