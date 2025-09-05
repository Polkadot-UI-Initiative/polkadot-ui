"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";



export function CursorDeepLinkButton() {
  // Use local development paths when in development
  const isDevelopment = process.env.NODE_ENV === "development";

  // Use mcp.json when in development
  const config = isDevelopment
    ? {
        command: "node",
        args: ["packages/cli/dist/index.js", "mcp"],
        env: {
          REGISTRY_URL: "http://localhost:3000",
          AVAILABLE_TOOLS: JSON.stringify({
            add: "Add a component to your project",
            init: "Initialize a new project with Polkadot UI components",
            list: "List all available components",
            telemetry: "Manage telemetry settings and view privacy information",
            mcp: "Start the MCP server for Cursor integration",
            help: "Show help information",
          }),
        },
      }
    : {
        command: "npx",
        args: ["polkadot-ui@latest", "mcp"],
        env: {
          REGISTRY_URL:
            process.env.NEXT_PUBLIC_BASE_URL || "https://dot-ui.com",
          AVAILABLE_TOOLS: JSON.stringify({
            add: "Add a component to your project",
            init: "Initialize a new project with Polkadot UI components",
            list: "List all available components",
            telemetry: "Manage telemetry settings and view privacy information",
            mcp: "Start the MCP server for Cursor integration",
            help: "Show help information",
          }),
        },
      };

  const encodedConfig = Buffer.from(JSON.stringify(config)).toString("base64");
  const params = new URLSearchParams({
    name: "polkadot-ui",
    config: encodedConfig,
  });
  const deepLinkUrl = `cursor://anysphere.cursor-deeplink/mcp/install?${params.toString()}`;

  return (
    <Button variant="outline" asChild>
      <a href={deepLinkUrl} title={`Add MCP Server to Cursor`}>
        <Image
          src="/cursor-logo.png"
          alt="Cursor"
          className="w-4 h-4 rounded-sm"
          width={16}
          height={16}
        />
        Add MCP to Cursor
      </a>
    </Button>
  );
}
