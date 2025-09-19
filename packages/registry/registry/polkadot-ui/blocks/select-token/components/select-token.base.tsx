import type React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  formatTokenBalance,
  getTokenLogo,
  getTokenBalance,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { TokenMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  NetworkInfoLike,
  BaseProviderProps,
  BaseComponentServices,
  BaseChainComponentProps,
} from "@/registry/polkadot-ui/lib/types.dot-ui";
import { TokenLogoWithNetwork } from "./shared-token-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface SelectTokenServices<TNetworkId extends string = string>
  extends BaseComponentServices<TNetworkId> {
  items: TokenMetadata[];
  chainTokens?: TokenInfo[];
}

export interface SelectTokenProps<TChainId extends string = string>
  extends BaseChainComponentProps<TChainId> {
  withBalance: boolean;
  services: SelectTokenServices<TChainId>;
  fallback?: React.ReactNode;
}

export interface SelectTokenBaseProps<TChainId extends string = string>
  extends SelectTokenProps<TChainId> {
  value?: number;
  onChange?: (assetId: number) => void;
  placeholder?: string;
}

export type SelectTokenProviderProps = BaseProviderProps;

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
            balance={getTokenBalance(
              balances,
              connectedAccount,
              Number(token.assetId)
            )}
            tokenLogo={getTokenLogo(chainTokens, Number(token.assetId))}
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
          {connectedAccount?.address &&
            withBalance &&
            formatTokenBalance(balance, token.decimals)}{" "}
          {token.symbol}
        </span>
      </div>
    </SelectItem>
  );
}
