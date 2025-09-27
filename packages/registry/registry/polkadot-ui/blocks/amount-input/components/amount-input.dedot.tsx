"use client";

import { useMemo } from "react";
import { AmountInputBase } from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";
import {
  paseoAssetHub,
  usePolkadotClient,
  useTypink,
  ClientConnectionStatus,
} from "typink";
import { useAssetBalances } from "@/registry/polkadot-ui/hooks/use-asset-balance.dedot";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";

export interface AmountInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  chainId?: string;
  assetId?: number;
  assetIds?: number[];
  withMaxButton?: boolean;
  disabled?: boolean;
  requiredAccount?: boolean;
  className?: string;
  step?: number | string;
}

export function AmountInput(props: AmountInputProps) {
  const chainId = props.chainId ?? paseoAssetHub.id;
  const { connectedAccount } = useTypink();
  const { status } = usePolkadotClient(chainId);

  const ids = useMemo(() => {
    if (props.assetId != null) return [props.assetId];
    if (Array.isArray(props.assetIds) && props.assetIds.length > 0)
      return props.assetIds;
    return [] as number[];
  }, [props.assetId, props.assetIds]);

  const { balances } = useAssetBalances({
    chainId,
    assetIds: ids,
    address: connectedAccount?.address ?? "",
  });

  const { tokens: metas } = useTokensByAssetIds(chainId, ids);

  // prefer explicit assetId, otherwise if multiple provided, pick first for max context
  const assetIdForMax = props.assetId ?? ids[0];
  const hasAccount = Boolean(connectedAccount?.address);
  const rawBalance =
    assetIdForMax != null ? (balances[assetIdForMax] ?? null) : null;
  // Do not coerce to 0n when no account; base handles disabled via requiredBalance/disabled
  const maxValue = hasAccount ? rawBalance : null;
  const decimals =
    assetIdForMax != null
      ? (metas.find((m) => m.assetId === String(assetIdForMax))?.decimals ?? 12)
      : 12;
  const displayPrecision = Math.min(2, Math.max(0, decimals));
  const derivedStep =
    props.step ??
    (displayPrecision > 0 ? `0.${"0".repeat(displayPrecision - 1)}1` : "1");

  const isConnected = status === ClientConnectionStatus.Connected;
  const requiresAccount = props.requiredAccount ?? false;
  const disabled =
    props.disabled ||
    (requiresAccount && (!isConnected || !hasAccount)) ||
    ids.length === 0;

  const leftIconUrl =
    assetIdForMax != null
      ? metas.find((m) => m.assetId === String(assetIdForMax))?.logo
      : undefined;
  const leftIconAlt =
    assetIdForMax != null
      ? metas.find((m) => m.assetId === String(assetIdForMax))?.symbol
      : undefined;

  return (
    <AmountInputBase
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      decimals={decimals}
      maxValue={maxValue ?? null}
      withMaxButton={props.withMaxButton}
      disabled={disabled}
      requiredBalance={hasAccount}
      className={props.className}
      step={derivedStep}
      leftIconUrl={leftIconUrl}
      leftIconAlt={leftIconAlt}
    />
  );
}
