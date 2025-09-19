import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AmountInputWithProvider } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/components/require-account.dedot";
import type { ComponentExample } from "../types.examples";
import { Label } from "@/registry/polkadot-ui/ui/label";

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts",
  component: (
    <div className="w-full space-y-3">
      <RequireAccount
        chainId="paseo"
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue with amount input.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <div className="flex flex-col gap-2 w-full">
          <Label>Amount</Label>
          <AmountInputWithProvider
            withTokenSelector
            chainId="paseoAssetHub"
            assetIds={[1984, 1337, 7777]}
            className="w-full"
            required={false}
            placeholder="Enter an amount"
          />
        </div>
      </RequireAccount>
    </div>
  ),
};
