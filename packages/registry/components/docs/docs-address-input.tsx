"use client";

import { AddressInput } from "@/registry/polkadot-ui/blocks/address-input/components/address-input.dedot";
import { addressInputExample } from "../examples/dedot/example-address-input";
import { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { IdentityResult } from "@/registry/polkadot-ui/blocks/address-input/components/address-input.base";

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
      "This Address input accepts ss58 as well as eth address format",
    component: <AddressInput format="both" />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput format="both" />`,
  },
  {
    name: "Address Input - Theming",
    code: "address-input",
    description: "This Address input uses the beachball identicon theme",
    component: <AddressInput identiconTheme="beachball" />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput identiconTheme="beachball" />`,
  },
  {
    name: "Address Input - Custom Identity Chain",
    code: "address-input",
    description: "This Address input uses the Polkadot People identity chain",
    component: <AddressInput identityChain="polkadot_people" />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput identityChain="polkadot_people" />`,
  },
  {
    name: "Address Input - onIdentitySelected Callback",
    code: "address-input",
    description: "Trigger a callback with the found identnty",
    component: <AddressInput onIdentitySelected={handleIdentitySelected} />,
    tsx: `import { AddressInput } from "@/components/address-input.dedot";

<AddressInput onIdentitySelected={(identity) => console.log(identity)} />`,
  },
  {
    name: "Address Input - truncated display",
    code: "address-input",
    description: "Truncated display of the address",
    component: <AddressInput truncate={3} />,
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

// ### Basic Example

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview"><AddressInputWithProvider /></TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// import { AddressInput } from "@/components/address-input.dedot";

// function MyComponent() {
//   const [address, setAddress] = useState("");

//   return (
//     <AddressInput value={address} onChange={setAddress} />
//   );
// }
// ```
// </TabsContent>
// </Tabs>

// ### Custom Identity Chain

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview">
//     <AddressInputWithProvider
//       format="ss58"
//       identityChain="paseo_people"
//       withIdentityLookup={true}
//     />
//   </TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// <AddressInput
//   format="ss58"
//   identityChain="paseo_people"  // Specify which chain to use for identity lookup
//   withIdentityLookup={true}
// />
// ```
// </TabsContent>
// </Tabs>

// ### With Identity Callback

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview">
//     <AddressInputWithProvider
//       format="ss58"
//       withIdentityLookup={true}
//     />
//   </TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// <AddressInput
//   format="ss58"
//   onIdentitySelected={(identity) => {
//     console.log("Found identity:", identity.data.display);
//   }}
// />
// ```
// </TabsContent>
// </Tabs>

// ### Truncated Display

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview">
//     <AddressInputWithProvider
//       format="both"
//       truncate={6}
//     />
//   </TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// <AddressInput
//   format="both"
//   truncate={6}  // Shows first 6 and last 6 characters
// />
// ```
// </TabsContent>
// </Tabs>

// ### Custom Identicon Themes

// #### Beachball Theme

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview">
//     <AddressInputWithProvider
//       format="ss58"
//       identiconTheme="beachball"
//     />
//   </TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// <AddressInput
//   format="ss58"
//   identiconTheme="beachball"  // Colorful beachball style
// />
// ```
// </TabsContent>
// </Tabs>

// #### Substrate Theme

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview">
//     <AddressInputWithProvider
//       format="ss58"
//       identiconTheme="substrate"
//     />
//   </TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// <AddressInput
//   format="ss58"
//   identiconTheme="substrate"  // Substrate theme
// />
// ```
// </TabsContent>
// </Tabs>

// #### JDenticon Theme

// <Tabs defaultValue="preview" className="max-w-[600px]">
//   <TabsList>
//     <TabsTrigger value="preview">Preview</TabsTrigger>
//     <TabsTrigger value="code">Code</TabsTrigger>
//   </TabsList>
//   <TabsContent value="preview">
//     <AddressInputWithProvider
//       format="ss58"
//       identiconTheme="jdenticon"
//     />
//   </TabsContent>
//   <TabsContent value="code" className="my-0">
// ```tsx
// <AddressInput
//   format="ss58"
//   identiconTheme="jdenticon"  // Jdenticon style
// />
// ```
// </TabsContent>
// </Tabs>
