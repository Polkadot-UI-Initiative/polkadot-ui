import { formatTokenBalance, formatTokenPrice } from "../../lib/utils.dot-ui";
import { ClientOnly } from "../client-only";

export interface BalanceDisplayProps {
  balance: bigint;
  decimals: number;
  precision: number;
  withUSD: boolean;
  usdConversionRate: number;
}

export function BalanceDisplay(props: BalanceDisplayProps) {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <BalanceDisplayInner {...props} />
    </ClientOnly>
  );
}

function BalanceDisplayInner({
  balance,
  decimals,
  precision,
  withUSD,
  usdConversionRate,
}: BalanceDisplayProps) {
  return (
    <div>
      <div>{formatTokenBalance(balance, decimals, precision)}</div>
      {withUSD && (
        <div>{formatTokenPrice(balance, decimals, usdConversionRate)}</div>
      )}
    </div>
  );
}
