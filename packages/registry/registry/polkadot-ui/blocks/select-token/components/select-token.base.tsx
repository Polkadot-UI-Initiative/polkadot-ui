import type React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTokenBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { TokenMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { TokenInfo } from "@/lib/hooks/use-chaindata-json";
import { NetworkInfoLike } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface SelectTokenServices {
  isConnected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  items: TokenMetadata[];
  connectedAccount?: { address?: string } | null;
  chainTokens?: TokenInfo[];
  balances?: Record<number, bigint | null>;
  network?: NetworkInfoLike;
}

export interface SelectTokenProps<TChainId extends string = string> {
  chainId: TChainId;
  assetIds: number[];
  withBalance: boolean;
  services: SelectTokenServices;
  fallback?: React.ReactNode;
}

export interface SelectTokenBaseProps<TChainId extends string = string>
  extends SelectTokenProps<TChainId> {
  value?: number;
  onChange?: (assetId: number) => void;
  placeholder?: string;
  className?: string;
}

export interface SelectTokenProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function SelectTokenProvider({
  children,
  queryClient = defaultQueryClient,
}: SelectTokenProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Token logo with network overlay component
interface TokenLogoWithNetworkProps {
  tokenLogo?: string;
  networkLogo?: string;
  tokenSymbol?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function TokenLogoWithNetwork({
  tokenLogo,
  networkLogo,
  tokenSymbol,
  size = "md",
  className,
}: TokenLogoWithNetworkProps) {
  const sizeClasses = {
    sm: { main: "w-5 h-5", network: "w-[10px] h-[10px]", text: "text-xs" },
    md: { main: "w-8 h-8", network: "w-4 h-4", text: "text-sm" },
    lg: { main: "w-12 h-12", network: "w-6 h-6", text: "text-base" },
  };

  const { main, network, text } = sizeClasses[size];

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {/* Main token logo */}
      <div className={cn(main, "rounded-full overflow-hidden")}>
        {tokenLogo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tokenLogo}
              alt={tokenSymbol || "Token"}
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          // Fallback gradient with symbol
          <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <span className={cn("font-bold text-white", text)}>
              {tokenSymbol?.[0] || "?"}
            </span>
          </div>
        )}
      </div>

      {/* Network logo overlay */}
      {networkLogo && (
        <div
          className={cn(
            network,
            "absolute -bottom-1 -right-1 rounded-full overflow-hidden"
          )}
        >
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={networkLogo}
              alt="Network"
              className="w-full h-full object-cover"
            />
          </>
        </div>
      )}
    </div>
  );
}

export function SelectTokenBase<TChainId extends string = string>({
  value,
  onChange,
  placeholder = "Select token",
  className,
  withBalance,
  services,
  ...props
}: SelectTokenBaseProps<TChainId> & React.ComponentProps<typeof Select>) {
  const {
    isConnected,
    isLoading,
    connectedAccount,
    isDisabled,
    chainTokens,
    balances,
    network,
  } = services;

  const handleValueChange = (v: string) => {
    props.onValueChange?.(v);
    onChange?.(Number(v));
  };

  // Helper function to get token logo from chainTokens
  const getTokenLogo = (assetId: number): string | undefined => {
    if (!chainTokens) return undefined;
    const chainToken = chainTokens.find((token) => {
      // Extract assetId from token.id (format: chainId:substrate-assets:assetId)
      const parts = token.id.split(":");
      if (parts.length === 3 && parts[1] === "substrate-assets") {
        return parseInt(parts[2]) === assetId;
      }
      return false;
    });
    return chainToken?.logo;
  };

  // Helper function to get actual balance for a token
  const getTokenBalance = (assetId: number): bigint | null => {
    if (!balances || !connectedAccount?.address) return null;
    return balances[assetId] ?? null;
  };

  return (
    <Select
      {...props}
      value={
        value != null ? String(value) : (props as { value?: string }).value
      }
      onValueChange={handleValueChange}
      disabled={isDisabled || isLoading}
    >
      <SelectTrigger className={className}>
        <div className="flex items-center flex-row gap-2">
          <SelectValue placeholder={placeholder} />
          {(isLoading || !isConnected) && (
            <Loader2 className="ml-auto size-3 animate-spin text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {chainTokens?.map((token) => (
          <TokenSelectItem
            key={token.id}
            token={token}
            network={network}
            balance={getTokenBalance(Number(token.assetId))}
            tokenLogo={getTokenLogo(Number(token.assetId))}
            withBalance={withBalance}
            connectedAccount={connectedAccount}
          />
        ))}
      </SelectContent>
    </Select>
  );
}

SelectTokenBase.displayName = "SelectTokenBase";

function TokenSelectItem({
  token,
  withBalance,
  balance,
  network,
  tokenLogo,
  connectedAccount,
}: {
  token: TokenInfo;
  withBalance: boolean;
  balance: bigint | null;
  network?: NetworkInfoLike;
  tokenLogo?: string;
  connectedAccount?: { address?: string } | null;
}) {
  return (
    <SelectItem
      value={token.assetId}
      className="flex items-center justify-between w-full gap-3 p-3"
    >
      <div className="flex items-center gap-2">
        <TokenLogoWithNetwork
          tokenLogo={tokenLogo}
          networkLogo={network?.logo}
          tokenSymbol={token.symbol}
          size="sm"
        />
        <span className="font-medium">
          {token.symbol}{" "}
          {connectedAccount?.address &&
            withBalance &&
            formatTokenBalance(balance, token.decimals)}
        </span>
      </div>
    </SelectItem>
  );
}
