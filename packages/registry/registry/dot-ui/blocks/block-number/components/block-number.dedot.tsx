"use client";

import { useBlockNumber } from "@/registry/dot-ui/blocks/block-number/hooks/use-block-number.dedot";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { Button } from "@/registry/dot-ui/ui/button";

export function BlockNumber() {
  const {
    setApi,
    availableChains,
    isConnected,
    isLoading,
    currentChain,
    chainName,
  } = useDedot();

  const { blockNumber, error } = useBlockNumber();

  if (isLoading(currentChain)) {
    return (
      <div className="w-full max-w-md p-4 border rounded-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Block Number</h3>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">
            Connecting to {chainName} using PAPI...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-4 border border-red-500 rounded-md bg-red-50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-red-800">Block Number</h3>
          <p className="text-sm text-red-600">Error loading block number</p>
        </div>
        <div className="text-red-700 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-polkadot-pink">
            {blockNumber?.toLocaleString() || "Loading..."}
          </div>
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            PAPI
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Current chain: <span className="font-mono">{chainName}</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {availableChains.map((chainId) => (
              <Button
                key={chainId}
                variant={chainId === currentChain ? "default" : "outline"}
                size="sm"
                onClick={() => setApi(chainId)}
                disabled={isLoading(chainId)}
              >
                {chainId}
                {isConnected(chainId) && (
                  <span className="ml-1 text-xs text-green-600">●</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
