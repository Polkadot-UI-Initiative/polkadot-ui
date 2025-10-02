"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DEFAULT_STORAGE_KEY = "polkadot-ui:banner:dismissed" as const;

interface BannerProps {
  buttonText: string;
  buttonUrl: string;
  defaultVisible?: boolean;
  storageKey?: string;
}

export function Banner({
  buttonText,
  buttonUrl,
  defaultVisible = true,
  storageKey = DEFAULT_STORAGE_KEY,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const dismissed =
        typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (dismissed === "1") {
        setIsVisible(false);
        return;
      }
      setIsVisible(!!defaultVisible);
    } catch {
      setIsVisible(!!defaultVisible);
    }
  }, [defaultVisible, storageKey]);

  function handleClose() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <section className="bg-polkadot-pink/80 w-full p-4 z-20 fixed bottom-0 left-0 right-0 backdrop-blur-md">
      <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-center px-4">
        <div className="text-primary-foreground flex flex-col items-center gap-3 pt-2 md:flex-row md:items-center md:pt-0">
          <div className="flex flex-col gap-1 md:flex-row md:items-center">
            <p className="text-white text-sm px-8">
              Polkadot UI is in beta version. Please{" "}
              <Link
                href={buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                report any issues
              </Link>{" "}
              or join{" "}
              <Link
                href="https://t.me/polkadotui"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                our telegram
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={buttonUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="link" asChild>
              {buttonText}
            </Button>
          </Link>
        </div>
        <Button
          size="icon"
          aria-label="Dismiss banner"
          onClick={handleClose}
          className="absolute right-4 top-2 hover:bg-transparent bg-transparent shadow-none text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
