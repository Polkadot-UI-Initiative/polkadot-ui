import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { ConnectWalletDemo } from "@/registry/dot-ui/blocks/connect-wallet/demo/connect-wallet-demo";
import { WalletSelect } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select.papi";

export default function ConnectWalletDedotPage() {
  return (
    <ConnectWalletDemo
      Provider={PolkadotProvider}
      ConnectWallet={WalletSelect}
      libraryName="papi"
    />
  );
}
