import { PolkadotProvider } from "@/registry/polkadot-ui/providers/dedot-provider";
import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/components/address-input.dedot";
import { AddressInputDemo } from "@/registry/polkadot-ui/blocks/address-input/demo/address-input-demo";

export default function AddressInputDedotPage() {
  return (
    <AddressInputDemo
      Provider={PolkadotProvider}
      AddressInput={AddressInput}
      libraryName="dedot"
    />
  );
}
