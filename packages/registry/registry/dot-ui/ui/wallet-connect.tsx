import { useTypink, Wallet, ExtensionWallet } from "typink";
import { Button } from "@/registry/dot-ui/ui/button";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import AccountSelection from "./account-selection";
import { truncateAddress } from "../lib/utils.dot-ui";

interface WalletButtonProps {
    walletInfo: Wallet;
    afterSelectWallet?: () => void;
}

function WalletButton({ walletInfo, afterSelectWallet }: WalletButtonProps) {
  const { name, id, logo, ready, installed } = walletInfo;
  const { connectWallet } = useTypink();

  const doConnectWallet = () => {
    if (!installed) {
        if (walletInfo instanceof ExtensionWallet) {
            window.open(walletInfo.installUrl);
        }
        return;
    }
    connectWallet(id);
    afterSelectWallet?.();
  };

  const isLoading = installed && !ready;

  if (isLoading) return <Button>Loading...</Button>;

  return (
    <Button onClick={doConnectWallet} className="group">
        <div className="flex items-center gap-2">
            <Image src={logo} alt={name} width={24} height={24} />
            <span>{installed ? name : `Install ${name}`}</span>
        </div> 
        <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
    </Button>
  )
}


interface WalletSelectionProps {
    buttonLabel?: string;
}

function WalletOption() {
    const { wallets } = useTypink();
    return (
        <>
            <DialogHeader>
                <DialogTitle>Connect Wallet</DialogTitle>
                <DialogDescription>
                    Select a wallet to connect to
                </DialogDescription>
            </DialogHeader>
            {wallets.map((wallet) => (
                <DialogClose asChild key={wallet.id}>
                    <WalletButton walletInfo={wallet} />
                </DialogClose>
            ))}
        </>
    );
}

export default function WalletSelection({
    buttonLabel = "Connect Wallet",
}: WalletSelectionProps) {
    const { signer, connectedAccount } = useTypink();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <div className="flex items-center gap-2">
                        <span>{connectedAccount ? `(${connectedAccount.name})` : ""}</span>
                        <span>{connectedAccount ? truncateAddress(connectedAccount.address) : buttonLabel}</span>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                {signer ? <AccountSelection /> : <WalletOption />}
            </DialogContent>
        </Dialog>
    )
}