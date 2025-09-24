"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TokenInfo } from "@/registry/polkadot-ui/lib/types.dot-ui";
import { formatTokenBalance } from "@/registry/polkadot-ui/lib/utils.dot-ui";
import { cn } from "@/lib/utils";

export interface BalanceDisplayBaseProps {
  // null if not available, undefined if not set
  balance: bigint | null | undefined;
  precision?: number;
  token: TokenInfo | null | undefined;
  // Optional compare token (e.g., USD), and conversion rate from base token to compare token
  compareToken?: TokenInfo | null | undefined;
  tokenConversionRate?: number | null | undefined;
  comparePrecision?: number | null | undefined;
}

export function BalanceDisplayBase(props: BalanceDisplayBaseProps) {
  const {
    balance,
    precision = 4,
    token,
    compareToken = null,
    tokenConversionRate = null,
    comparePrecision = null,
  } = props;

  const showCompare =
    compareToken !== undefined && tokenConversionRate !== undefined;

  const compareAmount = (() => {
    if (
      typeof balance !== "bigint" ||
      typeof tokenConversionRate !== "number" ||
      !Number.isFinite(tokenConversionRate)
    )
      return undefined;

    const centsPerToken = BigInt(Math.round(tokenConversionRate * 100)); // e.g., 450n
    const base = 10n ** BigInt(token?.decimals ?? 12);
    const cents = (balance * centsPerToken) / base;
    return cents;
  })();

  return (
    <>
      <div className="inline-flex flex-col items-end">
        <div className="text-base font-medium min-h-6 flex flex-row items-center gap-1">
          <TokenDisplay balance={balance} token={token} precision={precision} />
        </div>
        {showCompare && (
          <div className="text-xs flex flex-row items-center gap-1 text-muted-foreground h-3">
            <TokenDisplay
              balance={compareAmount}
              token={compareToken}
              precision={comparePrecision ?? precision}
            />
          </div>
        )}
      </div>
    </>
  );
}

export function TokenDisplay({
  balance,
  token,
  precision,
}: Pick<BalanceDisplayBaseProps, "balance" | "token" | "precision">) {
  const isBalanceLoading = balance === undefined;
  const isTokenLoading = token === undefined;

  const formatted =
    typeof balance === "bigint"
      ? formatTokenBalance(balance, token?.decimals ?? 12, precision)
      : undefined;

  return (
    <>
      {isBalanceLoading ? <BalanceSkeleton /> : <>{formatted} </>}
      {isTokenLoading ? (
        <TokenSkeleton />
      ) : (
        <>
          {token?.symbol}
          {token?.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={token.logo}
              alt={token.symbol}
              className="size-4 opacity-0 transition-opacity duration-500"
              onLoad={(e) => e.currentTarget.classList.add("opacity-100")}
            />
          )}
        </>
      )}
    </>
  );
}

export function TokenSkeleton({ withIcon = true }: { withIcon?: boolean }) {
  return (
    <>
      <Skeleton className="w-8 h-4 rounded-sm bg-foreground" />
      {withIcon && <Skeleton className="w-4 h-4 rounded-full bg-foreground" />}
    </>
  );
}

export function BalanceSkeleton({ className }: { className?: string }) {
  return (
    <>
      <Skeleton
        className={cn("w-16 min-h-4 rounded-sm bg-foreground", className)}
      />
    </>
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
  const showCompare =
    props.compareToken !== undefined && props.tokenConversionRate !== undefined;
  return (
    <div className="inline-flex flex-col items-end gap-1">
      <div className="flex flex-row items-center gap-1 text-base font-medium min-h-6">
        <Skeleton className="w-16 h-4 rounded-sm bg-foreground" />
        <Skeleton className="w-4 h-4 rounded-full bg-foreground" />
        {props.token?.symbol}
      </div>
      {showCompare && (
        <div className="flex flex-row items-center gap-1">
          <div className="text-xs flex flex-row items-center gap-1 text-muted-foreground h-3">
            <Skeleton className="w-14 h-3 rounded-sm bg-muted-foreground" />
            <Skeleton className="w-4 h-4 rounded-full bg-foreground" />
            {props.compareToken?.symbol}
          </div>
        </div>
      )}
    </div>
  );
}
