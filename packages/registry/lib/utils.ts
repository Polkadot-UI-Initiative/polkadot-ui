import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TweakItem = {
  name: string;
  title?: string;
  type: string;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
};

export async function getRegistryItems(): Promise<TweakItem[]> {
  let registryItems: TweakItem[] = [];
  try {
    const res = await fetch("https://tweakcn.com/r/registry.json", {
      cache: "force-cache",
      next: { revalidate: 86400 },
    });
    const { items } = (await res.json()) as { items: TweakItem[] };
    registryItems = items.filter((i) => i.type === "registry:style");
  } catch {}

  return registryItems;
}
