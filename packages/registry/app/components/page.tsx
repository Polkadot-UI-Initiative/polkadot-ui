import { ComponentsSection } from "@/components/layout/components-section";

export default async function ComponentsPage() {
  return (
    <div className="flex flex-col mt-12">
      <h1 className="text-2xl font-bold mb-4 text-center">Papi Components</h1>
      <ComponentsSection usedLibrary="papi" />
    </div>
  );
}
