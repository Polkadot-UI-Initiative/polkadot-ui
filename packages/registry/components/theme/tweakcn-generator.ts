export interface TweakCnTheme {
  cssVars?: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

function toCss(vars: Record<string, string> | undefined): string {
  if (!vars) return "";
  return Object.entries(vars)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
}

// Tailwind v4 friendly: emit :root and .dark with merged theme + mode vars
export function generateTweakCnCss(theme: TweakCnTheme): string {
  const base = theme.cssVars?.theme;
  const light = theme.cssVars?.light;
  const dark = theme.cssVars?.dark;

  const rootBlock = `:root{\n${toCss(base)}\n${toCss(light)}\n}`;
  const darkBlock = `.dark{\n${toCss(base)}\n${toCss(dark)}\n}`;
  return `${rootBlock}\n${darkBlock}`;
}
