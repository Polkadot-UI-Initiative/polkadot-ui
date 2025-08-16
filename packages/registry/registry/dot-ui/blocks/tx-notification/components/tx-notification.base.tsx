import React, { useMemo } from "react";
import { toast } from "sonner";
import { ISubmittableResult, TxStatus } from "dedot/types";
import { NetworkInfo } from "typink";

export type TxNotificationProps = {
  onTxProgress: (progress: ISubmittableResult) => void;
  onTxError: (e: Error) => void;
};

export function txNotification(
  initialMessage: string = "Signing Transaction...",
  currentChainConfig?: NetworkInfo | null
): TxNotificationProps {
  const toastId = "tx-notification";

  toast.loading(initialMessage, {
    id: toastId,
    duration: 5000,
    closeButton: true,
  });

  const onTxProgress = (progress: ISubmittableResult) => {
    let toastType: "success" | "error" | "info" | "default" = "default";
    let duration: number = Infinity;
    let toastMessage: string = "Transaction In Progress...";

    const { status, dispatchError } = progress;
    const succeeded = !dispatchError;

    if (status.type === "Finalized") {
      duration = 5_000;
      toastType = succeeded ? "success" : "error";
      toastMessage = succeeded
        ? "Transaction Successful"
        : "Transaction Failed";
      // TODO: show dispatchError detailed error when Transaction Failed
    } else if (status.type === "Invalid" || status.type === "Drop") {
      duration = 5_000;
      toastType = "error";
      toastMessage = "Transaction Failed";
    }

    const toastComponent = (
      <TxProgress
        message={toastMessage}
        status={status}
        currentChainConfig={currentChainConfig ?? undefined}
      />
    );

    if (toastType === "success") {
      toast.success(toastComponent, {
        id: toastId,
        duration,
        closeButton: true,
      });
    } else if (toastType === "error") {
      toast.error(toastComponent, {
        id: toastId,
        duration,
        closeButton: true,
      });
    } else {
      toast.info(toastComponent, {
        id: toastId,
        duration,
        closeButton: true,
      });
    }
  };

  const onTxError = (e: Error) => {
    toast.error(<p>{e.message}</p>, {
      id: toastId,
      duration: 5_000,
      dismissible: true,
    });
  };

  return {
    onTxProgress,
    onTxError,
  };
}

const getBlockInfo = (status: TxStatus): string | null => {
  if (status.type === "BestChainBlockIncluded" || status.type === "Finalized") {
    return `(#${status.value.blockNumber} / ${status.value.txIndex})`;
  }

  if (
    (status.type === "Invalid" || status.type === "Drop") &&
    status.value.error
  ) {
    return `(${status.value.error})`;
  }

  return null;
};

interface TxProgressProps {
  message: string;
  status: TxStatus;
  currentChainConfig?: NetworkInfo | null;
}

function TxProgress({ message, status, currentChainConfig }: TxProgressProps) {
  const { label: viewOnExplorer, url: explorerUrl } = useMemo(() => {
    if (
      (status.type === "BestChainBlockIncluded" ||
        status.type === "Finalized") &&
      currentChainConfig
    ) {
      const { subscanUrl, pjsUrl } = currentChainConfig;

      if (subscanUrl) {
        return {
          label: "View transaction on Subscan",
          url: `${subscanUrl}/extrinsic/${status.value.blockNumber}-${status.value.txIndex}`,
        };
      }

      if (pjsUrl) {
        return {
          label: "View transaction on Polkadot.js",
          url: `${pjsUrl}#/explorer/query/${status.value.blockHash}`,
        };
      }
    }

    return { label: null, url: "" };
  }, [status, currentChainConfig]);

  return (
    <div className="flex flex-col gap-1">
      <p className="font-medium">{message}</p>
      <p className="text-xs text-muted-foreground">
        {status.type} {getBlockInfo(status)}
      </p>

      {viewOnExplorer && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
        >
          👉 {viewOnExplorer}
        </a>
      )}
    </div>
  );
}
