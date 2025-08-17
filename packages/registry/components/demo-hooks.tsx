"use client";

import { useEffect, useState } from "react";
import type { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";
import { fromTypinkId } from "@/registry/dot-ui/lib/config.dedot";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";

export function DemoHooks() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { availableChains, availableChainIds, activeAccount } = useDedot();

  // Optionally pre-connect all supported chains after hydration
  const { initializeChain, apis } = useDedot();
  useEffect(() => {
    if (!isHydrated) return;
    availableChainIds.forEach((id) => initializeChain(id));
  }, [isHydrated, availableChainIds, initializeChain]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        <h2 className="text-xl font-bold">Multi-Client Auto-Connect Demo</h2>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-xl font-bold">Multi-Client Auto-Connect Demo</h2>

      {/* Multi-Client Status */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">Multi-Client Status</h3>
        <div className="space-y-2">
          {availableChains
            .filter((chain): chain is NonNullable<typeof chain> =>
              Boolean(chain)
            )
            // Only show networks that map to our base ChainId
            .filter((chain) => Boolean(fromTypinkId(chain.id)))
            .map((chain) => (
              <div key={chain.id} className="flex items-center justify-between">
                <span className="text-xs ">
                  {chain.name}:{" "}
                  {(() => {
                    const mappedId = fromTypinkId(chain.id);
                    if (!mappedId)
                      return (
                        <span className="rounded-full bg-red-100 p-1">
                          Disconnected
                        </span>
                      );
                    return apis[mappedId as ChainId] ? (
                      <>
                        <span className="inline-block rounded-full bg-green-500 text-green-600 w-2 h-2 animate-pulse"></span>{" "}
                        connected
                      </>
                    ) : (
                      <span className="rounded-full bg-red-100 p-1">
                        Disconnected
                      </span>
                    );
                  })()}
                </span>
                <span className="text-xs text-gray-500">{chain.id}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Account & Network Info */}
      <div className="border p-3 rounded">
        <h3 className="font-semibold mb-2">Account & Networks</h3>
        <div className="space-y-1 text-sm">
          <div>
            Selected Account:{" "}
            <code>
              {activeAccount?.name || activeAccount?.address || "None"}
            </code>
          </div>
          <div className="flex flex-row gap-1">
            Supported Networks:{" "}
            <div className="flex flex-wrap gap-2">
              {availableChainIds.map((chainId) => (
                <code key={chainId}>{chainId}</code>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Raw Debug Info */}
      <details className="border p-3 rounded">
        <summary className="font-semibold cursor-pointer">
          Raw Debug Data
        </summary>
        <div className="mt-2 space-y-2 text-xs">
          <div>
            chains:{" "}
            {availableChains.map((chain) => (
              <code className="flex bg-gray-100 p-2 rounded" key={chain?.id}>
                {JSON.stringify(chain, null, 2)}
              </code>
            ))}
          </div>
          <div>
            selectedAccount:{" "}
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(activeAccount, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}
