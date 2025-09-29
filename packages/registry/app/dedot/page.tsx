import { ComponentsSection } from "@/components/layout/components-section";
import { Suspense } from "react";

export default async function ComponentsPage() {
  return (
    <div className="flex flex-col mt-12">
      <h1 className="text-2xl font-bold mb-4 text-center">Dedot Components</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ComponentsSection usedLibrary="dedot" />
      </Suspense>
    </div>
  );
}
