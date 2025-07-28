import { PolkadotProvider } from "@/registry/dot-ui/providers/papi-provider";
import { AddressInput } from "@/registry/dot-ui/blocks/address-input/components/address-input.papi";
import AddressInputDemo from "@/registry/dot-ui/blocks/address-input/demo/address-input-demo";

export default function AddressInputPage() {
  return (
    <AddressInputDemo
      Provider={PolkadotProvider}
      AddressInput={AddressInput}
      libraryName="polkadot-api (PAPI)"
    />
  );
}
