"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  formatTokenBalance,
  formatTokenPrice,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";

export interface BalanceDisplayBaseProps {
  balance?: bigint | null;
  precision?: number;
  token?: TokenInfo;
  // Optional compare token (e.g., USD), and conversion rate from base token to compare token
  compareToken?: TokenInfo | null | undefined;
  tokenConversionRate?: number | undefined;
}

export function BalanceDisplayBase(props: BalanceDisplayBaseProps) {
  const hasBalanceProp = Object.prototype.hasOwnProperty.call(props, "balance");
  const hasCompareProp = Object.prototype.hasOwnProperty.call(
    props,
    "compareToken"
  );

  const {
    balance,
    precision = 4,
    token,
    compareToken,
    tokenConversionRate,
  } = props;

  const nativeToken: TokenInfo = token ?? {
    id: "dot",
    symbol: "DOT",
    decimals: 10,
    name: "Polkadot",
    assetId: "0",
  };

  const isBalanceLoading =
    hasBalanceProp && (balance === null || balance === undefined);
  const formatted =
    typeof balance === "bigint"
      ? formatTokenBalance(balance, nativeToken.decimals, precision)
      : undefined;

  return (
    <div className="inline-flex flex-col items-end">
      <div className="text-base font-medium min-h-6 flex flex-row items-center gap-1">
        {isBalanceLoading ? (
          <Skeleton className="w-16 h-4 rounded-sm bg-foreground/70" />
        ) : (
          <>
            {formatted} {nativeToken.symbol}{" "}
          </>
        )}
        {nativeToken.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={nativeToken.logo}
            alt={nativeToken.symbol}
            className="size-4"
          />
        )}
      </div>

      {hasCompareProp ? (
        compareToken === undefined ||
        tokenConversionRate === undefined ||
        isBalanceLoading ? (
          <CompareTokenSkeleton />
        ) : compareToken ? (
          <div className="text-xs flex flex-row items-center gap-1 text-muted-foreground h-3">
            ~{" "}
            {formatTokenPrice(
              balance as bigint,
              nativeToken.decimals,
              tokenConversionRate
            )}{" "}
            {compareToken.symbol}{" "}
            <div className="size-4 flex items-center justify-center">
              {compareToken.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={compareToken.logo}
                  alt={compareToken.symbol}
                  className="size-3"
                />
              )}
            </div>
          </div>
        ) : null
      ) : null}
    </div>
  );
}

export function CompareTokenSkeleton() {
  return (
    <div className="flex flex-row items-center gap-1">
      <Skeleton className="w-14 h-3 rounded-sm bg-muted-foreground" />
      <div className="size-4 flex items-center justify-center">
        <Skeleton className="w-3 h-3 rounded-full bg-foreground" />
      </div>
    </div>
  );
}

export function BalanceDisplaySkeletonBase(props: {
  balance?: bigint | null;
  token?: TokenInfo;
  hasCompareProp?: boolean;
  hasBalanceProp?: boolean;
  compareToken?: TokenInfo | null | undefined;
  tokenConversionRate?: number | undefined;
}) {
  return (
    <div className="inline-flex flex-col items-end gap-1">
      <div className="flex flex-row items-center gap-1 text-base font-medium min-h-6">
        <Skeleton className="w-16 h-4 rounded-sm bg-foreground" />
        <Skeleton className="w-4 h-4 rounded-sm bg-foreground" />
        {props.token?.symbol}
      </div>
      {props.hasCompareProp &&
        (props.compareToken === undefined ||
          props.tokenConversionRate === undefined ||
          (props.hasBalanceProp && props.balance === null)) && (
          <div className="flex flex-row items-center gap-1">
            <CompareTokenSkeleton />
          </div>
        )}
    </div>
  );
}
