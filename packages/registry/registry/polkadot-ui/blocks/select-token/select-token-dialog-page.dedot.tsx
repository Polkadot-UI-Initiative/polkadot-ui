import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { SelectTokenDialogDemo } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog-demo";
import { SelectTokenDialog } from "@/registry/polkadot-ui/blocks/select-token/select-token-dialog.dedot";

export default function SelectTokenDialogDedotPage() {
  return (
    <SelectTokenDialogDemo
      Provider={PolkadotProvider}
      SelectTokenDialog={SelectTokenDialog}
      libraryName="dedot"
    />
  );
}
