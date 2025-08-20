"use client";

import { Input } from "@/registry/dot-ui/ui/input";
import { useState, useEffect } from "react";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import type { KeyringPair } from "@polkadot/keyring/types";
import { Button } from "@/registry/dot-ui/ui/button";
import {
  PolkadotProvider,
  useTypedPolkadotApi,
  useDedot,
} from "@/registry/dot-ui/providers/dedot-provider";
import { txNotification } from "./tx-notification.base";
import { ISubmittableResult } from "dedot/types";
import { dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";
import { getChainConfig, truncateAddress } from "@/registry/dot-ui/lib/utils.dot-ui";

interface TxButtonProps {
  message: string;
  isLoading: boolean;
  isDisabled: boolean;
  keypair: KeyringPair | null;
  onSendingTx: (isLoading: boolean) => void;
}

function TxButton({
  message,
  isLoading,
  isDisabled,
  keypair,
  onSendingTx,
}: TxButtonProps) {
  const api = useTypedPolkadotApi();
  const { currentChain } = useDedot();
  const currentChainConfig = getChainConfig(dotUiConfig.chains, currentChain);

  const handleSubmit = async () => {
    if (!api || !message.trim() || !keypair) {
      return;
    }

    onSendingTx(true);
    const toaster = txNotification(
      "Signing Transaction...",
      currentChainConfig
    );

    try {
      const remarkTx = api.tx.system.remark(message);

      await remarkTx.signAndSend(keypair, (result: ISubmittableResult) => {
        const { status } = result;

        if (status.type === "BestChainBlockIncluded") {
          // Transaction successful, could clear form here if needed
        }

        if (status.type === "Finalized" || status.type === "Invalid") {
          onSendingTx(false);
        }

        toaster.onTxProgress(result);
      });
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error("Transaction failed");
      toaster.onTxError(error);
      onSendingTx(false);
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={!api || !message.trim() || isLoading || isDisabled}
      className="w-full"
    >
      {isDisabled ? "Initializing..." : isLoading ? "Sending..." : "Send Remark"}
    </Button>
  );
}

function TxNotificationWithTxButtonInner() {
  const [message, setMessage] = useState("Hello from dot-ui.com!");
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
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <label htmlFor="remark-input" className="text-sm font-medium">
          Send Remark
        </label>
        <Input
          id="remark-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your remark message..."
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          {cryptoReady && demoKeypair
            ? `Demo using Alice test account: ${truncateAddress(demoKeypair.address)}`
            : "Initializing crypto..."}
        </p>
      </div>
      <TxButton
        message={message}
        isLoading={isLoading}
        isDisabled={isInitializing}
        keypair={demoKeypair}
        onSendingTx={setIsLoading}
      />
    </div>
  );
}

export function TxNotificationWithTxButton() {
  return (
    <PolkadotProvider>
      <TxNotificationWithTxButtonInner />
    </PolkadotProvider>
  );
}

TxNotificationWithTxButton.displayName = "TxNotificationWithTxButton";
