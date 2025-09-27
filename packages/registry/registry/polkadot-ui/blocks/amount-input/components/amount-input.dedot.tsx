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
  const keyForMax = props.assetId ?? ids[0];
  console.log("keyForMax", keyForMax);
  console.log("metas", metas);
  const maxValue = keyForMax != null ? (balances[keyForMax] ?? null) : null;
  const decimals =
    keyForMax != null
      ? (metas.find((m) => m.assetId === String(keyForMax))?.decimals ?? 12)
      : 12;

  const isConnected = status === ClientConnectionStatus.Connected;
  const disabled =
    props.disabled ||
    !isConnected ||
    !connectedAccount?.address ||
    ids.length === 0;

  const leftIconUrl =
    keyForMax != null
      ? metas.find((m) => m.assetId === String(keyForMax))?.logo
      : undefined;
  const leftIconAlt =
    keyForMax != null
      ? metas.find((m) => m.assetId === String(keyForMax))?.symbol
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
      className={props.className}
      step={props.step}
      leftIconUrl={leftIconUrl}
      leftIconAlt={leftIconAlt}
    />
  );
}
