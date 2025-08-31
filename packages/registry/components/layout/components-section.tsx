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

import { Button } from "@/components/ui/button";
import { BookText } from "lucide-react";
import { examples } from "../examples";

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
              {/* <OpenInV0Button
                name={example.code}
                title={example.name}
                prompt={example.description}
                variant="ghost"
              /> */}
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
