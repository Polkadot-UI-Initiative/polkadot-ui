"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import {
  formatTokenBalance,
  getTokenDecimals,
} from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { cn } from "@/lib/utils";

export interface BalanceDisplayBaseProps {
  // null if not available, undefined if not set
  balance: bigint | null | undefined;
  token: TokenInfo | null | undefined;
  precision?: number;
  // Optional compare token (e.g., USDC), and conversion rate from base token to compare token
  compareToken?: TokenInfo | null | undefined;
  tokenConversionRate?: number | null | undefined;
  comparePrecision?: number | null | undefined;
  showCompare?: boolean | undefined;
  thousandsSeparator?: string;
  decimalSeparator?: string;
}

export function BalanceDisplayBase(props: BalanceDisplayBaseProps) {
  const {
    balance,
    precision = 4,
    token,
    compareToken,
    tokenConversionRate,
    comparePrecision = null,
    showCompare,
    thousandsSeparator,
    decimalSeparator,
  } = props;

  // If caller provided showCompare explicitly, use it; otherwise infer
  const shouldShowCompare =
    showCompare ??
    (Object.prototype.hasOwnProperty.call(props, "compareToken") ||
      Object.prototype.hasOwnProperty.call(props, "tokenConversionRate"));

  const compareAmount = (() => {
    if (
      typeof balance !== "bigint" ||
      typeof tokenConversionRate !== "number" ||
      !Number.isFinite(tokenConversionRate)
    )
      return undefined;

    // Convert base token amount to compare token amount using integer math
    // scaledRate ≈ tokenConversionRate * scaleFactor, where rate is (compare per base)
    const scaleFactor = 1_000_000;
    const scaledRate = BigInt(Math.round(tokenConversionRate * scaleFactor));

    const baseDecimals = getTokenDecimals(token);
    const compareDecimals = getTokenDecimals(compareToken);

    const base = 10n ** BigInt(baseDecimals);
    const compareBase = 10n ** BigInt(compareDecimals);

    const amountInCompareUnits =
      (balance * scaledRate * compareBase) / (base * BigInt(scaleFactor));
    return amountInCompareUnits;
  })();

  return (
    <div className="inline-flex flex-col items-end">
      <div className="text-base font-medium min-h-6 flex flex-row items-center gap-1">
        <TokenDisplay
          balance={balance}
          token={token}
          precision={precision}
          thousandsSeparator={thousandsSeparator}
          decimalSeparator={decimalSeparator}
        />
      </div>
      {shouldShowCompare && (
        <div className="text-xs flex flex-row items-center gap-1 text-muted-foreground h-3">
          <TokenDisplay
            balance={compareAmount}
            token={compareToken}
            precision={comparePrecision ?? precision}
            small
            thousandsSeparator={thousandsSeparator}
            decimalSeparator={decimalSeparator}
          />
        </div>
      )}
    </div>
  );
}

export function TokenDisplay({
  balance,
  token,
  precision,
  thousandsSeparator,
  decimalSeparator,
  small,
}: Pick<BalanceDisplayBaseProps, "balance" | "token" | "precision"> & {
  small?: boolean;
  thousandsSeparator?: string;
  decimalSeparator?: string;
}) {
  const isBalanceLoading = balance === undefined;
  const isTokenLoading = token === undefined;

  const formatted =
    typeof balance === "bigint"
      ? formatTokenBalance(
          balance,
          getTokenDecimals(token),
          precision,
          thousandsSeparator,
          decimalSeparator
        )
      : undefined;

  return (
    <>
      {isBalanceLoading ? <BalanceSkeleton small={small} /> : <>{formatted} </>}
      {isTokenLoading ? (
        <TokenSkeleton small={small} />
      ) : (
        <>
          {token?.symbol}
          <div className="size-4 flex items-center justify-center">
            {token?.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={token.logo}
                alt={token.symbol}
                className={cn(
                  "opacity-0 transition-opacity duration-500",
                  !small && "size-4",
                  small && "size-3"
                )}
                onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

export function TokenSkeleton({
  withIcon = true,
  small,
}: {
  withIcon?: boolean;
  small?: boolean;
}) {
  return (
    <>
      <Skeleton
        className={cn("rounded-sm bg-foreground w-8", {
          "h-4": !small,
          "h-3": small,
        })}
      />
      {withIcon && (
        <div className="size-4 flex items-center justify-center">
          <Skeleton
            className={cn(
              "w-4 h-4 rounded-full bg-foreground",
              small && "w-3 h-3"
            )}
          />
        </div>
      )}
    </>
  );
}

export function BalanceSkeleton({
  className,
  small,
}: {
  className?: string;
  small?: boolean;
}) {
  return (
    <>
      <Skeleton
        className={cn(
          "w-16 min-h-4 rounded-sm bg-foreground",
          className,
          small && "w-12 min-h-3"
        )}
      />
    </>
  );
}

export function BalanceDisplaySkeletonBase({
  showCompare = true,
}: {
  showCompare?: boolean;
}) {
  return (
    <div className="inline-flex flex-col items-end">
      <div className="text-base font-medium min-h-6 flex flex-row items-center gap-1">
        <TokenDisplay
          balance={undefined}
          token={undefined}
          precision={undefined}
        />
      </div>
      {showCompare && (
        <div className="text-xs flex flex-row items-center gap-1 text-muted-foreground h-3">
          <TokenDisplay
            balance={undefined}
            token={undefined}
            precision={undefined}
            small
          />
        </div>
      )}
    </div>
  );
}
