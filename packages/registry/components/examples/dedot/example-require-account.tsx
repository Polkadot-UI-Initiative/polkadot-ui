import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/components/require-account.dedot";
import type { ComponentExample } from "../types.examples";
import { useTypink } from "typink";

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
        <Card className="bg-primary text-background border border-border w-full h-30">
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
  const { connectedAccount } = useTypink();
  return (
    <div>
      <div>Account name: {connectedAccount?.name}</div>
      <div>Wallet: {connectedAccount?.source}</div>
    </div>
  );
}
