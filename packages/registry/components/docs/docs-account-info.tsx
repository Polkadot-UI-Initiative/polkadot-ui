"use client";

import { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { accountInfoExample } from "../examples/dedot/example-account-info";
import { AccountInfo } from "@/registry/polkadot-ui/blocks/account-info/components/account-info.dedot";
import { DEFAULT_CALLER } from "@/registry/polkadot-ui/lib/utils";

export const accountInfoExamples: ComponentExample[] = [
  accountInfoExample,
  {
    name: "Account Info - Select Fields",
    description: "Select which fields to display in the popover and by default",
    code: "account-info",
    component: (
      <AccountInfo
        address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
        fields={["github", "twitter"]}
      />
    ),
    tsx: `import { AccountInfo } from "@/components/account-info.dedot"

<AccountInfo
    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
    fields={["github","twitter"]}
/>`,
  },
  {
    name: "Account Info - Identicon Theme",
    code: "address-info",
    description:
      "This Address input accepts ss58 as well as eth address format",
    component: <AccountInfo address={DEFAULT_CALLER} iconTheme="jdenticon" />,
    tsx: `import { AccountIno } from "@/components/address-input.dedot";

<AccountInfo
    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
    theme="jdenticon"
/>`,
  },
];

export function AccountInfoDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {accountInfoExamples.map((example) => (
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
