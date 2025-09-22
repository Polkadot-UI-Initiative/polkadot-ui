"use client";

import { useMemo, type ReactNode } from "react";

import { Binary } from "polkadot-api";
import type { Transaction as PapiTransaction } from "polkadot-api";
// import JsonView from "@uiw/react-json-view";
import { JsonViewer } from "./json-tree-view";
// optional themed imports can be added if needed

export default function TxDetails({
  tx,
}: {
  tx: PapiTransaction<object, string, string, unknown>;
}) {
  const decoded = tx.decodedCall;

  const formattedDecoded = useMemo(
    () => formatBinariesToText(decoded.value.value),
    [decoded]
  );

  return (
    <div className="w-full overflow-scroll">
      {decoded !== null && (
        <div className="max-h-[60vh] overflow-auto rounded-md border p-3">
          <div className="text-xs mb-2 text-muted-foreground">
            <span className="mr-4">
              pallet: {JSON.stringify((decoded as { type?: unknown }).type)}
            </span>
            <span>
              method:{" "}
              {JSON.stringify(
                (decoded as { value?: { type?: unknown } }).value?.type
              )}
            </span>
          </div>

          <JsonViewer data={formattedDecoded} rootName="args" />
        </div>
      )}
    </div>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TxDetailsDialog({
  tx,
  trigger,
  title = "Review transaction details",
  description = "Please review your transaction",
}: {
  tx: PapiTransaction<object, string, string, unknown>;
  trigger?: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm">Review transaction details</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TxDetails tx={tx} />
      </DialogContent>
    </Dialog>
  );
}

function formatBinariesToText(input: unknown): unknown {
  if (input instanceof Binary) {
    try {
      return input.asText();
    } catch {
      try {
        return input.asHex();
      } catch {
        return String(input);
      }
    }
  }
  if (input instanceof Uint8Array) {
    // Fallback for raw bytes
    return Array.from(input)
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("");
  }
  if (Array.isArray(input)) {
    return input.map((v) => formatBinariesToText(v));
  }
  if (input && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      out[k] = formatBinariesToText(v);
    }
    return out;
  }
  return input;
}
