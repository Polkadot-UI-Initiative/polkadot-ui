import { BalanceDisplay } from "@/registry/polkadot-ui/blocks/balance-display/balance-display.dedot";
import type { ComponentExample } from "../types.examples";
import { polkadotAssetHub, useTypink } from "typink";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";

export const balanceDisplayExample: ComponentExample = {
  name: "Balance Display",
  href: "/docs/components/balance-display",
  code: "balance-display",
  description: "Formatted on-chain balance with fiat value",
  component: (
    <ClientOnly>
      <BalanceDisplayComponent />
    </ClientOnly>
  ),
};

export function BalanceDisplayComponent() {
  const [accountAddress, setAccountAddress] = useState<string>(
    "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
  );
  const { connectedAccount } = useTypink();

  console.log(accountAddress);
  console.log(connectedAccount);

  const { data: price } = useSubscanDotPrice();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Button
            size="sm"
            onClick={() =>
              setAccountAddress(
                "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
              )
            }
            variant={
              accountAddress ===
              "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk"
                ? "default"
                : "secondary"
            }
          >
            Polkadot Treasury
          </Button>
          <Button
            size="sm"
            disabled={!connectedAccount}
            onClick={() => setAccountAddress(connectedAccount?.address ?? "")}
            variant={
              connectedAccount?.address === accountAddress
                ? "default"
                : "secondary"
            }
          >
            Connected Account
          </Button>
        </div>
        {/* DOT price: {price} */}
        <BalanceDisplay
          tokenId={"native"}
          compareTokenId={1337} //USDC
          networkId={polkadotAssetHub.id}
          precision={2}
          tokenConversionRate={price}
          accountAddress={accountAddress}
        />
        <BalanceDisplay
          tokenId={1337}
          compareTokenId={"native"}
          networkId={polkadotAssetHub.id}
          precision={4}
          tokenConversionRate={price}
          accountAddress={accountAddress}
        />
      </div>
    </>
  );
}
