import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { ConnectWalletDemo } from "@/registry/dot-ui/blocks/connect-wallet/demo/connect-wallet-demo";
import { WalletSelect } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select.dedot";

export default function ConnectWalletDedotPage() {
  return (
    <ConnectWalletDemo
      Provider={PolkadotProvider}
      ConnectWallet={WalletSelect}
      libraryName="dedot"
    />
  );
}
