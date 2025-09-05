"use client";

import { Button } from "@/registry/dot-ui/ui/button";
import {
  PolkadotProvider,
  useTypedPolkadotApi,
} from "@/registry/dot-ui/providers/dedot-provider";
import { txNotification } from "./tx-notification.base";
import { ISubmittableResult } from "dedot/types";
import { useDedot } from "@/registry/dot-ui/providers/dedot-provider";
import { dotUiConfig } from "@/registry/dot-ui/lib/config.dot-ui";
import { getChainConfig } from "@/registry/dot-ui/lib/utils.dot-ui";
import type { KeyringPair } from "@polkadot/keyring/types";

export interface SimpleTxButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  keypair: KeyringPair | null;
  onSendingTx: (isLoading: boolean) => void;
  onMessageClear: (message: string) => void;
  message?: string;
  buttonText?: string;
}

export function SimpleTxButton({
  isLoading,
  isDisabled,
  keypair,
  onSendingTx,
  message = "",
  onMessageClear,
  buttonText = "Send Remark",
}: SimpleTxButtonProps) {
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

      let unsub: (() => void) | undefined;
      await remarkTx.signAndSend(
        keypair,
        (result: ISubmittableResult, unsubscribe: () => void) => {
          unsub = unsubscribe;
          const { status } = result;

          if (status.type === "BestChainBlockIncluded") {
            onMessageClear("");
          }

          if (
            status.type === "Finalized" ||
            status.type === "Invalid" ||
            status.type === "Drop"
          ) {
            onSendingTx(false);
            unsub?.();
          }

          toaster.onTxProgress(result);
        }
      );
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
      {isDisabled ? "Initializing..." : isLoading ? "Sending..." : buttonText}
    </Button>
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
