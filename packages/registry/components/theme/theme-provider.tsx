"use client";

import { generateTweakCnCss } from "@/components/theme/tweakcn-generator";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

const TweakcnContext = createContext<TweakcnContextValue | undefined>(
  undefined
);

export function useTweakcn(): TweakcnContextValue {
  const ctx = useContext(TweakcnContext);
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
  const [themes, setThemes] = useState<TweakItem[]>([]);
  const [css, setCss] = useState<string>("");
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);

  function normalizeFontName(name: string): string {
    if (!name) return "";
    const cleaned = name.replace(/^[\'"\s]+|[\'"\s]+$/g, "");
    return cleaned;
  }

  const isSystemFont = useCallback((name: string): boolean => {
    if (!name) return true;
    const n = name.toLowerCase();
    const systemFonts = new Set([
      "ui-sans-serif",
      "ui-serif",
      "ui-monospace",
      "system-ui",
      "-apple-system",
      "segoe ui",
      "helvetica",
      "arial",
      "noto sans",
      "apple color emoji",
      "segoe ui emoji",
      "segoe ui symbol",
      "times new roman",
      "times",
      "georgia",
      "cambria",
      "consolas",
      "menlo",
      "monaco",
      "liberation mono",
      "courier new",
      "serif",
      "sans-serif",
      "monospace",
    ]);
    return systemFonts.has(n);
  }, []);

  const extractPrimaryFont = useCallback(
    (value: string | undefined): string => {
      if (!value) return "";
      const primary = value.split(",")[0] || "";
      return normalizeFontName(primary);
    },
    []
  );

  const collectGoogleFontFamilies = useCallback(
    (item: TweakItem): string[] => {
      const families = new Set<string>();
      const allScopes = [
        item.cssVars?.theme ?? {},
        item.cssVars?.light ?? {},
        item.cssVars?.dark ?? {},
      ];
      for (const scope of allScopes) {
        const sans = extractPrimaryFont(scope["font-sans"]);
        const serif = extractPrimaryFont(scope["font-serif"]);
        const mono = extractPrimaryFont(scope["font-mono"]);
        for (const f of [sans, serif, mono]) {
          if (!f) continue;
          if (isSystemFont(f)) continue;
          families.add(f);
        }
      }
      return Array.from(families);
    },
    [extractPrimaryFont, isSystemFont]
  );

  const toGoogleFontsHref = useCallback((families: string[]): string | null => {
    if (!families.length) return null;
    const params = families
      .map(
        (f) =>
          `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`
      )
      .join("&");
    return `https://fonts.googleapis.com/css2?${params}&display=swap`;
  }, []);

  const ensureHeadLink = useCallback(
    (id: string, rel: string, href: string, crossOrigin?: string) => {
      if (typeof document === "undefined") return;
      let el = document.getElementById(id) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.id = id;
        document.head.appendChild(el);
      }
      el.setAttribute("rel", rel);
      el.setAttribute("href", href);
      if (crossOrigin) el.setAttribute("crossorigin", crossOrigin);
    },
    []
  );

  const removeHeadElement = useCallback((id: string) => {
    if (typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }, []);

  const clearInjectedTheme = useCallback(() => {
    setCss("");
    removeHeadElement("tweakcn-fonts-preconnect-1");
    removeHeadElement("tweakcn-fonts-preconnect-2");
    removeHeadElement("tweakcn-fonts");
    removeHeadElement("tweakcn-font-vars");
  }, [removeHeadElement]);

  const applyGoogleFontsForTheme = useCallback(
    (item: TweakItem) => {
      try {
        const families = collectGoogleFontFamilies(item);
        const href = toGoogleFontsHref(families);
        if (!href) {
          removeHeadElement("tweakcn-fonts-preconnect-1");
          removeHeadElement("tweakcn-fonts-preconnect-2");
          removeHeadElement("tweakcn-fonts");
          removeHeadElement("tweakcn-font-vars");
          return;
        }
        ensureHeadLink(
          "tweakcn-fonts-preconnect-1",
          "preconnect",
          "https://fonts.googleapis.com"
        );
        ensureHeadLink(
          "tweakcn-fonts-preconnect-2",
          "preconnect",
          "https://fonts.gstatic.com",
          "anonymous"
        );
        ensureHeadLink("tweakcn-fonts", "stylesheet", href);

        // Also override Geist font variables so Tailwind tokens resolve to the theme fonts
        const scopes = [
          item.cssVars?.theme ?? {},
          item.cssVars?.light ?? {},
          item.cssVars?.dark ?? {},
        ];
        const primarySans = extractPrimaryFont(
          scopes.find((s) => s["font-sans"])?.["font-sans"]
        );
        const primaryMono = extractPrimaryFont(
          scopes.find((s) => s["font-mono"])?.["font-mono"]
        );
        const cssVars: string[] = [];
        if (primarySans)
          cssVars.push(`  --font-geist-sans: ${primarySans}, sans-serif;`);
        if (primaryMono)
          cssVars.push(`  --font-geist-mono: ${primaryMono}, monospace;`);
        const styleElId = "tweakcn-font-vars";
        const existing =
          typeof document !== "undefined"
            ? document.getElementById(styleElId)
            : null;
        const block = cssVars.length ? `:root{\n${cssVars.join("\n")}\n}` : "";
        if (block && typeof document !== "undefined") {
          const styleEl = existing ?? document.createElement("style");
          styleEl.id = styleElId;
          styleEl.setAttribute("type", "text/css");
          styleEl.textContent = block;
          if (!existing) document.head.appendChild(styleEl);
        }
      } catch {
        // noop
      }
    },
    [
      removeHeadElement,
      extractPrimaryFont,
      ensureHeadLink,
      collectGoogleFontFamilies,
      toGoogleFontsHref,
    ]
  );

  useEffect(() => {
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
  }, [setThemes]);

  const switchTheme = useCallback(
    (themeName: string) => {
      try {
        if (themeName === "default") {
          clearInjectedTheme();
          return;
        }
        if (!themes.length) {
          setPendingTheme(themeName);
          return;
        }
        const item = themes.find((t) => t.name === themeName);
        if (!item) return;
        setCss(generateTweakCnCss(item));
        applyGoogleFontsForTheme(item);
      } catch {
        // noop
      }
    },
    [themes, applyGoogleFontsForTheme, clearInjectedTheme]
  );

  useEffect(() => {
    if (!pendingTheme || !themes.length) return;
    if (pendingTheme === "default") {
      clearInjectedTheme();
    } else {
      const item = themes.find((t) => t.name === pendingTheme);
      if (!item) {
        setPendingTheme(null);
        return;
      }
      setCss(generateTweakCnCss(item));
      applyGoogleFontsForTheme(item);
    }
    setPendingTheme(null);
  }, [themes, pendingTheme, clearInjectedTheme, applyGoogleFontsForTheme]);

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
