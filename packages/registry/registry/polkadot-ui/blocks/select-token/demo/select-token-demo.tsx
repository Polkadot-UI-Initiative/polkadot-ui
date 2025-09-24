"use client";

import { ReactNode } from "react";
import { SelectTokenProps } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";

interface SelectTokenDemoProps {
  Provider: React.ComponentType<{ children: ReactNode }>;
  SelectToken: React.ComponentType<SelectTokenProps>;
  libraryName: string;
}

export function SelectTokenDemo({
  SelectToken,
  Provider,
  libraryName,
}: SelectTokenDemoProps) {
  return (
    <Provider>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">Select Token</h1>
        <p className="text-gray-600 text-lg">
          A token selection component for choosing assets from supported chains.
        </p>
        <p className="text-sm text-primary mt-2">
          Using {libraryName} and its provider.
        </p>
      </div>

      <div className="text-center mb-12 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Token Select</h3>
          <div className="flex justify-center">
            <SelectToken
              chainId="paseoAssetHub"
              assetIds={[1, 2, 3, 4, 5]}
              withBalance
              placeholder="Choose a token"
              className="min-w-[200px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Without Balance Display</h3>
          <div className="flex justify-center">
            <SelectToken
              chainId="paseoAssetHub"
              assetIds={[1, 2, 3]}
              withBalance={false}
              placeholder="Select token"
              className="min-w-[200px]"
            />
          </div>
        </div>
      </div>
    </Provider>
  );
}
