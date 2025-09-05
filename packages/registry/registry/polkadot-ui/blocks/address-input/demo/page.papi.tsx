import { PolkadotProvider } from "@/registry/polkadot-ui/providers/__polkadot-provider.papi";
import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/components/address-input.papi";
import { AddressInputDemo } from "@/registry/polkadot-ui/blocks/address-input/demo/address-input-demo";

export default function AddressInputPage() {
  return (
    <AddressInputDemo
      Provider={PolkadotProvider}
      AddressInput={AddressInput}
      libraryName="polkadot-api (PAPI)"
    />
  );
}
