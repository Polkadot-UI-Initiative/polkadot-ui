import { ClientOnly } from "../client-only";
import {
  BalanceDisplayBase,
  BalanceDisplaySkeletonBase,
  type BalanceDisplayBaseProps,
} from "./balance-display.base";
import { useTypink, useBalance, NetworkId } from "typink";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/hooks/use-chaindata-json";
import { useAssetBalance } from "../../hooks/use-asset-balance.dedot";

export type BalanceDisplayProps = Omit<
  BalanceDisplayBaseProps,
  "token" | "balance" | "compareToken"
> & {
  networkId: NetworkId;
  tokenId: number | "native";
  compareTokenId?: number | "native";
  accountAddress: string;
  thousandsSeparator?: string;
  decimalSeparator?: string;
};

export function BalanceDisplay(props: BalanceDisplayProps) {
  return (
    <ClientOnly
      fallback={
        <BalanceDisplaySkeletonBase
          showCompare={props.compareTokenId !== undefined}
        />
      }
    >
      <BalanceDisplayInner {...props} />
    </ClientOnly>
  );
}

export function BalanceDisplayInner(props: BalanceDisplayProps) {
  const { supportedNetworks } = useTypink();
  const nativeBalance = useBalance(props.accountAddress, {
    networkId: props.networkId,
  });
  const assetBalance = useAssetBalance({
    address: props.accountAddress,
    chainId: props.networkId,
    assetId: typeof props.tokenId === "number" ? props.tokenId : 0,
  });
  const targetNetwork = supportedNetworks.find((n) => n.id === props.networkId);

  const chainId = targetNetwork?.id ?? "";
  const isTokenNative = props.tokenId === "native";
  const isCompareNative = props.compareTokenId === "native";

  const requestedAssetIds: number[] = [];
  if (!isTokenNative && typeof props.tokenId === "number")
    requestedAssetIds.push(props.tokenId);
  if (!isCompareNative && typeof props.compareTokenId === "number")
    requestedAssetIds.push(props.compareTokenId);

  const tokens = useTokensByAssetIds(chainId, requestedAssetIds, {
    includeNative: isTokenNative || isCompareNative,
  });

  const nativeToken = tokens.tokens[0]; // includeNative places native first
  const findByAssetId = (id: number) =>
    tokens.tokens.find((t) => t.assetId === String(id));

  const token = isTokenNative
    ? nativeToken
    : typeof props.tokenId === "number"
      ? (findByAssetId(props.tokenId) ?? tokens.tokens[0])
      : tokens.tokens[0];

  const compareToken = isCompareNative
    ? nativeToken
    : props.compareTokenId === undefined
      ? null
      : typeof props.compareTokenId === "number"
        ? (findByAssetId(props.compareTokenId) ??
          tokens.tokens[1] ??
          tokens.tokens[0])
        : null;

  return (
    <BalanceDisplayBase
      token={token}
      compareToken={compareToken}
      balance={isTokenNative ? nativeBalance?.free : assetBalance?.free}
      precision={props.precision}
      tokenConversionRate={props.tokenConversionRate}
      showCompare={props.compareTokenId !== undefined}
      thousandsSeparator={props.thousandsSeparator}
      decimalSeparator={props.decimalSeparator}
    />
  );
}
