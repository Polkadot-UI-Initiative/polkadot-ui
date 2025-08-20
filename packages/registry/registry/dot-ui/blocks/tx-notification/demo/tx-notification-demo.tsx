"use client";

import { Input } from "@/registry/dot-ui/ui/input";
import { ReactNode, useState, useEffect } from "react";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import type { KeyringPair } from "@polkadot/keyring/types";
import { SimpleTxButton } from "../components/simple-tx-button";

interface TxNotificationDemoProps {
    Provider: React.ComponentType<{ children: ReactNode }>;
    defaultMessage?: string;
    placeholder?: string;
}

export function TxNotificationDemo({
    Provider,
    defaultMessage = "",
    placeholder = "Enter your remark message...",
}: TxNotificationDemoProps) {
  const [message, setMessage] = useState(defaultMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [demoKeypair, setDemoKeypair] = useState<KeyringPair | null>(null);
  const [cryptoReady, setCryptoReady] = useState(false);

  useEffect(() => {
    const initCrypto = async () => {
      try {
        await cryptoWaitReady();
        setCryptoReady(true);

        const keyring = new Keyring({ type: "sr25519" });
        const keypair = keyring.addFromUri("//Alice", { name: "Alice" });
        setDemoKeypair(keypair);
      } catch (error) {
        console.error("Failed to initialize crypto:", error);
      }
    };

    initCrypto();
  }, []);

  const isInitializing = !cryptoReady || !demoKeypair;

    return (
        <Provider>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="remark-input" className="text-sm font-medium">
                    Remark Message
                    </label>
                    <Input
                    id="remark-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                    {cryptoReady && demoKeypair
                        ? `Demo using Alice test account: ${demoKeypair.address}`
                        : "Initializing crypto..."}
                    </p>
                </div>
                <SimpleTxButton
                    isLoading={isLoading}
                    isDisabled={isInitializing}
                    keypair={demoKeypair}
                    onSendingTx={setIsLoading}
                />
            </div>
        </Provider>
    );
}