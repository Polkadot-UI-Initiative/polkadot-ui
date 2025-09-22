import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/address-input.papi";
import { Label } from "@/registry/polkadot-ui/ui/label";
import type { ComponentExample } from "@/components/examples/types.examples";

export const addressInputExample: ComponentExample = {
  name: "Address Input",
  href: "/docs/components/address-input",
  code: "address-input",
  description:
    "Input component with SS58/Ethereum validation and identity lookup",
  component: (
    <div className="flex flex-col gap-2 w-full">
      <Label>Address</Label>
      <AddressInput
        className="w-full"
        truncate={8}
        format="both"
        required={false}
        placeholder="Enter an address or search for an identity"
        identityChain="polkadotPeople"
      />
    </div>
  ),
  tsx: `import { AddressInput } from "@/components/address-input.papi";

<AddressInput
  className="w-full"
  truncate={8}
  format="both"
  required={false}
  placeholder="Enter an address or search for an identity"
  identityChain="polkadotPeople" // the key of the chain in the reactive-dot.config.ts
/>`,
};
