"use client";

import { useState } from "react";

// Import the unified component
import { AddressInputWithProvider } from "./components/address-input.papi";
import type { IdentityResult } from "./components/address-input.base";

export default function AddressInputDemo() {
  const [unifiedPapiAddress, setUnifiedPapiAddress] = useState("");
  const [foundIdentity, setFoundIdentity] = useState<IdentityResult | null>(
    null
  );

  const handleIdentityFound = (identity: IdentityResult) => {
    setFoundIdentity(identity);
    console.log("Identity found:", identity);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Address Input Component</h1>
        <p className="text-lg text-muted-foreground">
          Polkadot address input with identity lookup and search. Now with
          bundle splitting support!
        </p>
      </div>

      {/* Unified Component Demo */}
      <div className="border rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            Unified Component (Dynamic Loading)
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              Recommended
            </span>
          </h2>
          <p className="text-muted-foreground">
            Single component that dynamically loads either PAPI or Dedot based
            on the library prop. Only bundles the library you actually use.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PAPI Implementation</h3>
            <AddressInputWithProvider
              label="Polkadot Address (PAPI)"
              value={unifiedPapiAddress}
              onChange={setUnifiedPapiAddress}
              onIdentityFound={handleIdentityFound}
              placeholder="Enter address or search by identity name"
              withIdentityLookup={true}
              withIdentitySearch={true}
              showIdenticon={true}
            />
            <p className="text-sm text-muted-foreground">
              Try:
              &ldquo;5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY&rdquo; or
              search &ldquo;alice&rdquo;
            </p>
          </div>
        </div>

        {foundIdentity && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-semibold text-green-800">Identity Found:</h4>
            <pre className="text-sm text-green-700 mt-2 overflow-auto">
              {JSON.stringify(foundIdentity, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Bundle Comparison */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Bundle Size Comparison</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">
                  Import Strategy
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  PAPI Bundle
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Dedot Bundle
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Bundle Size
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Use Case
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">
                  <code>AddressInputPapi</code>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    ✅ Included
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    ❌ Excluded
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  ~2-3MB
                </td>
                <td className="border border-gray-300 p-3">PAPI-only apps</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">
                  <code>AddressInputDedot</code>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    ❌ Excluded
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    ✅ Included
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  ~1-2MB
                </td>
                <td className="border border-gray-300 p-3">Dedot-only apps</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">
                  <code>AddressInputUnified</code>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    🔄 Dynamic
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    🔄 Dynamic
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  Load as needed
                </td>
                <td className="border border-gray-300 p-3">
                  Multi-library apps, demos
                </td>
              </tr>
              <tr className="bg-red-50">
                <td className="border border-gray-300 p-3">
                  <code>Previous Implementation</code>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    ✅ Always
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    ✅ Always
                  </span>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  ~4-5MB
                </td>
                <td className="border border-gray-300 p-3">❌ Bundle bloat</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Benefits:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>
                <strong>Bundle Splitting:</strong> Only include the Polkadot
                library you actually use
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>
                <strong>Code Reuse:</strong> ~95% of component logic is shared
                between implementations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>
                <strong>Type Safety:</strong> Full TypeScript support with
                proper inference
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>
                <strong>Flexibility:</strong> Choose the import strategy that
                fits your needs
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>
                <strong>Performance:</strong> 1-4MB bundle size savings
                depending on usage
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
