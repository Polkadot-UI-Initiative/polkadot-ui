"use client";

import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import {
  ChainProvider,
  ReactiveDotProvider,
  useAccounts,
  useClient,
  useConfig,
  useConnectedWallets,
  useLazyLoadQuery,
  useWalletConnector,
  useWalletDisconnector,
  useWallets,
} from "@reactive-dot/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { BlockInfo, PolkadotClient } from "polkadot-api";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedChainId = keyof typeof config.chains;

const queryClient = new QueryClient();

export function PolkadotProvider({
  children,
  chainId = "paseo",
}: {
  children: ReactNode;
  chainId?: SupportedChainId;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactiveDotProvider config={config}>
        <ChainProvider chainId={chainId}>
          <SelectedAccountProvider>
            <PapiProvider>{children}</PapiProvider>
          </SelectedAccountProvider>
        </ChainProvider>
      </ReactiveDotProvider>
    </QueryClientProvider>
  );
}

// Provider-scoped context for PAPI values
interface PapiContextValue {
  accounts: ReturnType<typeof useAccounts>;
  query: typeof useLazyLoadQuery;
  config: ReturnType<typeof useConfig>;
  wallets: ReturnType<typeof useWallets>;
  connectedWallets: ReturnType<typeof useConnectedWallets>;
  client: ReturnType<typeof useClient>;
  status: ClientConnectionStatus;
  blockInfo: BlockInfo | null;
  connectWallet: ReturnType<typeof useWalletConnector>[1];
  disconnectWallet: ReturnType<typeof useWalletDisconnector>[1];
  selectedAccount: WalletAccount | null;
  setSelectedAccount: (account: WalletAccount | null) => void;
}

const PapiContext = createContext<PapiContextValue | null>(null);

function PapiProvider({ children }: { children: ReactNode }) {
  const runtimeConfig = useConfig();
  const wallets = useWallets();
  const connectedWallets = useConnectedWallets();
  const accounts = useAccounts();
  const client = useClient();
  const { status, blockInfo } = usePapiClientStatus();
  const [, connectWallet] = useWalletConnector();
  const [, disconnectWallet] = useWalletDisconnector();
  const { selectedAccount, setSelectedAccount } = useSelectedAccount();

  const value = useMemo<PapiContextValue>(
    () => ({
      accounts,
      query: useLazyLoadQuery,
      config: runtimeConfig,
      wallets,
      connectedWallets,
      client,
      status,
      blockInfo,
      connectWallet,
      disconnectWallet,
      selectedAccount,
      setSelectedAccount,
    }),
    [
      accounts,
      runtimeConfig,
      wallets,
      connectedWallets,
      client,
      status,
      blockInfo,
      connectWallet,
      disconnectWallet,
      selectedAccount,
      setSelectedAccount,
    ]
  );

  return <PapiContext.Provider value={value}>{children}</PapiContext.Provider>;
}

export function usePapi(chainId?: ChainId) {
  const ctx = useContext(PapiContext);
  if (!ctx) throw new Error("usePapi must be used within PolkadotProvider");

  const chainClient = useClient(chainId ? { chainId } : undefined);
  const { status, blockInfo } = usePapiClientStatus(chainId);

  return chainId ? { ...ctx, client: chainClient, status, blockInfo } : ctx;
}

function usePapiClientStatus(chainId?: ChainId) {
  const client = useClient(chainId ? { chainId } : undefined);
  const [status, setStatus] = useState<ClientConnectionStatus>(
    ClientConnectionStatus.NotConnected
  );
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setError(null);

    if (!client) {
      setStatus(ClientConnectionStatus.NotConnected);
      return;
    }

    setStatus(ClientConnectionStatus.Connecting);

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      subscription = (client as PolkadotClient).bestBlocks$.subscribe({
        next: (blockInfo: BlockInfo[]) => {
          setStatus(ClientConnectionStatus.Connected);
          setBlockInfo(blockInfo[0]);
        },
        error: (e) => {
          setError(e instanceof Error ? e : new Error(String(e)));
          setStatus(ClientConnectionStatus.Error);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setStatus(ClientConnectionStatus.Error);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [client]);

  const isConnected = useMemo(
    () => status === ClientConnectionStatus.Connected,
    [status]
  );

  return { status, isConnected, client, error, blockInfo } as const;
}

// selectedaccount provider, reactive-dot does not provide this
interface SelectedAccountContext {
  selectedAccount: WalletAccount | null;
  setSelectedAccount: (account: WalletAccount | null) => void;
}

const SelectedAccountContext = createContext<SelectedAccountContext>({
  selectedAccount: null,
  setSelectedAccount: () => {},
});

const SELECTED_ACCOUNT_KEY = "polkadot:selected-account";

export function SelectedAccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedAccount, setSelectedAccountState] =
    useState<WalletAccount | null>(null);

  const accounts = useAccounts();

  // Load selected account from localStorage on mount,
  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_ACCOUNT_KEY);
    if (stored) {
      setSelectedAccountState(
        accounts.find((account) => account.address === stored) || null
      );
    }
  }, [accounts]);

  const setSelectedAccount = (account: WalletAccount | null) => {
    setSelectedAccountState(account);
    if (account) {
      localStorage.setItem(SELECTED_ACCOUNT_KEY, account.address);
    } else {
      localStorage.removeItem(SELECTED_ACCOUNT_KEY);
    }
  };

  return (
    <SelectedAccountContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </SelectedAccountContext.Provider>
  );
}

export const useSelectedAccount = () => {
  const context = useContext(SelectedAccountContext);
  if (!context) {
    throw new Error(
      "useSelectedAccount must be used within a SelectedAccountProvider"
    );
  }
  return context;
};
