import { NetworkInfo, useTypink, useBalances, Balances } from "typink";
import {
  AccountManagementHookProps,
  ClientHookProps,
  WalletManagementHookProps,
} from "@/registry/dot-ui/lib/types.dedot";

export interface PolkadotHooks {
  useClient: () => ClientHookProps;
  useActiveChain: () => NetworkInfo;
  useSupportedChains: () => NetworkInfo[];
  useAccountManagement: () => AccountManagementHookProps;
  useWalletManagement: () => WalletManagementHookProps;
  usePolkadotBalances: (addresses: string[]) => Balances;
}

export function useClient(): ClientHookProps {
  const { client } = useTypink();
  return { client };
}

export function useActiveChain(): NetworkInfo {
  const { network: activeChain } = useTypink();
  return activeChain;
}

export function useSupportedChains(): NetworkInfo[] {
  const { supportedNetworks: supportedChains } = useTypink();
  return supportedChains || [];
}

// export function useAccountManagement(): AccountManagementHookProps {
//   const { accounts, connectedAccount: activeAccount, setConnectedAccount: setActiveAccount } = useTypink();
//   return { accounts, activeAccount, setActiveAccount };
// }

// export function useWalletManagement(): WalletManagementHookProps {
//   const { wallets, connectWallet, disconnect,  connectedWalletId, signer: activeSigner} = useTypink();
//   return { wallets, connectWallet, disconnect, connectedWalletId, activeSigner};
// }

export function usePolkadotBalances(addresses: string[]): Balances {
  const balances = useBalances(addresses);
  return balances;
}
