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
  const url = "https://tweakcn.com/r/registry.json";
  try {
    const res = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn("getRegistryItems: non-ok response", {
        url,
        status: res.status,
      });
      return registryItems;
    }

    const data = (await res.json()) as unknown;
    const items =
      (data &&
        typeof data === "object" &&
        (data as { items?: unknown }).items) ||
      [];

    if (!Array.isArray(items)) {
      console.warn("getRegistryItems: invalid payload; items is not an array", {
        url,
      });
      return registryItems;
    }

    registryItems = items
      .filter((i: unknown): i is TweakItem => {
        if (!i || typeof i !== "object") return false;
        const obj = i as Record<string, unknown>;
        return typeof obj.name === "string" && typeof obj.type === "string";
      })
      .filter((i) => i.type === "registry:style");
  } catch (error) {
    console.warn("getRegistryItems: fetch/parse failed", {
      url,
      error: (error as Error)?.message ?? String(error),
    });
  }

  return registryItems;
}
