"use client"

import { useState } from 'react';
import { useAsync, useLocalStorage, useToggle } from 'react-use';
import { JsonRpcApi } from '../../../lib/types.polkadot-ui';
import { DedotClient, LegacyClient, WsProvider } from 'dedot';
import { SubstrateChain } from '../../../lib/types.polkadot-ui';

type UseApi = {
  ready: boolean;
  jsonRpc: JsonRpcApi;
  api?: DedotClient;
  legacy?: LegacyClient;
};

export default function useApi(chain?: SubstrateChain): UseApi {
  const [jsonRpc] = useLocalStorage<JsonRpcApi>('SETTINGS/JSON_RPC_API', JsonRpcApi.NEW);
  const [cacheMetadata] = useLocalStorage<boolean>('SETTINGS/CACHE_METADATA',true);

  const [ready, setReady] = useToggle(false);
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
      await legacy.disconnect()
    }

    setReady(false);

    const provider = new WsProvider(chain.rpcUrls);
    provider.on('connected', (endpoint) => {
    console.log('Connected Endpoint', endpoint);
    })

    if (jsonRpc == JsonRpcApi.LEGACY) {
      setLegacy(await LegacyClient.new({ provider, cacheMetadata }));
      setApi(undefined);
    } else {
      setApi(await DedotClient.new({ provider, cacheMetadata }));
      setLegacy(undefined)
    }

    setReady(true);
  }, [jsonRpc, chain?.rpcUrls]);

  return { ready, api, legacy, jsonRpc: jsonRpc! };
}