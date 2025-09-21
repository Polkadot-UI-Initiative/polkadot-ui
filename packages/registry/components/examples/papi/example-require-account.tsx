import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/components/require-account.papi";
import type { ComponentExample } from "@/components/examples/types.examples";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

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
          <Card className="bg-primary text-background border border-border w-full h-30">
            <CardHeader>
              <CardTitle>👤 No Account Selected</CardTitle>
              <CardDescription className="text-xs font-normal text-background">
                Please select an account to continue.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <Card className="bg-primary text-background border border-border w-full h-full h-30">
          <CardHeader>
            <CardTitle>✅ Account Selected</CardTitle>
            <CardContent className="text-xs font-normal text-background">
              <Component />
            </CardContent>
          </CardHeader>
        </Card>
      </RequireAccount>
    </div>
  ),
};

function Component() {
  const { selectedAccount } = usePapi();
  return (
    <div>
      <div>Account name: {selectedAccount?.name}</div>
      <div>Wallet: {selectedAccount?.wallet.name}</div>
    </div>
  );
}
