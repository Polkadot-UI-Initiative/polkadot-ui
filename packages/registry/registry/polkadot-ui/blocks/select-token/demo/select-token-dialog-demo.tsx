"use client";

import { ReactNode } from "react";
import { SelectTokenDialogProps } from "../components/select-token-dialog.dedot";

interface SelectTokenDialogDemoProps {
  Provider: React.ComponentType<{ children: ReactNode }>;
  SelectTokenDialog: React.ComponentType<SelectTokenDialogProps>;
  libraryName: string;
}

export function SelectTokenDialogDemo({
  SelectTokenDialog,
  Provider,
  libraryName,
}: SelectTokenDialogDemoProps) {
  return (
    <Provider>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Select Token Dialog
        </h1>
        <p className="text-gray-600 text-lg">
          A token selection dialog component for choosing assets from supported
          chains.
        </p>
        <p className="text-sm text-primary mt-2">
          Using {libraryName} and its provider.
        </p>
      </div>

      <div className="text-center mb-12 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Token Dialog</h3>
          <div className="flex justify-center">
            <SelectTokenDialog
              chainId="paseoAssetHub"
              assetIds={[1, 2, 3, 4, 5]}
              withBalance
              className="min-w-[200px]"
            >
              Select Token
            </SelectTokenDialog>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Without Balance Display</h3>
          <div className="flex justify-center">
            <SelectTokenDialog
              chainId="paseoAssetHub"
              assetIds={[1, 2, 3]}
              withBalance={false}
              className="min-w-[200px]"
            >
              Choose Token
            </SelectTokenDialog>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custom Styling</h3>
          <div className="flex justify-center">
            <SelectTokenDialog
              chainId="paseoAssetHub"
              assetIds={[1, 2, 3, 4]}
              withBalance
              variant="secondary"
              className="min-w-[250px] py-6"
            >
              🪙 Pick Your Token
            </SelectTokenDialog>
          </div>
        </div>
      </div>
    </Provider>
  );
}
