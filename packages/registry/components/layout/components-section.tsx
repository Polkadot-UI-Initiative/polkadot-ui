"use client";

import Link from "next/link";
import { isValidElement, type ReactNode, type ReactElement } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { BookText } from "lucide-react";
import { examples as papiExamples } from "../examples/papi";
import { examples as dedotExamples } from "../examples/dedot";
import { OpenInV0Button } from "../open-in-v0-button";
import { PolkadotProvider as PolkadotProviderPapi } from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { PolkadotProvider as PolkadotProviderDedot } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";

const USED_LIBRARY: "papi" | "dedot" = "papi";

export function ComponentsSection() {
  const examples = USED_LIBRARY === "papi" ? papiExamples : dedotExamples;

  const ComponentExamples = examples.map((example) => (
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
        <Button asChild size="sm" variant="secondary">
          <Link href={example.href} className="text-primary hover:underline">
            <BookText /> Docs →
          </Link>
        </Button>
        <OpenInV0Button
          name={example.code}
          title={example.name}
          variant="outline"
          prompt={
            (typeof example.description === "string"
              ? example.description
              : getTextFromNode(example.description)) ||
            `${example.name} - explain this code`
          }
        />
      </CardFooter>
    </Card>
  ));

  return (
    <section className="mx-8 space-y-6 py-8 md:py-8 lg:py-12" id="components">
      {/* Examples grid */}
      <div className="w-full grid justify-center gap-4 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 auto-rows-fr">
        {USED_LIBRARY === "papi" && (
          <PolkadotProviderPapi>{ComponentExamples}</PolkadotProviderPapi>
        )}
        {USED_LIBRARY === "dedot" && (
          <PolkadotProviderDedot>{ComponentExamples}</PolkadotProviderDedot>
        )}
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg">What&apos;s missing here?</span>
          <Link
            href="https://github.com/Polkadot-UI-Initiative/polkadot-ui"
            className="text-xs text-primary hover:underline"
          >
            Open an issue or PR on GitHub →
          </Link>
        </div>
      </div>
    </section>
  );

  function getTextFromNode(node: ReactNode): string {
    if (node === null || node === undefined || node === false || node === true)
      return "";
    if (typeof node === "string" || typeof node === "number")
      return String(node);
    if (Array.isArray(node)) return node.map(getTextFromNode).join("");
    if (isValidElement(node)) {
      const element = node as ReactElement<{ children?: ReactNode }>;
      return getTextFromNode(element.props.children as ReactNode);
    }
    return "";
  }
}
