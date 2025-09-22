import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ConnectWalletDemo } from "@/registry/polkadot-ui/blocks/connect-wallet/demo/connect-wallet-demo";
import { ConnectWallet } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.papi";

export default function ConnectWalletDedotPage() {
  return (
    <ConnectWalletDemo
      Provider={PolkadotProvider}
      ConnectWallet={ConnectWallet}
      libraryName="papi"
    />
  );
}
