"use client";

import { useMemo } from "react";
import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientConnectionStatus, usePolkadotClient, useTypink } from "typink";
import { useAssetMetadata } from "./hooks/use-asset-metadata.dedot";
import { useAssetBalance } from "./hooks/use-asset-balance.dedot";
import { Loader2 } from "lucide-react";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";
import { formatBalance } from "../../lib/utils.dot-ui";

export function SelectToken(
  props: SelectTokenProps & React.ComponentProps<typeof Select>
) {
  return (
    <ClientOnly fallback={<Select {...props} />}>
      <SelectTokenInner {...props} />
    </ClientOnly>
  );
}

export function SelectTokenInner({
  chainId,
  assetIds,
  value,
  onChange,
  placeholder = "Select token",
  withBalance = false,
  className,
  ...selectProps
}: SelectTokenProps & React.ComponentProps<typeof Select>) {
  const { client, status } = usePolkadotClient(chainId);

  const isConnected = status === ClientConnectionStatus.Connected;
  const isDisabled =
    (selectProps.disabled ?? false) ||
    !isConnected ||
    !client ||
    assetIds.length === 0;

  const { assets, isLoading } = useAssetMetadata({ chainId, assetIds });
  const items = useMemo(() => assets ?? [], [assets]);
  const { connectedAccount } = useTypink();

  const handleValueChange = (v: string) => {
    selectProps.onValueChange?.(v);
    onChange?.(Number(v));
  };

  return (
    <Select
      {...selectProps}
      value={
        value != null
          ? String(value)
          : (selectProps as { value?: string }).value
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

export interface SelectTokenProps {
  chainId: string;
  assetIds: number[];
  value?: number;
  onChange?: (assetId: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  withBalance?: boolean;
}

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
