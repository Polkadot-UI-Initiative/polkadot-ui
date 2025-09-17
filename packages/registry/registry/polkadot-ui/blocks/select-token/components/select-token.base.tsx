import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAssetBalance } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-balance.dedot";
import { formatBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { TokenMetadata } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-asset-metadata.dedot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface SelectTokenServices {
  isConnected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  items: TokenMetadata[];
  connectedAccount?: { address?: string } | null;
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

export function SelectTokenBase<TChainId extends string = string>({
  chainId,
  value,
  onChange,
  placeholder = "Select token",
  className,
  withBalance,
  services,
  ...props
}: SelectTokenBaseProps<TChainId> & React.ComponentProps<typeof Select>) {
  const { isConnected, isLoading, items, connectedAccount, isDisabled } =
    services;

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
            <Loader2 className="ml-2 size-3 animate-spin text-muted-foreground" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {items.map((t) => (
          <TokenSelectItem
            key={t.assetId}
            assetId={t.assetId}
            name={t.name}
            symbol={t.symbol}
            decimals={t.decimals}
            chainId={chainId}
            address={connectedAccount?.address}
            withBalance={withBalance}
          />
        ))}
      </SelectContent>
    </Select>
  );
}

SelectTokenBase.displayName = "SelectTokenBase";

function TokenSelectItem({
  assetId,
  name,
  symbol,
  decimals,
  chainId,
  address,
  withBalance,
}: {
  assetId: number;
  name?: string;
  symbol?: string;
  decimals?: number;
  chainId: string;
  address?: string;
  withBalance: boolean;
}) {
  return (
    <SelectItem
      value={String(assetId)}
      className="flex items-center flex-row gap-2"
    >
      <span className="font-medium">{name ?? symbol ?? assetId}</span>
      {withBalance && address ? (
        <TokenBalance
          address={address}
          chainId={chainId}
          assetId={assetId}
          decimals={decimals ?? 0}
        />
      ) : null}
      {symbol && (
        <span className="text-muted-foreground text-xs">{symbol}</span>
      )}
    </SelectItem>
  );
}

function TokenBalance({
  address,
  chainId,
  assetId,
  decimals,
}: {
  address: string;
  chainId: string;
  assetId: number;
  decimals: number;
}) {
  const { free } = useAssetBalance({ chainId, assetId, address });
  return (
    <span className="ml-auto text-xs tabular-nums text-muted-foreground">
      {formatBalance({ value: free, decimals })}
    </span>
  );
}
