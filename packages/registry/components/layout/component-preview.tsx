"use client";

import type { ComponentExample } from "../examples/types.examples";
// import { OpenInV0Button } from "../open-in-v0-button";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { BookText, Check, Code, Copy, Eye } from "lucide-react";
import Link from "next/link";
import React, {
  isValidElement,
  // type ReactElement,
  // type ReactNode,
  useState,
} from "react";

import { useTheme } from "next-themes";
import ShikiHighlighter from "react-shiki";

export function ComponentPreview({
  componentInfo,
  withDocs = true,
  ComponentWrapper,
}: {
  componentInfo: ComponentExample;
  withDocs?: boolean;
  ComponentWrapper?: React.ReactElement;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();

  const previewContent =
    ComponentWrapper &&
    isValidElement(ComponentWrapper) &&
    ComponentWrapper.type !== React.Fragment
      ? React.cloneElement(ComponentWrapper, undefined, componentInfo.component)
      : componentInfo.component;

  return (
    <Card
      key={componentInfo.name}
      className="relative flex flex-col justify-between h-120 overflow-hidden"
    >
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {componentInfo.name}{" "}
          {componentInfo.tsx && (
            <div className="flex gap-0">
              <Button
                size="xs"
                className="h-[26px] w-22 rounded-sm rounded-r-none"
                variant={view === "preview" ? "default" : "secondary"}
                onClick={() => setView("preview")}
              >
                <Eye size={10} /> Preview
              </Button>
              <Button
                size="xs"
                className="h-[26px] w-22 rounded-sm rounded-l-none"
                variant={view === "code" ? "default" : "secondary"}
                onClick={() => setView("code")}
              >
                <Code size={10} /> Code
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>{componentInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center flex-1 min-h-0 relative">
        {view === "preview" ? (
          previewContent
        ) : (
          <>
            <div
              className="relative w-full h-full flex justify-center text-xs rounded-md overflow-hidden"
              style={{ scrollbarGutter: "stable both-edges" }}
            >
              <div className="overflow-auto relative">
                <Button
                  size="xs"
                  variant="secondary"
                  className="absolute top-1 left-1 z-10"
                  onClick={() => {
                    navigator.clipboard.writeText(componentInfo.tsx || "");
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                >
                  {isCopied ? <Check size={10} /> : <Copy size={10} />}
                </Button>
                <ShikiHighlighter
                  showLineNumbers
                  language="tsx"
                  theme={theme === "dark" ? "github-dark" : "one-light"}
                  className="text-xs inline-block min-w-max w-full"
                >
                  {componentInfo.tsx || ""}
                </ShikiHighlighter>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex items-center pt-2 gap-2">
        {withDocs && componentInfo.href && (
          <Button asChild size="sm" variant="secondary">
            <Link
              href={componentInfo.href}
              className="text-primary hover:underline"
            >
              <BookText /> Docs & Examples→
            </Link>
          </Button>
        )}
        {/* <OpenInV0Button
          name={componentInfo.code}
          title={componentInfo.name}
          variant="outline"
          prompt={
            (typeof componentInfo.description === "string"
              ? componentInfo.description
              : getTextFromNode(componentInfo.description)) ||
            `${componentInfo.name} - explain this code`
          }
        /> */}
      </CardFooter>
    </Card>
  );
}

// function getTextFromNode(node: ReactNode): string {
//   if (node === null || node === undefined || node === false || node === true)
//     return "";
//   if (typeof node === "string" || typeof node === "number") return String(node);
//   if (Array.isArray(node)) return node.map(getTextFromNode).join("");
//   if (isValidElement(node)) {
//     const element = node as ReactElement<{ children?: ReactNode }>;
//     return getTextFromNode(element.props.children as ReactNode);
//   }
//   return "";
// }
