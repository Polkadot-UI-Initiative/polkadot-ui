"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { type ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { DedotClient, WsProvider } from "dedot";
import { type BasePolkadotContextValue } from "@/registry/dot-ui/lib/types.dot-ui";
import {
  type ConfiguredChainApi,
  type CompositeApi,
  type ChainApiType,
} from "@/registry/dot-ui/lib/types.dedot";
import { TypinkProvider, NetworkInfo, useTypink, NetworkId } from "typink";
import { supportedChains } from "../lib/config.dedot";

type MultiClientContextValue = BasePolkadotContextValue<
  ConfiguredChainApi,
  CompositeApi,
  NetworkInfo | null,
  NetworkId
>;

const MultiClientContext = createContext<MultiClientContextValue | undefined>(
  undefined
);

function MultiClientManager({ children }: { children: React.ReactNode }) {
  const {
    client: activeClient,
    ready,
    supportedNetworks,
    network,
    networkId,
    setNetworkId,
    wallets,
    connectWallet,
    accounts,
    setConnectedAccount,
    connectedAccount,
    signer,
    defaultCaller,
  } = useTypink();

  const [apis, setApis] = useState<CompositeApi>({} as CompositeApi);
  const [loadingStates, setLoadingStates] = useState<Map<NetworkId, boolean>>(
    new Map()
  );
  const [errorStates, setErrorStates] = useState<Map<NetworkId, string | null>>(
    new Map()
  );

  // Use refs to get current state without triggering re-renders
  const apisRef = useRef(apis);
  apisRef.current = apis;

  // Create stable initializeChain function
  const initializeChainRef = useRef<(chainId: NetworkId) => Promise<void>>(() =>
    Promise.resolve()
  );

  // Keep Typink's active client inside our map for the current network
  useEffect(() => {
    if (!ready || !activeClient) return;
    setApis((prev) => ({
      ...prev,
      [networkId]: activeClient as unknown as ConfiguredChainApi<
        typeof networkId
      >,
    }));
  }, [ready, activeClient, networkId]);

  const initializeChain = useCallback(
    async (chainId: NetworkId) => {
      if (typeof window === "undefined") return;
      if (apisRef.current[chainId]) return;

      console.log(`Initializing chain: ${chainId}`);
      setLoadingStates((prev) => new Map(prev).set(chainId, true));
      setErrorStates((prev) => new Map(prev).set(chainId, null));

      try {
        const info = supportedNetworks.find((n) => n.id === chainId);
        if (!info) {
          throw new Error(`Unsupported network: ${chainId}`);
        }

        if (!info.providers || info.providers.length < 1) {
          throw new Error(
            `Network ${chainId} (${info.name}) has no providers configured.`
          );
        }

        const provider = new WsProvider(info.providers);
        provider.on("connected", (endpoint: string) => {
          console.log("Connected Endpoint", endpoint);
        });

        await provider.connect();

        const client = await DedotClient.new<ChainApiType<typeof chainId>>({
          provider,
          cacheMetadata: true,
        });

        setApis((prev: CompositeApi) => ({
          ...prev,
          [chainId]: client as ConfiguredChainApi<typeof chainId>,
        }));
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
    [supportedNetworks]
  );

  // Update the ref whenever the function changes
  initializeChainRef.current = initializeChain;

  const setApi = (chainId: NetworkId) => {
    setNetworkId(chainId);
    if (!apisRef.current[chainId]) initializeChain(chainId);
  };

  const disconnect = () => {
    const currentId = networkId as ChainId;
    setApis((prev) => ({ [currentId]: prev[currentId]! }));
    setLoadingStates(new Map());
    setErrorStates(new Map());
  };

  const isConnected = (chainId: NetworkId): boolean => !!apis[chainId];
  const isLoading = (chainId: NetworkId): boolean =>
    loadingStates.get(chainId) || false;

  const value: MultiClientContextValue = {
    currentChain: supportedNetworks.find((n) => n.id === networkId) || null,
    currentChainId: networkId,
    api: apis[networkId] || null,
    error: errorStates.get(networkId) || null,
    apis,
    setApi,
    disconnect,
    isConnected,
    isLoading,
    initializeChain: useCallback((chainId: NetworkId) => {
      return initializeChainRef.current?.(chainId) || Promise.resolve();
    }, []),
    chainName: network?.name || null,
    availableChainIds: useMemo(
      () => supportedNetworks.map((n) => n.id),
      [supportedNetworks]
    ),
    availableChains: supportedNetworks,
    wallets,
    connectWallet,
    accounts,
    setActiveAccount: setConnectedAccount,
    activeAccount: connectedAccount,
    activeSigner: signer,
    defaultCaller,
  };

  return (
    <MultiClientContext.Provider value={value}>
      {children}
    </MultiClientContext.Provider>
  );
}

export function PolkadotProvider({
  children,
  availableChains,
  defaultCaller = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
}: {
  children: React.ReactNode;
  availableChains?: NetworkInfo[];
  defaultCaller?: string;
}) {
  return (
    <TypinkProvider
      supportedNetworks={availableChains || supportedChains}
      defaultCaller={defaultCaller}
    >
      <MultiClientManager>{children}</MultiClientManager>
    </TypinkProvider>
  );
}

export function useDedot(): MultiClientContextValue {
  const context = useContext(MultiClientContext);
  if (!context)
    throw new Error("useDedot must be used within PolkadotProvider");
  return context;
}

export function usePolkadotApi<T extends NetworkId>(
  chainId: T
): ConfiguredChainApi<T> | null {
  const context = useContext(MultiClientContext);
  if (!context)
    throw new Error("usePolkadotApi must be used within PolkadotProvider");

  const { apis, initializeChain } = useDedot();
  const initializeCalledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    if (!initializeCalledRef.current.has(chainId)) {
      initializeCalledRef.current.add(chainId);
      initializeChain(chainId).catch((error) => {
        console.error(`Failed to initialize ${chainId}:`, error);
        // Remove from set so it can be retried
        initializeCalledRef.current.delete(chainId);
      });
    }
  }, [chainId, initializeChain]);

  return apis[chainId] as unknown as ConfiguredChainApi<T> | null;
}
