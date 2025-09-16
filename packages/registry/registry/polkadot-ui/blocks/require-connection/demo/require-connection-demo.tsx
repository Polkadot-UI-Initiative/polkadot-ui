"use client";

import { Button } from "@/registry/polkadot-ui/ui/button";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { type ReactNode, useState } from "react";

interface RequireConnectionDemoProps<TChainId extends string> {
  Provider: React.ComponentType<{ children: ReactNode }>;
  RequireConnection: React.ComponentType<{
    chainId: TChainId;
    children: ReactNode;
    fallback: ReactNode;
    loadingFallback?: ReactNode;
  }>;
  libraryName: string;
}

export default function RequireConnectionDemo<TChainId extends string>({
  Provider,
  RequireConnection,
  libraryName,
}: RequireConnectionDemoProps<TChainId>) {
  const [selectedChain, setSelectedChain] = useState<TChainId>(
    "paseo" as TChainId
  );

  return (
    <Provider>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Require Connection
          </h1>
          <p className="text-gray-600 text-lg">
            Render children only when a connection to a blockchain is
            established
          </p>
          <p className="text-sm text-primary mt-2">
            Using {libraryName} provider
          </p>
        </div>

        {/* Chain Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-primary mb-3">
            Select Chain to Test
          </label>
          <div className="flex gap-4">
            <Button
              variant={selectedChain === "paseo" ? "default" : "outline"}
              onClick={() => setSelectedChain("paseo" as TChainId)}
            >
              Paseo Relay Chain
            </Button>
            <Button
              variant={selectedChain === "paseo_people" ? "default" : "outline"}
              onClick={() => setSelectedChain("paseo_people" as TChainId)}
            >
              Paseo People
            </Button>
          </div>
        </div>

        {/* Demo Examples */}
        <div className="space-y-8">
          {/* Basic Example */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Basic Connection Check
            </h2>
            <p className="text-muted-foreground mb-4">
              This example shows content when connected to {selectedChain}, or a
              fallback message when not connected.
            </p>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              <RequireConnection
                chainId={selectedChain}
                fallback={
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <WifiOff className="w-5 h-5" />
                    <span>
                      Please connect to {selectedChain} to view this content
                    </span>
                  </div>
                }
              >
                <div className="flex items-center gap-3 text-green-600">
                  <Wifi className="w-5 h-5" />
                  <span>
                    ✅ Connected to {selectedChain}! This content is now
                    visible.
                  </span>
                </div>
              </RequireConnection>
            </div>
          </div>

          {/* With Loading State */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">With Loading State</h2>
            <p className="text-muted-foreground mb-4">
              This example includes a loading state while the connection is
              being established.
            </p>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              <RequireConnection
                chainId={selectedChain}
                loadingFallback={
                  <div className="flex items-center gap-3 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting to {selectedChain}...</span>
                  </div>
                }
                fallback={
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <WifiOff className="w-5 h-5" />
                    <span>Failed to connect to {selectedChain}</span>
                  </div>
                }
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-green-600">
                    <Wifi className="w-5 h-5" />
                    <span>Connected to {selectedChain}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This content is only visible when connected to the
                    blockchain. You can now perform chain-specific operations
                    safely.
                  </div>
                </div>
              </RequireConnection>
            </div>
          </div>

          {/* Complex Content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Complex Protected Content
            </h2>
            <p className="text-muted-foreground mb-4">
              This example shows how to protect complex UI components that
              require blockchain connectivity.
            </p>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
              <RequireConnection
                chainId={selectedChain}
                fallback={
                  <div className="p-6 border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-3 text-orange-700 mb-3">
                      <WifiOff className="w-5 h-5" />
                      <h3 className="font-semibold">Connection Required</h3>
                    </div>
                    <p className="text-orange-600 text-sm">
                      This blockchain interface requires a connection to{" "}
                      {selectedChain}. Please ensure your provider is properly
                      configured and connected.
                    </p>
                  </div>
                }
              >
                <div className="p-6 border-green-200 bg-green-50">
                  <div className="flex items-center gap-3 text-green-700 mb-3">
                    <Wifi className="w-5 h-5" />
                    <h3 className="font-semibold">
                      Blockchain Interface Active
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm text-green-600">
                    <div>• Query blockchain state</div>
                    <div>• Submit transactions</div>
                    <div>• Listen to events</div>
                    <div>• Access chain metadata</div>
                  </div>
                  <Button className="mt-4" size="sm">
                    Interact with {selectedChain}
                  </Button>
                </div>
              </RequireConnection>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-primary mb-6">Features</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-primary">
                Conditional rendering based on chain connection status
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-primary">
                Support for loading states during connection establishment
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-primary">
                Flexible fallback content for disconnected states
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-primary">
                Chain-specific connection requirements using {libraryName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-primary">
                TypeScript support with full type safety
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <span className="text-primary">
                Works with both Dedot and polkadot-api (PAPI) providers
              </span>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
}
