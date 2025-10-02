import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import type {
  NetworkInfoLike,
  TxResultLike,
} from "@/registry/polkadot-ui/lib/types.dot-ui";

export interface TxStatusNotificationTexts {
  signing?: string;
  submitting?: string;
  included?: string;
  finalized?: string;
  error?: string;
}

export interface TxStatusNotificationProps {
  result: TxResultLike;
  toastId: string | number;
  network: NetworkInfoLike | undefined;
  successDuration: number;
  title: string;
  titles?: TxStatusNotificationTexts;
  descriptions?: TxStatusNotificationTexts;
}

export const defaultTitles = {
  signing: "Waiting for signature...",
  submitting: "Waiting for confirmation...",
  included: "Waiting for finalization...",
  finalized: "",
  error: "",
};
export const defaultDescriptions = {
  signing: "Please sign the transaction in your wallet",
  submitting: "Waiting for confirmation...",
  included: "Waiting for finalization...",
  finalized: "Transaction finalized",
  error: "Transaction failed",
};

export function beginTxStatusNotification({
  toastId,
  network,
  title = "Waiting for signature...",
  description = "Please sign the transaction in your wallet",
}: {
  toastId?: string | number;
  network: NetworkInfoLike;
  title: string;
  description: string;
}) {
  const id = toast.loading(
    <>
      <ChainLogo network={network} /> {title}
    </>,
    {
      id: toastId,
      description,
    }
  );
  return id;
}

export function cancelTxStatusNotification({
  toastId,
  network,
  title = "Transaction cancelled",
  description = "",
}: {
  toastId: string | number;
  network: NetworkInfoLike | undefined;
  title: string;
  description: string;
}) {
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
  title,
  titles = defaultTitles,
  descriptions = defaultDescriptions,
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
    case "broadcasted": //papi
    case "Broadcasting": //dedot
    case "Validated": //dedot
      toast.loading(
        <>
          {chainLogo} {title ?? titles.submitting}
        </>,
        {
          id: toastId,
          description: descriptions.submitting,
        }
      );
      break;
    case "txBestBlocksState": //papi
    case "BestChainBlockIncluded": //dedot
      toast.loading(
        <>
          {chainLogo} {title ?? titles.included}
        </>,
        {
          id: toastId,
          action,
          description: descriptions.included,
        }
      );
      break;
    case "finalized": //papi
    case "Finalized": //dedot
      toast.success(
        <>
          {chainLogo} {title ?? titles.finalized}
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
          {chainLogo} {title ?? titles.error}
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
