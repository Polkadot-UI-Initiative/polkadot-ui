"use client";

import { useTheme } from "next-themes";
import { useTweakcn } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Link from "next/link";
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

async function fetchRegistry(): Promise<TweakItem[]> {
  const res = await fetch("https://tweakcn.com/r/registry.json", {
    cache: "force-cache",
  });
  const { items } = (await res.json()) as { items: TweakItem[] };
  return items.filter((i) => i.type === "registry:style");
}

function resolveThemeVar(
  item: TweakItem,
  key: string,
  isDark: boolean
): string | undefined {
  const base = item.cssVars?.theme?.[key];
  const mode = isDark ? item.cssVars?.dark?.[key] : item.cssVars?.light?.[key];
  return mode ?? base;
}

// no-op placeholder removed – switching handled via provider

export interface ThemeToggleProps {
  initialItems?: TweakItem[];
}

export function ThemeToggle({ initialItems }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const { switchTheme } = useTweakcn();
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [items, setItems] = useState<TweakItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    setMounted(true);
    if (initialItems && initialItems.length) {
      setItems(initialItems);
      setSelected("default");
      switchTheme("default");
      return () => {
        cancelled = true;
      };
    }
    fetchRegistry()
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setSelected("default");
        switchTheme("default");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initialItems, switchTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
        <div className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          {theme === "light" ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
          <span className="sr-only">Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">Mode</span>
          <div className="flex gap-1">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                setTheme("light");
                if (selected) switchTheme(selected);
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                setTheme("dark");
                if (selected) switchTheme(selected);
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              Dark
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Theme</label>
          <Select
            value={selected}
            onValueChange={(value) => {
              setSelected(value);
              const item = items.find((i) => i.name === value);
              if (value === "default") switchTheme("default");
              else if (item) switchTheme(item.name);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              {items
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((i) => {
                  const isDark =
                    theme === "dark" ||
                    (theme === "system" &&
                      typeof window !== "undefined" &&
                      window.matchMedia &&
                      window.matchMedia("(prefers-color-scheme: dark)")
                        .matches);
                  const bg =
                    resolveThemeVar(i, "background", !!isDark) || "transparent";
                  const fg = resolveThemeVar(i, "foreground", !!isDark);
                  const primary = resolveThemeVar(i, "primary", !!isDark);
                  const secondary = resolveThemeVar(i, "secondary", !!isDark);
                  const accent = resolveThemeVar(i, "accent", !!isDark);
                  return (
                    <SelectItem
                      key={i.name}
                      value={i.name}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="ml-2 flex items-center gap-1 p-2 rounded-md"
                        style={{ backgroundColor: bg, color: fg }}
                      >
                        <span
                          className="h-3 w-3 rounded-full border"
                          style={{ backgroundColor: primary }}
                        />
                        <span
                          className="h-3 w-3 rounded-full border -ml-2"
                          style={{ backgroundColor: secondary }}
                        />
                        <span
                          className="h-3 w-3 rounded-full border -ml-2"
                          style={{ backgroundColor: accent }}
                        />
                      </span>
                      <span className="truncate">{i.title || i.name}</span>
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs mt-6">
          Polkadot UI is fully themable with tailwind css vars. Above themes
          provided by{" "}
          <Link href="https://tweakcn.com/" className="underline">
            tweakcn
          </Link>
          .
        </div>
      </PopoverContent>
    </Popover>
  );
}
