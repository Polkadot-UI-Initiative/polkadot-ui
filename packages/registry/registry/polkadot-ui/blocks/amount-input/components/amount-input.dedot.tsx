"use client";

import {
  AmountInputBase,
  type AmountInputBaseProps,
} from "@/registry/polkadot-ui/blocks/amount-input/components/amount-input.base";
import {
  paseoAssetHub,
  usePolkadotClient,
  useTypink,
  ClientConnectionStatus,
  type NetworkId,
} from "typink";
import { useAssetBalance } from "@/registry/polkadot-ui/hooks/use-asset-balance.dedot";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { ClientOnly } from "@/registry/polkadot-ui/blocks/client-only";

export interface AmountInputProps extends AmountInputBaseProps {
  chainId: NetworkId;
  assetId?: number;
  withMaxButton?: boolean;
  requiredAccount?: boolean;
  tokenConversionRate?: number;
}

export function AmountInput(props: AmountInputProps) {
  return (
    <ClientOnly fallback={<AmountInputBase />}>
      <AmountInputInner {...props} />
    </ClientOnly>
  );
}

export function AmountInputInner(props: AmountInputProps) {
  const chainId = props.chainId ?? paseoAssetHub.id;
  const { connectedAccount } = useTypink();
  const { status } = usePolkadotClient(chainId);

  const tokenId = props.assetId ?? NATIVE_TOKEN_KEY;

  const accountBalance = useAssetBalance({
    assetId: tokenId,
    chainId,
    address: connectedAccount?.address ?? "",
  });

  const { tokens: metas } = useTokensByAssetIds(chainId, [tokenId]);

  // prefer explicit assetId, otherwise if multiple provided, pick first for max context
  const hasAccount = Boolean(connectedAccount?.address);
  const rawBalance = tokenId != null ? (accountBalance.free ?? null) : null;

  // Do not coerce to 0n when no account; base handles disabled via requiredBalance/disabled
  const maxValue = hasAccount ? rawBalance : null;
  const decimals =
    tokenId != null
      ? (metas.find((m) => m.assetId === String(tokenId))?.decimals ?? 12)
      : 12;
  const displayPrecision = Math.min(2, Math.max(0, decimals));
  const derivedStep =
    props.step ??
    (displayPrecision > 0 ? `0.${"0".repeat(displayPrecision - 1)}1` : "0.01");

  const isConnected = status === ClientConnectionStatus.Connected;
  const requiresAccount = props.requiredAccount ?? false;
  const disabled =
    props.disabled || (requiresAccount && (!isConnected || !hasAccount));

  const leftIconUrl =
    props.leftIconUrl ?? metas.find((m) => m.assetId === String(tokenId))?.logo;

  const leftIconAlt =
    props.leftIconAlt ??
    metas.find((m) => m.assetId === String(tokenId))?.symbol;

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
      tokenConversionRate={props.tokenConversionRate}
    />
  );
}
