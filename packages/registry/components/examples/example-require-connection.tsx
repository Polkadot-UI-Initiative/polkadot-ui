import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { RequireConnection } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.dedot";
import type { ComponentExample } from "./types";

export const requireConnectionExample: ComponentExample = {
  name: "Require Connection",
  href: "/docs/components/require-connection",
  code: "require-connection",
  description:
    "Conditionally render content based on blockchain connection status",
  component: (
    <div className="w-full space-y-3">
      <RequireConnection
        chainId="paseo"
        fallback={
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>⛓️‍💥 Not Connected to Paseo</CardTitle>
              <CardDescription className="text-xs font-normal">
                Make sure your app is connected to Paseo to continue. This is
                the content that will be displayed when you are not connected to
                Paseo.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <Card className="bg-white/5 border border-border w-full">
          <CardHeader>
            <CardTitle>⚡️ Connected to Paseo</CardTitle>
            <CardDescription className="text-xs font-normal">
              You are connected to Paseo. This is the content that will be
              displayed when you are connected to Paseo.
            </CardDescription>
          </CardHeader>
        </Card>
      </RequireConnection>
    </div>
  ),
};
