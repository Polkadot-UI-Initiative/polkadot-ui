"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import {
  AddressInputBaseProps,
  AddressInputProvider,
} from "./address-input.base";

// Create a shared props type that excludes services (since individual components handle that)
export type SharedAddressInputProps = Omit<
  AddressInputBaseProps,
  "services"
> & {
  library: "papi" | "dedot";
};

// Fallback component for when import fails
function ImportFailedComponent() {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
      ❌ Component failed to load. Please check your package installation.
    </div>
  );
}

// Fallback provider component
function FallbackProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Lazy load components with error handling
const AddressInputPapi = lazy(() =>
  import("./address-input.papi")
    .then((module) => ({ default: module.AddressInput }))
    .catch(() => ({ default: ImportFailedComponent }))
);

const AddressInputDedot = lazy(() =>
  import("./address-input.dedot")
    .then((module) => ({ default: module.AddressInput }))
    .catch(() => ({ default: ImportFailedComponent }))
);

// Lazy load providers with error handling
const PapiProvider = lazy(() =>
  import("@/registry/dot-ui/providers/papi-provider")
    .then((module) => ({ default: module.PolkadotProvider }))
    .catch(() => ({ default: FallbackProvider }))
);

const DedotProvider = lazy(() =>
  import("@/registry/dot-ui/providers/dedot-provider")
    .then((module) => ({ default: module.PolkadotProvider }))
    .catch(() => ({ default: FallbackProvider }))
);

interface LoadingState {
  papiLoaded: boolean | null; // null = loading, true = success, false = failed
  dedotLoaded: boolean | null;
  papiProviderLoaded: boolean | null;
  dedotProviderLoaded: boolean | null;
}

function ComponentLoader({
  library,
  children,
}: {
  library: "papi" | "dedot";
  children: React.ReactNode;
}) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    papiLoaded: null,
    dedotLoaded: null,
    papiProviderLoaded: null,
    dedotProviderLoaded: null,
  });

  useEffect(() => {
    // Test if components can be loaded
    const testPapi = import("./address-input.papi")
      .then(() => setLoadingState((prev) => ({ ...prev, papiLoaded: true })))
      .catch(() => setLoadingState((prev) => ({ ...prev, papiLoaded: false })));

    const testDedot = import("./address-input.dedot")
      .then(() => setLoadingState((prev) => ({ ...prev, dedotLoaded: true })))
      .catch(() =>
        setLoadingState((prev) => ({ ...prev, dedotLoaded: false }))
      );

    // Test if providers can be loaded
    const testPapiProvider = import("@/registry/dot-ui/providers/papi-provider")
      .then(() =>
        setLoadingState((prev) => ({ ...prev, papiProviderLoaded: true }))
      )
      .catch(() =>
        setLoadingState((prev) => ({ ...prev, papiProviderLoaded: false }))
      );

    const testDedotProvider = import(
      "@/registry/dot-ui/providers/dedot-provider"
    )
      .then(() =>
        setLoadingState((prev) => ({ ...prev, dedotProviderLoaded: true }))
      )
      .catch(() =>
        setLoadingState((prev) => ({ ...prev, dedotProviderLoaded: false }))
      );

    Promise.all([testPapi, testDedot, testPapiProvider, testDedotProvider]);
  }, []);

  // If requested library is still loading
  if (
    loadingState[`${library}Loaded`] === null ||
    loadingState[`${library}ProviderLoaded`] === null
  ) {
    return (
      <div className="p-4 text-center">Loading {library} component...</div>
    );
  }

  const componentLoaded = loadingState[`${library}Loaded`];
  const providerLoaded = loadingState[`${library}ProviderLoaded`];

  // If requested library failed to load
  if (componentLoaded === false || providerLoaded === false) {
    // Try to use the other library as fallback
    const fallbackLibrary = library === "papi" ? "dedot" : "papi";
    const fallbackComponentLoaded = loadingState[`${fallbackLibrary}Loaded`];
    const fallbackProviderLoaded =
      loadingState[`${fallbackLibrary}ProviderLoaded`];

    if (fallbackComponentLoaded === true && fallbackProviderLoaded === true) {
      return (
        <div className="space-y-2">
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ⚠️ {library} package not available, using {fallbackLibrary} instead
          </div>
          {children}
        </div>
      );
    } else if (
      fallbackComponentLoaded === false ||
      fallbackProviderLoaded === false
    ) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
          ❌ Neither {library} nor {fallbackLibrary} packages are available.
          Please install polkadot-api or dedot.
        </div>
      );
    } else {
      return (
        <div className="p-4 text-center">Checking available packages...</div>
      );
    }
  }

  return <>{children}</>;
}

export function AddressInput(props: SharedAddressInputProps) {
  const { library, ...componentProps } = props;

  return (
    <ComponentLoader library={library}>
      <Suspense
        fallback={<div className="p-4 text-center">Loading component...</div>}
      >
        {library === "papi" ? (
          <AddressInputPapi {...componentProps} />
        ) : (
          <AddressInputDedot {...componentProps} />
        )}
      </Suspense>
    </ComponentLoader>
  );
}

export function AddressInputWithProvider(props: SharedAddressInputProps) {
  const { library } = props;
  const Provider = library === "papi" ? PapiProvider : DedotProvider;

  return (
    <ComponentLoader library={library}>
      <Suspense
        fallback={<div className="p-4 text-center">Loading provider...</div>}
      >
        <Provider>
          <AddressInputProvider>
            <AddressInput {...props} />
          </AddressInputProvider>
        </Provider>
      </Suspense>
    </ComponentLoader>
  );
}
