import type { ComponentExample } from "../types.examples";
import { AccountInfo } from "@/registry/polkadot-ui/blocks/account-info/components/account-info.dedot";
import { polkadotPeople } from "typink";

export const accountInfoExample: ComponentExample = {
  name: "Account Info",
  href: "/docs/components/account-info",
  code: "account-info",
  description: "Display identity name and optional fields for an address",
  component: (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      {[
        "1dsrQjL34njJ4Y8FXGyxeLnmunPZ6XAvid9jSQe9S4pTUh2",
        "1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA",
      ].map((address) => (
        <AccountInfo
          key={address}
          chainId={polkadotPeople.id}
          address={address}
          fields={[
            "display",
            "twitter",
            "matrix",
            "discord",
            "github",
            "verified",
            "image",
          ]}
        />
      ))}
    </div>
  ),
  tsx: `import { AccountInfo } from "@/components/account-info.dedot";
import { polkadotPeople } from "typink";

<div className="flex items-center justify-center h-full flex-col gap-4">
{[
  "1dsrQjL34njJ4Y8FXGyxeLnmunPZ6XAvid9jSQe9S4pTUh2",
  "1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA",
].map((address) => (
  <AccountInfo
    key={address}
    chainId={polkadotPeople.id}
    address={address}
    fields={[
      "display",
      "twitter",
      "matrix",
      "discord",
      "github",
      "verified",
      "image",
    ]}
  />
))}
</div>
  `,
};
