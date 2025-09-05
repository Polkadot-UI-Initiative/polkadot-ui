"use client";

import {
  ReactiveDotProvider,
  ChainProvider,
  useAccounts,
  useLazyLoadQuery,
  useConfig,
  useWallets,
  useClient,
  useConnectedWallets,
  useWalletDisconnector,
  useWalletConnector,
} from "@reactive-dot/react";
import { config } from "../reactive-dot.config";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PolkadotClient } from "polkadot-api";
import { WalletAccount } from "@reactive-dot/core/wallets.js";
import { ChainId } from "@reactive-dot/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// export const SUPPORTED_NETWORKS = [
//   paseo,
//   paseoAssetHub,
//   paseoPeople,
//   polkadot,
//   polkadotPeople,
// ];

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
          <SelectedAccountProvider>{children}</SelectedAccountProvider>
        </ChainProvider>
      </ReactiveDotProvider>
    </QueryClientProvider>
  );
}

export function usePapi(
  chainId: ChainId = Object.keys(config.chains)[0] as ChainId
) {
  const runtimeConfig = useConfig();
  const wallets = useWallets();
  const connectedWallets = useConnectedWallets();
  const accounts = useAccounts();
  const client = useClient(chainId ? { chainId } : undefined);
  const { status } = usePapiClientStatus();
  const [, connectWallet] = useWalletConnector();
  const [, disconnectWallet] = useWalletDisconnector();
  const { selectedAccount, setSelectedAccount } = useSelectedAccount();

  return {
    accounts,
    query: useLazyLoadQuery,
    config: runtimeConfig,
    wallets,
    connectedWallets,
    client,
    status,
    connectWallet,
    disconnectWallet,
    selectedAccount,
    setSelectedAccount,
  };
}

// todo use common type for both providers dedot and papi
export enum ClientConnectionStatus {
  NotConnected = "NotConnected", // not yet connected or disconnected
  Connecting = "Connecting", // initial connecting or reconnecting
  Connected = "Connected",
  Error = "Error",
}

// helper hook to get connection status for papi / reactive-dot
export function usePapiClientStatus(chainId?: ChainId) {
  const client = useClient(chainId ? { chainId } : undefined);
  const [status, setStatus] = useState<ClientConnectionStatus>(
    ClientConnectionStatus.NotConnected
  );
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
      // bestBlocks$ emits when connected; treat first emission as connected
      // and propagate errors to status
      subscription = (client as PolkadotClient).bestBlocks$.subscribe({
        next: () => setStatus(ClientConnectionStatus.Connected),
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

  return { status, isConnected, client, error } as const;
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
