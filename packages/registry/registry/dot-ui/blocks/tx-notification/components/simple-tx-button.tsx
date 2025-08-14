"use client";

import { useState, useEffect } from "react";
import { Button } from "@/registry/dot-ui/ui/button";
import { Input } from "@/registry/dot-ui/ui/input";
import { 
  PolkadotProvider, 
  useTypedPolkadotApi 
} from "@/registry/dot-ui/providers/dedot-provider";
import { txNotification } from "./tx-notification.base";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { ISubmittableResult } from "dedot/types";
import type { KeyringPair } from "@polkadot/keyring/types";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";
import { getChainConfig } from "@/registry/dot-ui/lib/utils.dot-ui";

interface SimpleTxButtonProps {
  defaultMessage?: string;
  buttonText?: string;
  placeholder?: string;
}

export function SimpleTxButton({
  defaultMessage = "",
  buttonText = "Send Remark",
  placeholder = "Enter your remark message...",
}: SimpleTxButtonProps) {
  const [message, setMessage] = useState(defaultMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [demoKeypair, setDemoKeypair] = useState<KeyringPair | null>(null);
  const [cryptoReady, setCryptoReady] = useState(false);
  const api = useTypedPolkadotApi();
  const { currentChain } = useDedot();
  const currentChainConfig = getChainConfig(dotUiConfig.chains, currentChain);

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

  const handleSubmit = async () => {
    if (!api || !message.trim() || !demoKeypair) {
      return;
    }

    setIsLoading(true);
    const toaster = txNotification(
      "Signing Transaction...",
      currentChainConfig
    );

    try {
      const remarkTx = api.tx.system.remark(message);

      await remarkTx.signAndSend(demoKeypair, (result: ISubmittableResult) => {
        const { status } = result;

        if (status.type === "BestChainBlockIncluded") {
          setMessage("");
        }

        toaster.onTxProgress(result);
      });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error("Transaction failed");
      toaster.onTxError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <Button
        onClick={handleSubmit}
        disabled={
          !api || !message.trim() || isLoading || !cryptoReady || !demoKeypair
        }
        className="w-full"
      >
        {!cryptoReady
          ? "Initializing..."
          : isLoading
            ? "Sending..."
            : buttonText}
      </Button>
    </div>
  );
}

// Wrapped version with provider for drop-in usage
export function SimpleTxButtonWithProvider(props: SimpleTxButtonProps) {
  return (
    <PolkadotProvider>
      <SimpleTxButton {...props} />
    </PolkadotProvider>
  );
}

SimpleTxButtonWithProvider.displayName = "SimpleTxButtonWithProvider";
