import { lazy } from "react";
import {
  AddressInputBaseProps,
  AddressInputProvider,
} from "./address-input.base";
import { PolkadotProvider as PapiProvider } from "@/registry/dot-ui/providers/papi-provider";
import { PolkadotProvider as DedotProvider } from "@/registry/dot-ui/providers/dedot-provider";

const AddressInputPapi = lazy(() =>
  import("./address-input.papi").then((module) => ({
    default: module.AddressInput,
  }))
);
const AddressInputDedot = lazy(() =>
  import("./address-input.dedot").then((module) => ({
    default: module.AddressInput,
  }))
);

export function AddressInput({
  library,
  ...props
}: AddressInputBaseProps & { library: "papi" | "dedot" }) {
  if (library === "papi") {
    return <AddressInputPapi {...props} />;
  } else if (library === "dedot") {
    return <AddressInputDedot {...props} />;
  }
  return null;
}

export function AddressInputWithProvider({
  library,
  ...props
}: AddressInputBaseProps & { library: "papi" | "dedot" }) {
  if (library === "papi") {
    return (
      <PapiProvider>
        <AddressInputProvider>
          <AddressInput library={library} {...props} />
        </AddressInputProvider>
      </PapiProvider>
    );
  } else if (library === "dedot") {
    return (
      <DedotProvider>
        <AddressInputProvider>
          <AddressInput library={library} {...props} />
        </AddressInputProvider>
      </DedotProvider>
    );
  }
}
