import type { ComponentExample } from "@/components/examples/types.examples";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { polkadot } from "typink";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";

function DedotSelectTokenDialogWithPrice() {
  const { data: price } = useSubscanDotPrice();
  return (
    <div className="w-[260px]">
      <SelectTokenDialog
        chainId={polkadot.id}
        assetIds={[-1]} // -1 for native token
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
  description:
    "Token selection dialog with search (by name or symbol) and balances display",
  component: <DedotSelectTokenDialogWithPrice />,
  tsx: `import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";
import { useSubscanDotPrice } from "@/registry/polkadot-ui/hooks/use-subscan-dot-price";
import { polkadot } from "typink";

function DedotSelectTokenDialogWithPrice() {
  const { data: price } = useSubscanDotPrice();
  return (
    <div className="w-[260px]">
      <SelectTokenDialog
        chainId={polkadot.id}
        assetIds={[-1, 1984, 1337]} // -1 for native token
        className="w-full"
        withBalance
        withSearch
        balancePrecision={3}
        tokenConversionRate={price ?? undefined}
      />
    </div>
  );
}

<DedotSelectTokenDialogWithPrice />`,
};
