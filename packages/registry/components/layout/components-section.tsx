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
import { examples } from "../examples/papi";
import { OpenInV0Button } from "../open-in-v0-button";

export function ComponentsSection() {
  return (
    <section className="mx-8 space-y-6 py-8 md:py-8 lg:py-12" id="components">
      {/* Examples grid */}
      <div className="w-full grid justify-center gap-4 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 auto-rows-fr">
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
              <OpenInV0Button
                name={example.code}
                title={example.name}
                variant="outline"
                prompt={
                  (typeof example.description === "string"
                    ? example.description
                    : encodeURIComponent(
                        getTextFromNode(example.description)
                      )) ||
                  encodeURIComponent(`${example.name} - explain this code`)
                }
              />
            </CardFooter>
          </Card>
        ))}
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg">What&apos;s missing here?</span>
          <Link
            href="https://github.com/Polkadot-UI-Initiative/dot-ui"
            className="text-xs text-primary hover:underline"
          >
            Open an issue or PR on GitHub →
          </Link>
        </div>
      </div>
    </section>
  );
}

function getTextFromNode(node: ReactNode): string {
  if (node === null || node === undefined || node === false || node === true)
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join("");
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return getTextFromNode(element.props.children as ReactNode);
  }
  return "";
}
