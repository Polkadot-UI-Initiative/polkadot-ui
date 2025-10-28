import Link from "next/link";
import { ConnectWallet } from "@/registry/polkadot-ui/blocks/connect-wallet/connect-wallet.papi";
import type { ComponentExample } from "@/components/examples/types.examples";

export const connectWalletExample: ComponentExample = {
  name: "Wallet & Account Selection",
  href: "/docs/components/connect-wallet",
  code: "wallet-select",
  description: (
    <>
      Wallet connection and account selection. We provide a minimal working
      example of a connection component. If you want more features like e.g.
      WalletConnect, try{" "}
      <Link href="https://dotconnect.dev/" className="underline">
        dotConnect
      </Link>{" "}
      (papi) or{" "}
      <Link href="https://www.lunolab.xyz/" className="underline">
        LunoKit
      </Link>{" "}
      (dedot)
    </>
  ),
  component: (
    <div className="flex flex-col gap-2">
      <ConnectWallet variant="default" placeholder="Connect Wallet" />
    </div>
  ),
  tsx: `import { ConnectWallet } from "@/components/connect-wallet.papi";

<ConnectWallet />`,
};
