"use client";

import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";
import {
  ReactiveDotProvider,
  useAccounts,
  useBlock,
} from "@reactive-dot/react";
// Derive WalletAccount type from hook return to avoid package type mismatches
type WalletAccount = NonNullable<ReturnType<typeof useAccounts>>[number];
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { BlockInfo } from "polkadot-api";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

const queryClient = new QueryClient();

export function PolkadotProvider({
  children,
}: {
  children: ReactNode;
  chainId?: ChainId;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactiveDotProvider config={config}>
        <SelectedAccountProvider>{children}</SelectedAccountProvider>
      </ReactiveDotProvider>
    </QueryClientProvider>
  );
}

export function useConnectionStatus({ chainId }: { chainId: ChainId }) {
  const blockInfo = useBlock("best", { chainId }) as
    | BlockInfo
    | null
    | undefined;
  const status = blockInfo
    ? ClientConnectionStatus.Connected
    : ClientConnectionStatus.Connecting;

  return { blockInfo: blockInfo ?? null, status } as const;
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

  const accounts = useAccounts({ defer: true });

  // Load selected account from localStorage on mount,
  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_ACCOUNT_KEY);
    if (stored) {
      setSelectedAccountState(
        accounts?.find((account) => account.address === stored) || null
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
