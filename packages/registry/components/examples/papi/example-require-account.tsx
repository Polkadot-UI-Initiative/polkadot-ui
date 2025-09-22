import { RequireAccount } from "@/registry/polkadot-ui/blocks/require-account/require-account.papi";
import type { ComponentExample } from "@/components/examples/types.examples";
import { usePapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";

export const requireAccountExample: ComponentExample = {
  name: "Require Account",
  href: "/docs/components/require-account",
  code: "require-account",
  description: "Render children only when an account is selected",
  component: <Component />,
  tsx: `import { RequireAccount } from "@/components/require-account.papi";

function MyComponent() {
  return (
    <RequireAccount
      chainId="paseo"
      fallback={
        <div className="border border-accent w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md">
          Please select an account to continue.
        </div>
      }
    >
      <div className="border border-accent w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md flex-col">
        <div>Account name: Jane Doe</div>
        <div>Wallet: Talisman</div>
      </div>
    </RequireAccount>
  );
}`,
};

function Component() {
  const { selectedAccount } = usePapi();
  return (
    <div className="w-full space-y-3">
      <RequireAccount
        chainId="paseo"
        fallback={
          <div className="border border-accent w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md">
            Please select an account to continue.
          </div>
        }
      >
        <div className="border border-accent w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md flex-col">
          <div>Account name: {selectedAccount?.name}</div>
          <div>Wallet: {selectedAccount?.wallet.name}</div>
        </div>
      </RequireAccount>
    </div>
  );
}
