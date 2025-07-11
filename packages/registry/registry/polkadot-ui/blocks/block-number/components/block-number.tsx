"use client"

import { useState } from "react";
import { useBlockNumber } from "../hooks/use-block-number"
import { useApiContext } from "../../../providers/api-provider";
import { ChainId } from "../../../lib/config.polkadot-ui";

export function BlockNumber() {
  const { blockNumber, isLoading } = useBlockNumber(); 
  const { currentChain, chain, setChainId, availableChains } = useApiContext();
  const [switchingChain, setSwitchingChain] = useState<string | null>(null);

  const handleChainSwitch = (chainId: ChainId) => {
    if (chainId === currentChain) return;
    
    setSwitchingChain(chainId);
    try {
      setChainId(chainId as ChainId);
    } finally {
      setSwitchingChain(null);
    }
  };

  if (!chain) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-xl shadow-lg border max-w-md mx-auto">
      {/* Chain Info */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">Current block on</p>
        <h2 className="text-lg font-semibold text-gray-900">{chain.displayName}</h2>
      </div>

      {/* Current Block Number */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Block Number</p>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <p className="text-4xl font-bold text-blue-600 tabular-nums">
            {blockNumber.toLocaleString()}
          </p>
        )}
      </div>

      {/* Chain Selector Buttons */}
      <div className="w-full">
        <p className="text-sm text-gray-600 mb-3 text-center">Switch Network</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {availableChains.map((chainId) => {
            const isActive = chainId === currentChain;
            const isLoading = switchingChain === chainId;
            
            return (
              <button 
                key={chainId} 
                onClick={() => handleChainSwitch(chainId)}
                disabled={isLoading || isActive}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                    <span>Switching...</span>
                  </div>
                ) : (
                  <span className="capitalize">{chainId}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
}
