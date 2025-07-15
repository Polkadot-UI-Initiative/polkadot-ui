"use client";

import { useBlockNumber } from "@/registry/polkadot-ui/blocks/block-number/hooks/use-block-number";
import { Button } from "@/registry/polkadot-ui/ui/button";
import { useDedot } from "@/registry/polkadot-ui/providers/dedot-provider";

export function BlockNumber() {
  const { blockNumber, error } = useBlockNumber();
  // Using PolkadotProvider
  // const {
  //   setApi,
  //   availableChains,
  //   isConnected,
  //   isLoading: isLoading,
  //   currentChain,
  //   chainName,
  // } = usePolkadot();

  // using DedotProvider
  const {
    setApi,
    availableChains,
    isConnected,
    isLoading: isLoadingDedot,
    isLoading,
    currentChain,
    chainName,
  } = useDedot();

  if (isLoadingDedot) {
    return (
      <div className="w-full max-w-md p-4 borderrounded-md">
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
      <div className="w-full max-w-md p-4 border border-error rounded-md bg-error">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-error">Block Number</h3>
          <p className="text-sm text-error">Error loading block number</p>
        </div>
        <div className="text-error text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-md">
      <div className="space-y-4">
        <div className="text-3xl font-bold text-polkadot-pink">
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
                disabled={isLoading}
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
