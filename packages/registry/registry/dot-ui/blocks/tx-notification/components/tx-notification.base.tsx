import { ISubmittableResult } from "dedot/types";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { NetworkInfo } from "typink";

function ChainLogo({ network }: { network: NetworkInfo | undefined }) {
  if (!network?.logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={network.logo}
      alt={network.name}
      className="absolute -right-1 -top-1 w-4 h-4 shadow-md"
    />
  );
}

export function beginTxStatusNotification(
  toastId: string | undefined,
  network: NetworkInfo | undefined,
  title: string = "Waiting for signature...",
  description: string = "Please sign the transaction in your wallet"
) {
  const id = toast.loading(
    <>
      <ChainLogo network={network} /> {title}
    </>,
    {
      id: toastId,
      description,
    }
  );
  return id as string;
}

export function cancelTxStatusNotification(
  toastId: string,
  network: NetworkInfo | undefined,
  title: string = "Transaction cancelled",
  description: string = ""
) {
  toast.info(
    <>
      <ChainLogo network={network} /> {title}
    </>,
    {
      id: toastId,
      description,
    }
  );
}

export function txStatusNotification(
  result: ISubmittableResult,
  toastId: string = "tx-status-notification",
  network: NetworkInfo | undefined,
  titles: {
    submitting: string;
    included: string;
    finalized: string;
    error: string;
  } = {
    submitting: "Transaction submitted",
    included: "Transaction included in block",
    finalized: "Transaction finalized",
    error: "Transaction failed",
  },
  descriptions: {
    submitting: string;
    included: string;
    finalized: string;
    error: string;
  } = {
    submitting: "Waiting for confirmation...",
    included: "Waiting for finalization...",
    finalized: "",
    error: "",
  }
) {
  const { status } = result;
  const explorerUrl = network?.subscanUrl ?? network?.pjsUrl;

  const action =
    result.txHash && explorerUrl
      ? {
          label: "View on explorer",
          onClick: () => {
            window.open(`${explorerUrl}/tx/${result.txHash}`, "_blank");
          },
        }
      : undefined;

  const chainLogo = <ChainLogo network={network} />;

  switch (status.type) {
    case "Broadcasting":
    case "Validated":
      toast.loading(
        <>
          {chainLogo} {titles.submitting}
        </>,
        {
          id: toastId,
          description: descriptions.submitting,
        }
      );
      break;
    case "BestChainBlockIncluded":
      toast.loading(
        <>
          {chainLogo} {titles.included}
        </>,
        {
          id: toastId,
          action,
          description: descriptions.included,
        }
      );
      break;
    case "Finalized":
      toast.success(
        <>
          {chainLogo} {titles.finalized}
        </>,
        {
          id: toastId,
          icon: <CheckCheck className="w-5 h-5" />,
          action,
          description: descriptions.finalized,
          duration: 10000,
          closeButton: true,
        }
      );
      break;
    case "Invalid":
    case "Drop":
      toast.error(
        <>
          {chainLogo} {titles.error}
        </>,
        {
          id: toastId,
          description: descriptions.error,
        }
      );
      break;
    default:
      break;
  }
}
