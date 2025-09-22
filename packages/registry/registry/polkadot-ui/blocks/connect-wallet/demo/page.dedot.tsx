import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { ConnectWalletDemo } from "@/registry/polkadot-ui/blocks/connect-wallet/demo/connect-wallet-demo";
import { WalletSelect } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.dedot";

export default function ConnectWalletDedotPage() {
  return (
    <ConnectWalletDemo
      Provider={PolkadotProvider}
      ConnectWallet={WalletSelect}
      libraryName="dedot"
    />
  );
}
