import { PolkadotProvider } from "@/registry/dot-ui/providers/dedot-provider";
import { TxNotificationDemo } from "@/registry/dot-ui/blocks/tx-notification/demo/tx-notification-demo";

export default function TxNotificationDedotPage() {
    return (
        <TxNotificationDemo
            Provider={PolkadotProvider}
        />
    )
}