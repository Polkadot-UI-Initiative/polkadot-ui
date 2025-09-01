import DedotDemo from "@/registry/dot-ui/blocks/dedot-demo/dedot-demo";
import { ClientOnly } from "@/registry/dot-ui/blocks/client-only";

export default function DedotDemoPage() {
  return (
    <ClientOnly>
      <DedotDemo />
    </ClientOnly>
  );
}
