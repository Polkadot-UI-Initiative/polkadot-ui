"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { generateTweakCnCss } from "@/components/theme/tweakcn-generator";

interface TweakItem {
  name: string;
  title?: string;
  type: string;
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

interface TweakcnContextValue {
  switchTheme: (themeName: string) => void;
}

const TweakcnContext = React.createContext<TweakcnContextValue | undefined>(
  undefined
);

export function useTweakcn(): TweakcnContextValue {
  const ctx = React.useContext(TweakcnContext);
  if (!ctx) throw new Error("useTweakcn must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  const [themes, setThemes] = React.useState<TweakItem[]>([]);
  const [css, setCss] = React.useState<string>("");
  const [pendingTheme, setPendingTheme] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function loadRegistry() {
      try {
        const res = await fetch("https://tweakcn.com/r/registry.json", {
          cache: "force-cache",
        });
        const { items } = (await res.json()) as { items: TweakItem[] };
        if (cancelled) return;
        setThemes(items.filter((i) => i.type === "registry:style"));
      } catch {
        // noop
      }
    }
    loadRegistry();
    return () => {
      cancelled = true;
    };
  }, []);

  const switchTheme = React.useCallback(
    (themeName: string) => {
      try {
        if (!themes.length) {
          setPendingTheme(themeName);
          return;
        }
        const item = themes.find((t) => t.name === themeName);
        if (!item) return;
        setCss(generateTweakCnCss(item));
      } catch {
        // noop
      }
    },
    [themes]
  );

  React.useEffect(() => {
    if (!pendingTheme || !themes.length) return;
    const item = themes.find((t) => t.name === pendingTheme);
    if (item) setCss(generateTweakCnCss(item));
    setPendingTheme(null);
  }, [themes, pendingTheme]);

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      <TweakcnContext.Provider value={{ switchTheme }}>
        <style
          id="tweakcn-style"
          type="text/css"
          dangerouslySetInnerHTML={{ __html: css }}
        />
        {children}
      </TweakcnContext.Provider>
    </NextThemesProvider>
  );
}
