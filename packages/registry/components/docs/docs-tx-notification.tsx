"use client";

import { ComponentExample } from "../examples/types.examples";
import { ComponentPreview } from "../layout/component-preview";
import { PolkadotProvider } from "@/registry/polkadot-ui/lib/polkadot-provider.dedot";
import {
  beginTxStatusNotification,
  cancelTxStatusNotification,
  defaultDescriptions,
  defaultTitles,
  txStatusNotification,
} from "@/registry/polkadot-ui/blocks/tx-notification/components/tx-notification";
import { useTypink } from "typink";
import { Button } from "@/components/ui/button";

function DemoBasic() {
  const { supportedNetworks } = useTypink();
  const network = supportedNetworks?.[0];

  function simulate() {
    const id = beginTxStatusNotification({
      network: network!,
      title: defaultTitles.signing,
      description: defaultDescriptions.signing,
    });

    setTimeout(() => {
      txStatusNotification({
        title: defaultTitles.submitting,
        result: { status: { type: "Broadcasting" } },
        toastId: id,
        network,
        successDuration: 3000,
      });
    }, 800);

    setTimeout(() => {
      txStatusNotification({
        title: defaultTitles.included,
        result: { status: { type: "BestChainBlockIncluded" } },
        toastId: id,
        network,
        successDuration: 3000,
      });
    }, 1600);

    setTimeout(() => {
      txStatusNotification({
        title: defaultTitles.finalized,
        result: { status: { type: "Finalized" } },
        toastId: id,
        network,
        successDuration: 4000,
      });
    }, 2400);
  }

  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={simulate}>
        Simulate Tx Notifications
      </Button>
    </div>
  );
}

function DemoCustomText() {
  const { supportedNetworks } = useTypink();
  const network = supportedNetworks?.[0];

  function simulate() {
    const id = beginTxStatusNotification({
      network: network!,
      title: "Awaiting wallet signature",
      description: "Confirm the transaction in your wallet",
    });

    setTimeout(() => {
      txStatusNotification({
        title: "Submitting to network...",
        titles: {
          submitting: "Submitting to network...",
          included: "Included in best block",
          finalized: "Finalized successfully",
          error: "Failed to submit",
        },
        descriptions: {
          submitting: "Your transaction is being propagated",
          included: "Explorer link available",
          finalized: "Funds moved. You can close this now.",
          error: "Something went wrong",
        },
        result: { status: { type: "Broadcasting" } },
        toastId: id,
        network,
        successDuration: 4000,
      });
    }, 800);

    setTimeout(() => {
      txStatusNotification({
        title: "Included in best block",
        titles: {
          included: "Included in best block",
        },
        descriptions: {
          included: "You can inspect on the explorer",
        },
        result: { status: { type: "BestChainBlockIncluded" } },
        toastId: id,
        network,
        successDuration: 4000,
      });
    }, 1600);

    setTimeout(() => {
      txStatusNotification({
        title: "🎉 Finalized",
        titles: { finalized: "🎉 Finalized" },
        descriptions: { finalized: "All done" },
        result: { status: { type: "Finalized" } },
        toastId: id,
        network,
        successDuration: 4000,
      });
    }, 2400);
  }

  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={simulate}>
        Simulate Custom Texts
      </Button>
    </div>
  );
}

function DemoError() {
  const { supportedNetworks } = useTypink();
  const network = supportedNetworks?.[0];

  function simulate() {
    const id = beginTxStatusNotification({
      network: network!,
      title: defaultTitles.signing,
      description: defaultDescriptions.signing,
    });

    setTimeout(() => {
      cancelTxStatusNotification({
        toastId: id,
        network,
        title: "Transaction cancelled",
        description: "User rejected in wallet",
      });
    }, 1000);
  }

  return (
    <div className="flex items-center gap-3">
      <Button size="sm" variant="destructive" onClick={simulate}>
        Simulate Cancel/Error
      </Button>
    </div>
  );
}

export const txNotificationExamples: ComponentExample[] = [
  {
    name: "Tx Notification - Basic",
    description: "Show notifications across the tx lifecycle.",
    code: "tx-notification",
    component: <DemoBasic />,
    tsx: `import { beginTxStatusNotification, txStatusNotification } from "@/components/tx-notification";

const id = beginTxStatusNotification({ network, title: "Waiting for signature...", description: "Please sign in your wallet" });

// in your signAndSend callback
onStatus((result) => {
  txStatusNotification({ title: "Waiting for confirmation...", result, toastId: id, network, successDuration: 4000 });
});`,
  },
  {
    name: "Tx Notification - Custom Texts",
    description: "Customize titles and descriptions for each status.",
    code: "tx-notification",
    component: <DemoCustomText />,
    tsx: `txStatusNotification({
  title: "Submitting to network...",
  titles: { submitting: "Submitting to network...", finalized: "Finalized" },
  descriptions: { submitting: "Propagating...", finalized: "All done" },
  result,
  toastId: id,
  network,
});`,
  },
  {
    name: "Tx Notification - Cancel/Error",
    description:
      "Show a cancellation/error toast when the tx fails or is rejected.",
    code: "tx-notification",
    component: <DemoError />,
    tsx: `import { cancelTxStatusNotification } from "@/components/tx-notification";

cancelTxStatusNotification({ toastId: id, network, title: "Transaction cancelled", description: "User rejected" });`,
  },
];

export function TxNotificationDocs() {
  return (
    <PolkadotProvider>
      <div className="flex flex-col gap-4">
        {txNotificationExamples.map((example) => (
          <ComponentPreview
            key={example.name}
            componentInfo={example}
            withDocs={false}
          />
        ))}
      </div>
    </PolkadotProvider>
  );
}
