import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/components/require-account.papi";
import type { ComponentExample } from "../types.examples";

export const requireAccountExample: ComponentExample = {
  name: "Require Account",
  href: "/docs/components/require-account",
  code: "require-account",
  description: "Render children only when an account is selected",
  component: (
    <div className="w-full space-y-3">
      <RequireAccount
        chainId="paseo"
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal">
                Please select an account to continue.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <Card className="bg-white/5 border border-border w-full">
          <CardHeader>
            <CardTitle>✅ Account Selected</CardTitle>
            <CardContent className="text-xs font-normal">Yay!</CardContent>
          </CardHeader>
        </Card>
      </RequireAccount>
    </div>
  ),
};
