import Link from "next/link";
import { WalletSelect } from "@/registry/polkadot-ui/blocks/connect-wallet/components/connect-wallet.papi";
import type { ComponentExample } from "../types.examples";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
      <Suspense
        fallback={
          <Button disabled>
            Loading Accounts <Loader2 className="animate-spin" />
          </Button>
        }
      >
        <WalletSelect />
      </Suspense>
    </div>
  ),
};
