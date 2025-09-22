"use client";

import { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import { accountInfoExample } from "../examples/dedot/example-account-info";
import { AccountInfo } from "@/registry/polkadot-ui/blocks/account-info/account-info.dedot";
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
