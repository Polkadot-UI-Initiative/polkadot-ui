"use client";

import { examples } from "@/components/examples/papi";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function PapiPage() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4 mt-24 mx-auto max-w-screen-lg">
        {examples.map((example) => (
          <Card
            key={example.code}
            className="bg-white/5 border border-border w-1/2 p-4"
          >
            <CardHeader>
              <CardTitle>{example.name}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>{example.component}</CardContent>
          </Card>
        ))}
      </div>
    </PolkadotProvider>
  );
}
