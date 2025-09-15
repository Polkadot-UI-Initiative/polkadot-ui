"use client";

import { ReactiveDotProvider, ChainProvider } from "@reactive-dot/react";
import { config } from "../reactive-dot.config";
import type { ReactNode } from "react";
import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WalletAccount } from "@reactive-dot/core/wallets.js";
import { ChainId } from "@reactive-dot/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ExtensionProvider } from "./polkadot-extension-provider.papi";

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
          <ExtensionProvider>
            <PapiProviderCore chainId={chainId as ChainId}>
              {children}
            </PapiProviderCore>
          </ExtensionProvider>
        </ChainProvider>
      </ReactiveDotProvider>
    </QueryClientProvider>
  );
}

export enum ClientConnectionStatus {
  NotConnected = "NotConnected", // not yet connected or disconnected
  Connecting = "Connecting", // initial connecting or reconnecting
  Connected = "Connected",
  Error = "Error",
}

interface PapiContextValue {
  config: typeof config;
  supportedNetworks: Array<
    { id: ChainId } & (typeof config.chains)[keyof typeof config.chains]
  >;
}

const PapiContext = createContext<PapiContextValue | undefined>(undefined);

function PapiProviderCore({
  children,
}: {
  chainId: ChainId;
  children: React.ReactNode;
}) {
  const supportedNetworks = useMemo(
    () =>
      Object.entries(config.chains).map(([id, chain]) => ({
        id: id as ChainId,
        ...chain,
      })),
    []
  ) as Array<
    { id: ChainId } & (typeof config.chains)[keyof typeof config.chains]
  >;

  const ctx: PapiContextValue = {
    config,
    supportedNetworks,
  };

  return <PapiContext.Provider value={ctx}>{children}</PapiContext.Provider>;
}

export function usePapi() {
  const ctx = useContext(PapiContext);
  if (!ctx) throw new Error("usePapi must be used within PolkadotProvider");
  return ctx;
}
