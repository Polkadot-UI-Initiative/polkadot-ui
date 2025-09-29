"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

type Lib = "papi" | "dedot";

export function LibrarySwitcher({ value }: { value: Lib }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLib = (next: Lib) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("lib", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const active = "border border-primary w-24 backdrop-blur-md";
  const inactive =
    "bg-background/20 text-foreground border-muted-foreground/20 hover:bg-muted w-24 backdrop-blur-md";

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        size="sm"
        className={`${value === "dedot" ? active : inactive}`}
        onClick={() => setLib("dedot")}
        aria-pressed={value === "dedot"}
      >
        dedot
      </Button>
      <Button
        size="sm"
        className={`${value === "papi" ? active : inactive}`}
        onClick={() => setLib("papi")}
        aria-pressed={value === "papi"}
      >
        papi
      </Button>
    </div>
  );
}
