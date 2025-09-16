"use client";

import { ComponentExample } from "../examples/types.examples";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { OpenInV0Button } from "../open-in-v0-button";

import Link from "next/link";
import { BookText, Check, Code, Copy, Eye } from "lucide-react";
import { isValidElement, ReactElement, ReactNode, useState } from "react";

import ShikiHighlighter from "react-shiki";

export function ComponentPreview({
  componentInfo,
}: {
  componentInfo: ComponentExample;
}) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Card
      key={componentInfo.name}
      className="relative flex flex-col justify-between h-120 overflow-hidden"
    >
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {componentInfo.name}{" "}
          {componentInfo.tsx && (
            <div className="flex gap-1">
              <Button
                size="xs"
                className="h-[26px] rounded-xs"
                variant={view === "preview" ? "default" : "secondary"}
                onClick={() => setView("preview")}
              >
                <Eye size={10} /> Preview
              </Button>
              <Button
                size="xs"
                className="h-[26px] rounded-xs"
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
          componentInfo.component
        ) : (
          <>
            <Button
              size="xs"
              variant="secondary"
              className="absolute top -1 left-7 z-10"
              onClick={() => {
                navigator.clipboard.writeText(componentInfo.tsx || "");
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
              {isCopied ? <Check size={10} /> : <Copy size={10} />}
            </Button>
            <div className="text-xs relative w-full h-full overflow-auto flex items-center justify-center">
              <ShikiHighlighter
                showLineNumbers
                language="tsx"
                theme="nord"
                className="text-xs w-full"
              >
                {componentInfo.tsx || ""}
              </ShikiHighlighter>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex items-center pt-2 gap-2">
        <Button asChild size="sm" variant="secondary">
          <Link
            href={componentInfo.href}
            className="text-primary hover:underline"
          >
            <BookText /> Docs →
          </Link>
        </Button>
        <OpenInV0Button
          name={componentInfo.code}
          title={componentInfo.name}
          variant="outline"
          prompt={
            (typeof componentInfo.description === "string"
              ? componentInfo.description
              : getTextFromNode(componentInfo.description)) ||
            `${componentInfo.name} - explain this code`
          }
        />
      </CardFooter>
    </Card>
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
