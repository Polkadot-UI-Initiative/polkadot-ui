import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AddressInputWithProvider } from "@/registry/dot-ui/blocks/address-input/components/address-input.dedot";
import { RequireConnectionWithProvider } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.dedot";
import { Button } from "@/components/ui/button";
import { BookText, Wifi, WifiOff } from "lucide-react";
import { Label } from "@/registry/dot-ui/ui/label";
import { cn } from "@/lib/utils";
import { ConnectWalletWithProvider } from "@/registry/dot-ui/blocks/connect-wallet/components/connect-wallet.dedot";
import { TxNotificationWithTxButton } from "@/registry/dot-ui/blocks/tx-notification/components/tx-notification-with-tx-button";

const examples = [
  {
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
        />
      </div>
    ),
  },
  {
    name: "Require Connection",
    href: "/docs/components/require-connection",
    code: "require-connection",
    description:
      "Conditionally render content based on blockchain connection status",
    component: (
      <div className="w-full space-y-3">
        <RequireConnectionWithProvider
          chainId="paseo"
          fallback={
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <WifiOff className="w-4 h-4" />
              <span>Connect to Paseo</span>
            </div>
          }
        >
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Wifi className="w-4 h-4" />
            <span>Connected to Paseo</span>
          </div>
        </RequireConnectionWithProvider>
      </div>
    ),
  },
  {
    name: "Tx Button with Tx Notification",
    href: "/docs/components/tx-notification",
    code: "simple-tx-button with tx-notification",
    description: "Simple tx button with tx notification",
    component: <TxNotificationWithTxButton />,
  },
  {
    name: "Wallet Selection",
    href: "/docs/components/wallet-selection",
    code: "wallet-selection",
    description: "Wallet connection and account selection",
    component: (
      <div className="flex flex-col gap-2 w-full">
        <ConnectWalletWithProvider />
      </div>
    ),
  },
  // {
  //   name: "Block Number DEMO",
  //   href: "/docs/components/block-number",
  //   code: "block-number",
  //   description: "Will not be part of the library",
  //   component: <BlockNumber />,
  // },
];

// const categories = [
//   {
//     name: "Featured",
//     href: "/examples",
//     description: "Most popular Polkadot components",
//     className: "text-primary border-primary",
//   },
//   {
//     name: "Blockchain",
//     href: "/examples/blockchain",
//     description: "Core blockchain interactions",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
//   {
//     name: "Wallet",
//     href: "/examples/wallet",
//     description: "Wallet connection and management",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
//   {
//     name: "DeFi",
//     href: "/examples/defi",
//     description: "Decentralized finance components",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
//   {
//     name: "Governance",
//     href: "/examples/governance",
//     description: "On-chain governance tools",
//     className:
//       "text-muted-foreground border-transparent hover:border-muted-foreground",
//   },
// ];

export function ComponentsSection() {
  return (
    <section className="container space-y-6 py-8 md:py-8 lg:py-12">
      {/* Examples grid */}
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[64rem] md:grid-cols-2 2xl:grid-cols-3">
        {examples.map((example) => (
          <Card
            key={example.name}
            className="relative overflow-hidden flex flex-col justify-between"
          >
            <CardHeader>
              <CardTitle className="text-lg">{example.name}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {example.component}
            </CardContent>
            <CardFooter className="flex items-center pt-2 gap-2">
              <Link
                href={example.href}
                className="text-xs text-primary hover:underline"
              >
                <Button size="sm" variant="ghost" className="text-xs">
                  <BookText /> Docs →
                </Button>
              </Link>
              {/* <OpenInV0Button
                name={example.code}
                title={example.name}
                prompt={example.description}
                variant="ghost"
              /> */}
            </CardFooter>
          </Card>
        ))}
        <Card
          className={cn(
            "relative overflow-hidden flex flex-col justify-center items-center",
            examples.length % 2 === 0 && "col-span-full"
          )}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-lg">
              More Polkadot Components Coming Soon
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center justify-center pt-0">
            <Link
              href="https://github.com/Polkadot-UI-Initiative/dot-ui"
              className="text-xs text-primary hover:underline"
            >
              Follow and ⭐️ on GitHub →
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
