import React, { useMemo } from 'react';
import { toast } from 'sonner';
import { ISubmittableResult, TxStatus } from 'dedot/types';
import { NetworkInfo } from 'typink';

export type TxNotificationProps = {
  onTxProgress: (progress: ISubmittableResult) => void;
  onTxError: (e: Error) => void;
};

export function txNotification(
  initialMessage: string = 'Signing Transaction...',
  network?: NetworkInfo
): TxNotificationProps {
  let toastId = toast.loading(initialMessage, {
    duration: 5000,
    closeButton: true,
  });

  const onTxProgress = (progress: ISubmittableResult) => {
    let toastType: 'success' | 'error' | 'info' | 'default' = 'default';
    let duration: number = Infinity;
    let toastMessage: string = 'Transaction In Progress...';

    const { status, dispatchError } = progress;
    const succeeded = !dispatchError;

    if (status.type === 'Finalized') {
      duration = 5_000;
      toastType = succeeded ? 'success' : 'error';
      toastMessage = succeeded ? 'Transaction Successful' : 'Transaction Failed';
      // TODO: show dispatchError detailed error when Transaction Failed
    } else if (status.type === 'Invalid' || status.type === 'Drop') {
      duration = 5_000;
      toastType = 'error';
      toastMessage = 'Transaction Failed';
    }

    // Dismiss current toast and create a new one
    toast.dismiss(toastId);
    
    const toastComponent = <TxProgress message={toastMessage} status={status} network={network} />;
    
    if (toastType === 'success') {
      toastId = toast.success(toastComponent, { duration, closeButton: true });
    } else if (toastType === 'error') {
      toastId = toast.error(toastComponent, { duration, closeButton: true });
    } else {
      toastId = toast.info(toastComponent, { duration, closeButton: true });
    }
  };

  const onTxError = (e: Error) => {
    toast.dismiss(toastId);
    toastId = toast.error(<p>{e.message}</p>, {
      duration: 5_000,
      dismissible: true,
    });
  };

  return {
    onTxProgress,
    onTxError,
  };
}

const getBlockInfo = (status: TxStatus) => {
  if (status.type === 'BestChainBlockIncluded' || status.type === 'Finalized') {
    return `(#${status.value.blockNumber} / ${status.value.txIndex})`;
  }

  if ((status.type === 'Invalid' || status.type === 'Drop') && status.value.error) {
    return `(${status.value.error})`;
  }

  return '';
};

interface TxProgressProps {
  message: string;
  status: TxStatus;
  network?: NetworkInfo;
}

function TxProgress({ message, status, network }: TxProgressProps) {
    console.log({network});

    const { label: viewOnExplorer, url: explorerUrl } = useMemo(() => {
        if ((status.type === 'BestChainBlockIncluded' || status.type === 'Finalized') && network) {
          const { subscanUrl, pjsUrl } = network;

          if (subscanUrl) {
            return {
              label: 'View transaction on Subscan',
              url: `${subscanUrl}/extrinsic/${status.value.blockNumber}-${status.value.txIndex}`,
            };
          }

          if (pjsUrl) {
            return {
              label: 'View transaction on Polkadot.js',
              url: `${pjsUrl}#/explorer/query/${status.value.blockHash}`,
            };
          }
        }

        return { label: null, url: '' };
  }, [status, network]);


  return (
    <div>
      <p>{message}</p>
      <p style={{ fontSize: 12 }}>
        {status.type} {getBlockInfo(status)}
      </p>

      {viewOnExplorer && (
        <p style={{ fontSize: 12, marginTop: '0.5rem' }}>
          <a style={{ textDecoration: 'underline' }} href={explorerUrl} target='_blank'>
            👉 {viewOnExplorer}
          </a>
        </p>
      )}
    </div>
  );
}