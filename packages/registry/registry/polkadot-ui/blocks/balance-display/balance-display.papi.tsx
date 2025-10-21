import {
  useAssetBalance,
  useNativeBalance,
} from "@/registry/polkadot-ui/hooks/use-asset-balance.papi";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import { type ChainIdsWithPalletAssets } from "@/registry/polkadot-ui/lib/reactive-dot.config";
import { NATIVE_TOKEN_KEY } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import {
  BalanceDisplayBase,
  BalanceDisplaySkeletonBase,
  type BalanceDisplayBaseProps,
} from "./balance-display.base";
import { Suspense } from "react";

export type BalanceDisplayProps = Omit<
  BalanceDisplayBaseProps,
  "token" | "balance" | "compareToken"
> & {
  networkId: ChainIdsWithPalletAssets;
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

  const token = isTokenNative
    ? nativeToken
    : typeof tokenId === "number"
      ? (findByAssetId(tokenId) ?? tokens.tokens[0])
      : tokens.tokens[0];

  const compareToken = isCompareNative
    ? nativeToken
    : compareTokenId === undefined
      ? null
      : typeof compareTokenId === "number"
        ? (findByAssetId(compareTokenId) ??
          tokens.tokens[1] ??
          tokens.tokens[0])
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
