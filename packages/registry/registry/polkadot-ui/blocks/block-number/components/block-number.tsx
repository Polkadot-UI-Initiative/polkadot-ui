"use client";

import { useBlockNumber } from "@/registry/polkadot-ui/blocks/block-number/hooks/use-block-number";
import { usePolkadot } from "@/registry/polkadot-ui/providers/polkadot-provider";
import { Button } from "@/registry/polkadot-ui/ui/button";

export function BlockNumber() {
  const { blockNumber, error } = useBlockNumber();
  const {
    setApi,
    availableChains,
    isConnected,
    isLoading: isLoading,
    currentChain,
    chainName,
  } = usePolkadot();

  if (isLoading(currentChain)) {
    return (
      <div className="w-full max-w-md p-4 border border-gray-200 rounded-md bg-white">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Block Number</h3>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">
            Connecting to {chainName}...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-4 border border-red-200 rounded-md bg-red-50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-red-600">Block Number</h3>
          <p className="text-sm text-red-500">Error loading block number</p>
        </div>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-4 border border-gray-200 rounded-md bg-white">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Block Number</h3>
        <p className="text-sm text-gray-600">Current block on {chainName}</p>
      </div>
      <div className="space-y-4">
        <div className="text-3xl font-bold text-blue-600">
          {blockNumber?.toLocaleString() || "Loading..."}
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
