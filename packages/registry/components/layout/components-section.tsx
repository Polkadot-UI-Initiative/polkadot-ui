"use client";

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
import { RequireConnection } from "@/registry/dot-ui/blocks/require-connection/components/require-connection.dedot";
import { Button } from "@/components/ui/button";
import { BookText } from "lucide-react";
import { Label } from "@/registry/dot-ui/ui/label";
import { WalletSelect } from "@/registry/dot-ui/blocks/connect-wallet/components/wallet-select";
import { ClientOnly } from "../client-only";
import { DemoTxButton } from "../demo/demo-tx-button";

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
          required={false}
          placeholder="Enter an address or search for an identity"
        />
      </div>
    ),
  },
  {
    name: "Wallet & Account Selection",
    href: "/docs/components/wallet-select",
    code: "wallet-select",
    description: (
      <>
        Wallet connection and account selection. We provide a minimal working
        example of a connection component. If you want more features like e.g.
        WalletConnect, try{" "}
        <Link href="https://www.lunolab.xyz/" className="underline">
          LunoKit
        </Link>
      </>
    ),
    component: (
      <div className="flex flex-col gap-2">
        <WalletSelect variant="default" />
      </div>
    ),
  },
  {
    name: "Tx Button",
    href: "/docs/components/tx-button",
    code: "tx-button",
    description:
      "Button component for sending arbitrary transactions. Supports all chains, all signers with default notification. Fees and error states are handled by the component.",
    component: (
      <ClientOnly>
        <DemoTxButton />
      </ClientOnly>
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
        <RequireConnection
          chainId="paseo"
          fallback={
            <Card className="bg-white/5 border border-border w-full">
              <CardHeader>
                <CardTitle>⛓️‍💥 Not Connected to Paseo</CardTitle>
                <CardDescription className="text-xs font-normal">
                  Connect your wallet to Paseo to continue
                </CardDescription>
              </CardHeader>
            </Card>
          }
        >
          <Card className="bg-white/5 border border-border w-full">
            <CardHeader>
              <CardTitle>⚡️ Connected to Paseo</CardTitle>
              <CardDescription className="text-xs font-normal">
                You are connected to Paseo
              </CardDescription>
            </CardHeader>
          </Card>
        </RequireConnection>
      </div>
    ),
  },
];

export function ComponentsSection() {
  return (
    <section className="container space-y-6 py-8 md:py-8 lg:py-12">
      {/* Examples grid */}
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-1 md:max-w-[64rem] md:grid-cols-2 2xl:grid-cols-3 auto-rows-fr">
        {examples.map((example) => (
          <Card
            key={example.name}
            className="relative flex flex-col justify-between h-full"
          >
            <CardHeader>
              <CardTitle className="text-lg">{example.name}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-1">
              {example.component}
            </CardContent>
            <CardFooter className="mt-auto flex items-center pt-2 gap-2">
              <Link
                href={example.href}
                className="text-xs text-primary hover:underline"
              >
                <Button size="sm" variant="secondary" className="text-xs">
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
        <div className="flex flex-col items-center justify-center w-full col-span-full h-32">
          <span className="text-lg">more components coming soon</span>
          <Link
            href="https://github.com/Polkadot-UI-Initiative/dot-ui"
            className="text-xs text-primary hover:underline"
          >
            Follow on GitHub →
          </Link>
        </div>
      </div>
    </section>
  );
}
