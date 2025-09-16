import Link from "next/link";
import { WalletSelect } from "@/registry/polkadot-ui/blocks/connect-wallet/components/connect-wallet.dedot";
import type { ComponentExample } from "../types.examples";

export const walletSelectExample: ComponentExample = {
  name: "Wallet & Account Selection",
  href: "/docs/components/wallet-select",
  code: "wallet-select",
  description: (
    <>
      Wallet connection and account selection. We provide a minimal working
      example of a connection component. If you want more features like e.g.
      WalletConnect, try{" "}
      <Link href="https://www.lunolab.xyz/" className="underline">
        LunoKit
      </Link>
    </>
  ),
  component: (
    <div className="flex flex-col gap-2">
      <WalletSelect variant="default" />
    </div>
  ),
  tsx: `<WalletSelect />`,
};
