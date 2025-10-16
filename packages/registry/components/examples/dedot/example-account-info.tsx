import type { ComponentExample } from "../types.examples";
import { AccountInfo } from "@/registry/polkadot-ui/blocks/account-info/account-info.dedot";
import { polkadotPeople } from "typink";

export const accountInfoExample: ComponentExample = {
  name: "Account Info",
  href: "/docs/components/account-info",
  code: "account-info",
  description: "Display identity name and optional fields for an address",
  component: (
    <AccountInfo
      chainId={polkadotPeople.id}
      address={"1dsrQjL34njJ4Y8FXGyxeLnmunPZ6XAvid9jSQe9S4pTUh2"}
      fields={["twitter", "github"]}
    />
  ),
  tsx: `import { AccountInfo } from "@/components/account-info.dedot";
import { polkadotPeople } from "typink";
(
  <AccountInfo
    chainId={polkadotPeople.id}
    address={"1dsrQjL34njJ4Y8FXGyxeLnmunPZ6XAvid9jSQe9S4pTUh2"}
    fields={[
      "twitter",
      "github",
    ]}
  />
)
  `,
};
