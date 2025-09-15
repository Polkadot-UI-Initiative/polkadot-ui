import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RequireConnection } from "@/registry/polkadot-ui/blocks/require-connection/components/require-connection.papi";
import type { ComponentExample } from "../types.examples";

export const requireConnectionExample: ComponentExample = {
  name: "Require Connection",
  href: "/docs/components/require-connection",
  code: "require-connection",
  description: "Render content based on blockchain connection status",
  component: (
    <div className="w-full space-y-3">
      <RequireConnection
        chainId="paseo"
        fallback={
          <Card className="bg-primary text-background border border-border w-full h-30">
            <CardHeader>
              <CardTitle>⛓️‍💥 Not Connected to Paseo</CardTitle>
              <CardDescription className="text-xs font-normal text-background">
                Make sure your app is connected to Paseo to continue.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <Card className="bg-primary text-background border border-border w-full h-full h-30">
          <CardHeader>
            <CardTitle>⚡️ Connected to Paseo</CardTitle>
            <CardDescription className="text-xs font-normal text-background">
              Content you see when you are connected to Paseo.
            </CardDescription>
          </CardHeader>
        </Card>
      </RequireConnection>
    </div>
  ),
};
