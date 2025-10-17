"use client";

import {
  AmountInputBase,
  type AmountInputBaseProps,
} from "./amount-input.base";
import { useAssetBalance } from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";

import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import {
  useConnectionStatus,
  useSelectedAccount,
} from "@/registry/polkadot-ui/lib/polkadot-provider.papi";
import { ClientConnectionStatus } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { config } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import { Suspense } from "react";
import { Input } from "@/registry/polkadot-ui/ui/input";

export interface AmountInputProps extends AmountInputBaseProps {
  chainId: keyof typeof config.chains;
  assetId?: number;
  withMaxButton?: boolean;
  requiredAccount?: boolean;
}

export function AmountInput(props: AmountInputProps) {
  return (
    <Suspense fallback={<Input placeholder={props.placeholder} />}>
      <AmountInputInner {...props} />
    </Suspense>
  );
}

export function AmountInputInner(props: AmountInputProps) {
  const chainId = props.chainId ?? "paseoAssetHub";
  const { selectedAccount } = useSelectedAccount();
  const { status } = useConnectionStatus({ chainId });

  const tokenId = props.assetId ?? NATIVE_TOKEN_KEY;

  const accountBalance = useAssetBalance({
    assetId: tokenId,
    chainId: chainId,
    address: selectedAccount?.address,
  });

  const { tokens: metas } = useTokensByAssetIds(String(chainId), [tokenId]);

  // prefer explicit assetId, otherwise if multiple provided, pick first for max context
  const hasAccount = Boolean(selectedAccount?.address);
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
    (displayPrecision > 0 ? `0.${"0".repeat(displayPrecision - 1)}1` : "1");

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
    />
  );
}
