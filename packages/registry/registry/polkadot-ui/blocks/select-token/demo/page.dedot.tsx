import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { SelectTokenDemo } from "@/registry/polkadot-ui/blocks/select-token/demo/select-token-demo";
import { SelectToken } from "@/registry/polkadot-ui/blocks/select-token/components/select-token.dedot";

export default function SelectTokenDedotPage() {
  return (
    <SelectTokenDemo
      Provider={PolkadotProvider}
      SelectToken={SelectToken}
      libraryName="dedot"
    />
  );
}
