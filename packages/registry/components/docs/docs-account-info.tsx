"use client";

import type { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { accountInfoExample } from "../examples/dedot/example-account-info";
import { AccountInfo } from "@/registry/polkadot-ui/blocks/account-info/account-info.dedot";

export const accountInfoExamples: ComponentExample[] = [
  accountInfoExample,
  {
    name: "Account Info - Select Fields",
    description: "Select which fields to display in the popover and by default",
    code: "account-info",
    component: (
      <AccountInfo
        address={"5CwW67PPdZQQCcdWJVaRJCepSQSrtKUumDAGa7UZbBKwd9R2"}
        fields={["email", "twitter"]}
      />
    ),
    tsx: `import { AccountInfo } from "@/components/account-info.dedot"

<AccountInfo
    address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
    fields={["github","twitter"]}
/>`,
  },
  {
    name: "Account Info - Hover Card",
    description: "Display the account info in a hover card",
    code: "account-info",
    component: (
      <AccountInfo
        address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
        componentType="hover"
      />
    ),
    tsx: `import { AccountInfo } from "@/components/account-info.dedot"

<AccountInfo
    address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
    componentType="hover"
/>`,
  },
  {
    name: "Account Info - Popover Card",
    description:
      "Display the account info in a popover card that opens on click",
    code: "account-info",
    component: (
      <AccountInfo
        address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
        componentType="popover"
      />
    ),
    tsx: `import { AccountInfo } from "@/components/account-info.dedot"

<AccountInfo
    address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
    componentType="popover"
/>`,
  },
  {
    name: "Account Info - Identicon Theme",
    code: "address-info",
    description:
      "This Address input accepts SS58 as well as eth address format",
    component: (
      <AccountInfo
        address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
        iconTheme="jdenticon"
      />
    ),
    tsx: `import { AccountIno } from "@/components/address-input.dedot";

<AccountInfo
    address={"1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"}
    theme="jdenticon"
/>`,
  },
];

export function AccountInfoDocs() {
  return (
    <div className="not-prose">
      <PolkadotProvider>
        <div className="flex flex-col gap-4">
          {accountInfoExamples.map((example) => (
            <ComponentPreview
              key={example.name}
              componentInfo={example}
              withDocs={false}
            />
          ))}
        </div>
      </PolkadotProvider>
    </div>
  );
}
