import { AddressInputWithProvider } from "@/registry/dot-ui/blocks/address-input/components/address-input.dedot";
import { Label } from "@/registry/dot-ui/ui/label";
import type { ComponentExample } from "./types";

export const addressInputExample: ComponentExample = {
  name: "Address Input",
  href: "/docs/components/address-input",
  code: "address-input",
  description:
    "Input component with SS58/Ethereum validation and identity lookup",
  component: (
    <div className="flex flex-col gap-2 w-full">
      <Label>Address</Label>
      <AddressInputWithProvider
        className="w-full"
        truncate={8}
        format="both"
        required={false}
        placeholder="Enter an address or search for an identity"
      />
    </div>
  ),
};
