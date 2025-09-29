import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type ViewSelectWalletProps } from "./connect-wallet.base";
import { ArrowRight, Plus, Zap, ZapOff } from "lucide-react";

export const ViewSelectWallet = ({
  next,
  wallets,
  connectedWallets,
  accounts,
  connectWallet,
  disconnect,
}: ViewSelectWalletProps) => {
  const sortedWallets = wallets.sort((a, b) => {
    if (a.installed && !b.installed) return -1;
    if (!a.installed && b.installed) return 1;
    return 0;
  });

  const openSafeUrl = (url: string) => {
    try {
      // Validate URL is non-empty string
      if (!url || typeof url !== "string" || url.trim() === "") {
        console.warn("Invalid URL: URL is empty or not a string");
        return;
      }

      // Validate URL format and ensure it's HTTP/HTTPS
      const trimmedUrl = url.trim();
      if (
        !trimmedUrl.startsWith("http://") &&
        !trimmedUrl.startsWith("https://")
      ) {
        console.warn("Invalid URL: URL must start with http:// or https://");
        return;
      }

      // Additional URL validation using URL constructor
      new URL(trimmedUrl);

      // Open with security measures
      const win = window.open(trimmedUrl, "_blank", "noopener,noreferrer");
      if (win) {
        win.opener = null; // Fallback security measure
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {sortedWallets.map((wallet) => {
        const isConnected = connectedWallets.find((w) => w.id === wallet.id);

        const accountCount = accounts.filter(
          (account) => account.source === wallet.id
        ).length;

        return (
          <Button
            key={wallet.id}
            variant="outline"
            className={cn(
              "relative w-full flex flex-row items-center justify-between gap-2 h-14",
              "transition-transform duration-150 ease-out active:scale-[0.98] active:translate-y-[0.5px]",
              isConnected &&
                "border-green-500/50 bg-green-500/10 hover:bg-green-500/20"
            )}
            onClick={() => {
              if (wallet.installed) {
                if (isConnected) {
                  disconnect(wallet.id);
                } else {
                  connectWallet(wallet.id);
                }
              } else if (wallet.installUrl) {
                openSafeUrl(wallet.installUrl);
              }
            }}
          >
            <div className="flex flex-row items-center justify-start gap-0">
              <div
                className={cn(
                  "w-0 h-0 rounded-full bg-green-500 animate-pulse transition-all duration-300 ease-in-out",
                  isConnected && "w-2 h-2 mr-2"
                )}
              />
              <div className="flex flex-row items-center justify-start gap-2">
                {wallet.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={wallet.logo}
                    alt={wallet.name}
                    className="w-[32px] h-[32px]"
                    width={32}
                    height={32}
                  />
                )}
                <div className="flex flex-col items-start">
                  <span className="font-bold">{wallet.name}</span>
                  <span
                    className={cn(
                      "text-xs text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out",
                      isConnected && accountCount > 0 ? "h-4" : "h-0"
                    )}
                  >
                    {accountCount} account
                    {accountCount !== 1 ? "s" : ""} available
                  </span>
                </div>
              </div>
            </div>
            <>
              {!wallet.installed ? (
                <>
                  <span className="flex flex-row items-center gap-2">
                    <Plus className="size-3" /> Install
                  </span>
                </>
              ) : isConnected ? (
                <span className="text-red-600 dark:text-red-400 flex flex-row items-center gap-2">
                  <ZapOff className="size-3" /> Disconnect
                </span>
              ) : (
                <span className="text-green-600 dark:text-green-400 flex flex-row items-center gap-2">
                  <Zap className="size-3" /> Connect
                </span>
              )}
            </>
          </Button>
        );
      })}
      <DialogFooter className="pt-4">
        <Button
          variant="default"
          onClick={next}
          disabled={!connectedWallets.length}
          className="flex flex-row items-center gap-2"
        >
          Select Account <ArrowRight className="w-3 h-3" />
        </Button>
      </DialogFooter>
    </div>
  );
};
