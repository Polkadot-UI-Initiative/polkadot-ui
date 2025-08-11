"use client";

import { createContext, useContext } from "react";
import { ClientProviderProps, ClientProvider, useClient, popTestnet, shibuyaTestnet } from "typink";
import { ClientContextProps } from "typink/providers/ClientProvider";
import { WalletSetupContextProps, WalletSetupProviderProps, WalletSetupProvider, useWalletSetup } from "typink/providers/WalletSetupProvider";
import { WalletContextProps, useWallet } from "typink/providers/WalletProvider";
import { TypinkEventsContextProps, TypinkEventsProvider, useTypinkEvents } from "typink/providers/TypinkEventsProvider";
import { ContractDeployment, SubstrateAddress } from "typink/types";

export interface TypinkContextProps
  extends ClientContextProps,
    WalletSetupContextProps,
    WalletContextProps,
    TypinkEventsContextProps {
  deployments: ContractDeployment[];
  defaultCaller: SubstrateAddress;
}

export const TypinkContext = createContext<TypinkContextProps | undefined>(undefined);

export interface TypinkProviderProps extends ClientProviderProps, WalletSetupProviderProps {
  deployments?: ContractDeployment[];
  defaultCaller?: SubstrateAddress;
}

export type TypinkProviderInnerProps = Omit<TypinkProviderProps, 'appName'>;

// TODO: this should be optional after next release of typink
const DEFAULT_CALLER = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"; // Alice
const SUPPORTED_NETWORKS = [popTestnet, shibuyaTestnet];

function TypinkProviderInner({
  children,
  deployments = [],
  defaultCaller = DEFAULT_CALLER,
}: TypinkProviderInnerProps) {
  const clientContext = useClient();
  const walletSetupContext = useWalletSetup();
  const walletContext = useWallet();
  const typinkEventsContext = useTypinkEvents();

  return (
    <TypinkContext.Provider
      value={{
        ...typinkEventsContext,
        ...clientContext,
        ...walletSetupContext,
        ...walletContext,
        deployments,
        defaultCaller,
      } as TypinkContextProps}>
      {children}
    </TypinkContext.Provider>
  );
}

/**
 * TypinkProvider is the main provider component for the Typink application.
 * It wraps other providers (WalletSetupProvider, ClientProvider ...) to provide a complete context for the application.
 *
 * @param props - The properties for the TypinkProvider component
 * @param props.children - The child components to be rendered within the provider
 * @param props.deployments - An array of contract deployments (optional, defaults to empty array)
 * @param props.defaultCaller - The default substrate address to be used as the caller (optional, defaults to ALICE address)
 * @param props.defaultNetworkId - The default network ID to be used
 * @param props.cacheMetadata - Whether to cache metadata or not (default: false)
 * @param props.supportedNetworks - An array of supported networks
 * @param props.signer - The signer to be used for signing transactions. If using an external wallet connector
 *                       (e.g., SubConnect or Talisman Connect), pass this prop to override Typink's
 *                       internal signer management.
 * @param props.connectedAccount - The currently connected account. If using an external wallet connector,
 *                                 pass this prop to inform Typink which account to interact with or
 *                                 sign transactions.
 *
 * Note: By default, Typink manages signer and connectedAccount internally when using the built-in
 * Typink Wallet Connector. For external wallet connectors, you must provide both signer and
 * connectedAccount props to ensure proper functionality.
 */
export function TypinkProvider({
  children,
  deployments = [],
  defaultCaller = DEFAULT_CALLER,
  defaultNetworkId,
  cacheMetadata = false,
  supportedNetworks = SUPPORTED_NETWORKS,
  signer,
  connectedAccount,
  wallets,
  appName,
}: TypinkProviderProps) {
  return (
    <WalletSetupProvider signer={signer} connectedAccount={connectedAccount} wallets={wallets} appName={appName}>
      <ClientProvider
        defaultNetworkId={defaultNetworkId}
        cacheMetadata={cacheMetadata}
        supportedNetworks={supportedNetworks}>
        <TypinkEventsProvider>
          <TypinkProviderInner deployments={deployments} defaultCaller={defaultCaller}>
            {children}
          </TypinkProviderInner>
        </TypinkEventsProvider>
      </ClientProvider>
    </WalletSetupProvider>
  );
}

export function usePolkadotWallet() {
    const context = useContext(TypinkContext);

    if (!context) {
        throw new Error("usePolkadotWallet must be used within a TypinkProvider");
    }

    return context;
}