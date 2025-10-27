"use client";

import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import type { ChainId } from "@reactive-dot/core";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import {
  ReactiveDotProvider,
  useAccounts,
  useBlock,
} from "@reactive-dot/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { BlockInfo } from "polkadot-api";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

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
  const [selectedAddress, setSelectedAddress] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_ACCOUNT_KEY);
    } catch {
      return null;
    }
  });

  const accounts = useAccounts({ defer: true });

  const selectedAccount = useMemo(() => {
    return (
      accounts?.find((account) => account.address === selectedAddress) ?? null
    );
  }, [accounts, selectedAddress]);

  const setSelectedAccount = (account: WalletAccount | null) => {
    if (account) {
      localStorage.setItem(SELECTED_ACCOUNT_KEY, account.address);
      setSelectedAddress(account.address);
      return;
    }

    localStorage.removeItem(SELECTED_ACCOUNT_KEY);
    setSelectedAddress(null);
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
