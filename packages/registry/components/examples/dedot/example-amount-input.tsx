import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AmountInput } from "@/registry/polkadot-ui/blocks/amount-input/amount-input.dedot";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.dedot";
import type { ComponentExample } from "../types.examples";
import { Label } from "@/registry/polkadot-ui/ui/label";
import { paseoAssetHub } from "typink";

export const amountInputExample: ComponentExample = {
  name: "Amount Input",
  href: "/docs/components/amount-input",
  code: "amount-input",
  description: "Input component for entering amounts with token selector",
  component: (
    <div className="w-full space-y-6">
      <RequireAccount
        chainId={paseoAssetHub.id}
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
        <div className="space-y-6">
          {/* Multiple tokens with selector */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="amount-multi">
              Multiple Tokens (with selector)
            </Label>
            <AmountInput
              id="amount-multi"
              withTokenSelector
              chainId={paseoAssetHub.id}
              assetIds={[1984, 1337, 7777]}
              className="w-full"
              showMaxButton
              showAvailableBalance
              placeholder="Enter an amount"
            />
          </div>

          {/* Single token - fixed display */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="amount-single">
              Single Token (fixed display with symbol)
            </Label>
            <AmountInput
              id="amount-single"
              withTokenSelector
              chainId={paseoAssetHub.id}
              assetIds={[1984]} // Single token
              className="w-full"
              showMaxButton
              showAvailableBalance
              placeholder="Enter DOT amount"
            />
          </div>

          {/* Simple input with max button */}
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="amount-simple">Simple Input (native token)</Label>
            <AmountInput
              id="amount-simple"
              chainId={paseoAssetHub.id}
              className="w-full"
              showMaxButton
              showAvailableBalance
              placeholder="Enter native token amount"
            />
          </div>
        </div>
      </RequireAccount>
    </div>
  ),
};
