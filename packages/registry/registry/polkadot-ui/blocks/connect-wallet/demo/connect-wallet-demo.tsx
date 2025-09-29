"use client";

import { type ReactNode } from "react";

interface ConnectWalletDemoProps {
  Provider: React.ComponentType<{ children: ReactNode }>;
  ConnectWallet: React.ComponentType;
  libraryName: string;
}

export function ConnectWalletDemo({
  ConnectWallet,
  Provider,
  libraryName,
}: ConnectWalletDemoProps) {
  return (
    <Provider>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">Connect Wallet</h1>
        <p className="text-gray-600 text-lg">
          A wallet connection component provided by Typink.
        </p>
        <p className="text-sm text-primary mt-2">
          Using {libraryName} and its provider.
        </p>
      </div>

      <div className="text-center mb-12">
        <ConnectWallet />
      </div>
    </Provider>
  );
}
