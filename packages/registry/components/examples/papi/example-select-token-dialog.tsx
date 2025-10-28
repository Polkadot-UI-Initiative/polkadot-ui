import type { ComponentExample } from "@/components/examples/types.examples";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.papi";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";

function PapiSelectTokenDialogWithPrice() {
  const { data: price } = useSubscanDotPrice();
  return (
    <div className="w-[260px]">
      <SelectTokenDialog
        chainId="polkadot"
        assetIds={[-1, 1984, 1337]}
        className="w-full"
        withBalance
        withSearch
        balancePrecision={3}
        tokenConversionRate={price ?? undefined}
      />
    </div>
  );
}

export const selectTokenDialogExample: ComponentExample = {
  name: "Select Token Dialog",
  href: "/docs/components/select-token-dialog",
  code: "select-token-dialog",
  description: "Token selection dialog with search and balances",
  component: <PapiSelectTokenDialogWithPrice />,
  tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.papi";

<div className="w-[260px]">
  <SelectTokenDialog
    chainId="paseoAssetHub"
    assetIds={[-1, 1984, 1337]}
    className="w-full"
    withBalance
    withSearch
    balancePrecision={3}
  />
</div>`,
};
