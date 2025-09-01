import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { RequireAccount } from "@/registry/dot-ui/blocks/require-account/components/require-account.dedot";
import type { ComponentExample } from "./types";
import { useTypink } from "typink";
import { truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";

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
            <CardDescription className="text-xs font-normal">
              <Component />
            </CardDescription>
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
