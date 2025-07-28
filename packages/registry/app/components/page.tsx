import { AddressInputWithProvider } from "@/registry/dot-ui/blocks/address-input/components/address-input.shared";

export default function Docs() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <AddressInputWithProvider library="papi" />
      <AddressInputWithProvider library="dedot" />
    </div>
  );
}
