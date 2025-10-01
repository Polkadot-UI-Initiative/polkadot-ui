"use client";

import Link from "next/link";
// import { destroyProviders } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import Image from "next/image";
import { Button } from "../ui/button";

type Lib = "papi" | "dedot";

export function LibrarySwitcher({ value }: { value: Lib }) {
  const active =
    "cursor-pointer border border-primary backdrop-blur-md w-24 bg-gradient-to-tr from-polkadot-pink to-polkadot-violet text-white";
  const inactive =
    "cursor-pointer bg-background/20 text-foreground border-muted-foreground/20 hover:bg-muted backdrop-blur-md w-24 ";

  return (
    <div className="flex items-center justify-center gap-2">
      <Link href="/" aria-pressed={value === "papi"} scroll={false}>
        <Button
          variant="ghost"
          className={`${value === "papi" ? active : inactive} inline-flex items-center justify-center rounded-md border px-3 py-2`}
        >
          <Image src="/logo-papi.svg" alt="papi" width={28} height={28} />
          papi
        </Button>
      </Link>
      <Link href="/dedot" aria-pressed={value === "dedot"} scroll={false}>
        <Button
          variant="ghost"
          className={`${value === "dedot" ? active : inactive} inline-flex items-center justify-center rounded-md border px-3 py-2`}
        >
          <Image src="/logo-dedot.jpg" alt="dedot" width={28} height={28} />
          dedot
        </Button>
      </Link>
    </div>
  );
}
