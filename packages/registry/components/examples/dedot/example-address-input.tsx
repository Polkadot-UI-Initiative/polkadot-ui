import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/components/address-input.dedot";
import { Label } from "@/registry/polkadot-ui/ui/label";
import type { ComponentExample } from "../types.examples";
import { paseoPeople } from "typink";

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
        identityChain={paseoPeople.id}
        className="w-full"
        truncate={8}
        format="both"
        required={false}
        placeholder="Enter an address or search for an identity"
      />
    </div>
  ),
  tsx: `import { paseoPeople } from "typink";
import { AddressInput } from "@/components/address-input.dedot";

<AddressInput
  identityChain={paseoPeople.id}
  className="w-full"
  truncate={8}
  format="both"
  required={false}
  placeholder="Enter an address or search for an identity"
/>`,
};
