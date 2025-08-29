import { Card, CardContent } from "../ui/card";

interface ExamplePlaceholderProps {
  title: string;
  description?: string;
}

export function ExamplePlaceholder({ title }: ExamplePlaceholderProps) {
  return (
    <Card className="relative w-full overflow-hidden border border-border bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_50%_-20%,theme(colors.pink.500/15%),transparent_60%),linear-gradient(to_bottom_right,theme(colors.zinc.900/40%),theme(colors.zinc.800/60%))]" />
      <CardContent className="relative flex min-h-28 items-center justify-between gap-4 p-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wide text-white/75">
          Coming soon
        </span>
      </CardContent>
    </Card>
  );
}
