"use client";

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/registry/dot-ui/ui/button";
import { WalletSelection } from "@/registry/dot-ui/ui/wallet-connect.typink";

const queryClient = new QueryClient();

// Sample addresses for testing
const sampleAddresses = {
  ss58: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  ethereum: "0x8fedD9acDe24AD1BF21B9B3370Aff6Bddae65dC3",
};

interface AddressInputDemoProps {
  Provider: React.ComponentType<{ children: ReactNode }>;
  AddressInput: React.ComponentType<{
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    format?: "eth" | "ss58" | "both";
    className?: string;
    truncate?: number;
  }>;
  libraryName: string;
}

export function AddressInputDemo({
  Provider,
  AddressInput,
  libraryName,
}: AddressInputDemoProps) {
  const [address, setAddress] = useState("");

  const handleTryAddress = (sampleAddress: string) => {
    setAddress(sampleAddress);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Connect Wallet
            </h1>
            <p className="text-gray-600 text-lg">
              A wallet connection component provided by Typink.
            </p>
            <p className="text-sm text-primary mt-2">
              Using Typink and its provider.
            </p>
          </div>

          <div className="text-center mb-12">
            <WalletSelection />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Address Input
            </h1>
            <p className="text-gray-600 text-lg">
              Enter a Polkadot SS58 address or Ethereum address to validate and
              lookup identity information
            </p>
            <p className="text-sm text-primary mt-2">
              Using {libraryName} provider
            </p>
          </div>

          {/* Main Address Input */}
          <div className="mb-12">
            <label className="block text-sm font-medium text-primary mb-3">
              Address
            </label>
            <AddressInput
              placeholder="Enter SS58 or Ethereum address..."
              value={address}
              onChange={setAddress}
              format="both"
              className="w-full"
              truncate={8}
            />
          </div>

          {/* Sample Addresses */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-3">Sample Addresses</h2>
            <p className="text-muted-foreground mb-6">
              Try these sample addresses to test the validation and identity
              lookup
            </p>

            <div className="space-y-4">
              {/* SS58 Address */}
              <div>
                <h3 className="font-medium text-primary mb-2">
                  SS58 Address (Polkadot)
                </h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <code className="flex-1 text-sm font-mono text-primary">
                    {sampleAddresses.ss58}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTryAddress(sampleAddresses.ss58)}
                  >
                    Try
                  </Button>
                </div>
              </div>

              {/* Ethereum Address */}
              <div>
                <h3 className="font-medium text-primary mb-2">
                  Ethereum Address
                </h3>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <code className="flex-1 text-sm font-mono text-primary">
                    {sampleAddresses.ethereum}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTryAddress(sampleAddresses.ethereum)}
                  >
                    Try
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-bold text-primary mb-6">Features</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-primary">
                  Real-time address validation for SS58 and Ethereum formats
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-primary">
                  Identity lookup for Polkadot addresses using {libraryName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-primary">
                  Visual feedback with validation icons and badges
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-primary">
                  Responsive design with loading states
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-primary">
                  TypeScript support with full type safety
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="text-primary">
                  Optional identicon display and address truncation
                </span>
              </div>
            </div>
          </div>
        </div>
      </Provider>
    </QueryClientProvider>
  );
}
