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
      <AccountInfo
        chainId={polkadotPeople.id}
        address="5CwW67PPdZQQCcdWJVaRJCepSQSrtKUumDAGa7UZbBKwd9R2"
        fields={[
          "display",
          "twitter",
          "matrix",
          "discord",
          "github",
          "verified",
        ]}
      />
      <AccountInfo
        chainId={polkadotPeople.id}
        address="1dsrQjL34njJ4Y8FXGyxeLnmunPZ6XAvid9jSQe9S4pTUh2"
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
      <AccountInfo
        chainId={polkadotPeople.id}
        address="1hFmn2CuqXqxHgKDqqs2xRBpsPkiRXzJfcLbfDgsW7qgmpA"
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
    </div>
  ),
};
