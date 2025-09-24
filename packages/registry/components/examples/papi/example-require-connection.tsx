import { RequireConnection } from "@/registry/polkadot-ui/blocks/require-connection/require-connection.papi";
import type { ComponentExample } from "@/components/examples/types.examples";

export const requireConnectionExample: ComponentExample = {
  name: "Require Connection",
  href: "/docs/components/require-connection",
  code: "require-connection",
  description: "Render children only when a connection is established",
  component: (
    <div className="w-full space-y-3">
      <RequireConnection
        chainId={"paseo"}
        fallback={
          <div className="border border-foreground/10 w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md p-4 text-center">
            Make sure your app is connected to Paseo to continue. This is the
            content that will be displayed when you are not connected to Paseo.
          </div>
        }
      >
        <div className="border border-foreground/10 w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md p-4 text-center">
          ✅ You are connected to Paseo. This is the content that will be
          displayed when you are connected to Paseo.
        </div>
      </RequireConnection>
    </div>
  ),
  tsx: `import { RequireConnection } from "@/components/require-connection.papi";

<RequireConnection
  chainId="paseo"
  fallback={
    <div className="border border-foreground/10 w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md p-4 text-center">
      Make sure your app is connected to Paseo to continue. This is the
      content that will be displayed when you are not connected to Paseo.
    </div>
  }
>
  <div className="border border-foreground/10 w-full h-48 bg-background text-xs font-normal text-foreground flex items-center justify-center rounded-md p-4 text-center">
    ✅ You are connected to Paseo. This is the content that will be
    displayed when you are connected to Paseo.
  </div>
</RequireConnection>`,
};
