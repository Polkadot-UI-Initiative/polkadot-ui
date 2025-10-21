import {
  useAssetBalance,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  BalanceDisplayBase,
  BalanceDisplaySkeletonBase,
  type BalanceDisplayBaseProps,
} from "./balance-display.base";
import { Suspense } from "react";
import type { ChainId } from "@reactive-dot/core";

export type BalanceDisplayProps = Omit<
  BalanceDisplayBaseProps,
  "token" | "balance" | "compareToken"
> & {
  networkId: ChainId;
  tokenId: number;
  compareTokenId?: number;
  accountAddress: string;
  thousandsSeparator?: string;
  decimalSeparator?: string;
};

export function BalanceDisplay(props: BalanceDisplayProps) {
  return (
    <Suspense
      fallback={
        <BalanceDisplaySkeletonBase
          showCompare={props.compareTokenId !== undefined}
        />
      }
    >
      <BalanceDisplayInner {...props} />
    </Suspense>
  );
}

export function BalanceDisplayInner(props: BalanceDisplayProps) {
  const {
    tokenId,
    compareTokenId,
    accountAddress,
    networkId,
    precision,
    tokenConversionRate,
    thousandsSeparator,
    decimalSeparator,
  } = props;

  const nativeBalance = useNativeBalance({
    chainId: networkId,
    address: accountAddress,
  });
  const assetBalance = useAssetBalance({
    address: accountAddress,
    chainId: networkId,
    assetId: tokenId,
  });

  const chainId = networkId;
  const isTokenNative = tokenId === NATIVE_TOKEN_KEY;
  const isCompareNative = compareTokenId === NATIVE_TOKEN_KEY;

  const requestedAssetIds: number[] = [];
  if (!isTokenNative && typeof tokenId === "number")
    requestedAssetIds.push(tokenId);
  if (!isCompareNative && typeof compareTokenId === "number")
    requestedAssetIds.push(compareTokenId);

  const tokens = useTokensByAssetIds(chainId, requestedAssetIds, {
    showAll: isTokenNative || isCompareNative,
  });

  const nativeToken = tokens.tokens.find(
    (t) => t.assetId === String(NATIVE_TOKEN_KEY)
  );
  const findByAssetId = (id: number) =>
    tokens.tokens.find((t) => t.assetId === String(id));

  // Resolve main token. For native tokens, do not fallback to a placeholder token list entry.
  // If not found, return null so the base renderer avoids skeletons and simply omits the symbol.
  const token = isTokenNative
    ? (nativeToken ?? null)
    : typeof tokenId === "number"
      ? (findByAssetId(tokenId) ?? null)
      : null;

  // Resolve compare token similarly: only show when explicitly requested and resolvable.
  const compareToken = isCompareNative
    ? (nativeToken ?? null)
    : compareTokenId === undefined
      ? null
      : typeof compareTokenId === "number"
        ? (findByAssetId(compareTokenId) ?? null)
        : null;

  return (
    <BalanceDisplayBase
      token={token}
      compareToken={compareToken}
      balance={isTokenNative ? nativeBalance?.free : assetBalance?.free}
      precision={precision}
      tokenConversionRate={tokenConversionRate}
      showCompare={compareTokenId !== undefined}
      thousandsSeparator={thousandsSeparator}
      decimalSeparator={decimalSeparator}
    />
  );
}
