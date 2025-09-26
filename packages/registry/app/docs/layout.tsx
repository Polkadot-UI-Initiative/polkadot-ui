import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/app/docs/layout.config";
import { source } from "@/lib/source";
import { Footer } from "@/components/layout/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      nav={{
        enabled: false,
      }}
      sidebar={{
        className: "mt-14",
        collapsible: false,
      }}
    >
      {children}
      <Footer />
    </DocsLayout>
  );
}
