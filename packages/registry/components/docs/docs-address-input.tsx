"use client";

import { addressInputExample } from "@/components/examples/dedot/example-address-input";
import type { ComponentExample } from "@/components/examples/types.examples";
import { ComponentPreview } from "@/components/layout/component-preview";
import type { IdentityResult } from "@/registry/polkadot-ui/blocks/address-input/address-input.base";
import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/address-input.dedot";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { polkadotPeople } from "typink";

const handleIdentitySelected = (identity: IdentityResult) => {
  alert(identity.data.display);
};

export const addressInputExamples: ComponentExample[] = [
  addressInputExample,
  {
    name: "Address Input - Multiple Formats",
    href: "/docs/components/address-input",
    code: "address-input",
    description:
      "This Address input accepts SS58 as well as eth address format",
    component: <AddressInput format="both" identityChain={polkadotPeople.id} />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput format="both" identityChain={polkadotPeople.id} />`,
  },
  {
    name: "Address Input - Theming",
    code: "address-input",
    description: "This Address input uses the beachball identicon theme",
    component: (
      <AddressInput
        identiconTheme="beachball"
        identityChain={polkadotPeople.id}
      />
    ),
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput identiconTheme="beachball" identityChain={polkadotPeople.id} />`,
  },
  {
    name: "Address Input - Custom Identity Chain",
    code: "address-input",
    description: "This Address input uses the Polkadot People identity chain",
    component: <AddressInput identityChain={polkadotPeople.id} />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput identityChain={polkadotPeople.id} />`,
  },
  {
    name: "Address Input - onIdentitySelected Callback",
    code: "address-input",
    description:
      "Trigger a callback with the found identity (open the browser console to see the identity logged).",
    component: (
      <AddressInput
        onIdentitySelected={handleIdentitySelected}
        identityChain={polkadotPeople.id}
      />
    ),
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput onIdentitySelected={(identity) => console.log(identity)} />`,
  },
  {
    name: "Address Input - truncated display",
    code: "address-input",
    description: "Truncated display of the address",
    component: <AddressInput truncate={3} identityChain={polkadotPeople.id} />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput truncate={3} />`,
  },
];

export function AddressInputDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {addressInputExamples.map((example) => (
          <ComponentPreview
            ComponentWrapper={<div className="md:w-[400px]"></div>}
            key={example.name}
            componentInfo={example}
            withDocs={false}
          />
        ))}
      </div>
    </PolkadotProvider>
  );
}
