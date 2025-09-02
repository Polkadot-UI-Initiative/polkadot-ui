import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import type {
  NetworkInfoLike,
  TxResultLike,
} from "@/registry/dot-ui/lib/types.dot-ui";

function ChainLogo({ network }: { network: NetworkInfoLike | undefined }) {
  if (!network?.logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={network.logo}
      alt={network.name}
      className="absolute -right-1 -top-1 w-5 h-5"
    />
  );
}

export interface TxStatusNotificationProps {
  result: TxResultLike;
  toastId: string;
  network: NetworkInfoLike | undefined;
  successDuration: number;
  titles?: {
    submitting?: string;
    included?: string;
    finalized?: string;
    error?: string;
  };
  descriptions?: {
    submitting?: string;
    included?: string;
    finalized?: string;
    error?: string;
  };
}

export function beginTxStatusNotification(
  toastId: string | undefined,
  network: NetworkInfoLike | undefined,
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
  network: NetworkInfoLike | undefined,
  title: string = "Transaction cancelled",
  description: string = ""
) {
  toast.error(
    <>
      <ChainLogo network={network} /> {title}
    </>,
    {
      id: toastId,
      description,
    }
  );
}

export function txStatusNotification({
  result,
  toastId = "tx-status-notification",
  network,
  successDuration = 10000,
  titles = {
    submitting: "Waiting for confirmation...",
    included: "Waiting for finalization...",
    finalized: "",
    error: "",
  },
  descriptions = {
    submitting: "Transaction submitted",
    included: "Transaction included in block",
    finalized: "Transaction finalized",
    error: "Transaction failed",
  },
}: TxStatusNotificationProps) {
  const { status, txHash } = result;
  const explorerUrl = network?.subscanUrl ?? network?.pjsUrl;

  const action =
    txHash && explorerUrl
      ? {
          label: "View on explorer",
          onClick: () => {
            window.open(`${explorerUrl}/tx/${txHash}`, "_blank");
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
          duration: successDuration,
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
