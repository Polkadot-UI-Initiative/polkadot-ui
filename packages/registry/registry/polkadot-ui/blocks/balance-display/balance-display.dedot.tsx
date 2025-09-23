import { ClientOnly } from "../client-only";
import {
  BalanceDisplayBase,
  BalanceDisplaySkeletonBase,
  type BalanceDisplayBaseProps,
} from "./balance-display.base";
import { useTypink, useBalance, NetworkId } from "typink";
import { useTokensByAssetIds } from "@/registry/polkadot-ui/blocks/select-token/hooks/use-chaindata-json.dedot";

export type BalanceDisplayProps = Omit<
  BalanceDisplayBaseProps,
  "token" | "balance" | "compareToken"
> & {
  networkId: NetworkId;
  tokenId: number | "native";
  compareTokenId: number | "native";
  accountAddress: string;
};

export function BalanceDisplay(props: BalanceDisplayProps) {
  return (
    <ClientOnly>
      <BalanceDisplayInner {...props} />
    </ClientOnly>
  );
}

export function BalanceDisplayInner(props: BalanceDisplayProps) {
  let tokenId = props.tokenId;
  let compareTokenId = props.compareTokenId;

  if (tokenId === "native") {
    tokenId = 0;
  }
  if (compareTokenId === "native") {
    compareTokenId = 0;
  }

  const { supportedNetworks } = useTypink();
  const balance = useBalance(props.accountAddress, {
    networkId: props.networkId,
  });
  const targetNetwork = supportedNetworks.find((n) => n.id === props.networkId);

  const tokens = useTokensByAssetIds(
    targetNetwork?.id ?? "",
    [compareTokenId],
    {
      includeNative: tokenId === 0 || compareTokenId === 0,
    }
  );

  let token = tokens.tokens[0];
  let compareToken = tokens.tokens[0];

  if (tokenId !== 0) {
    token = tokens.tokens[0];
  } else {
    token = tokens.tokens[0];
  }

  if (compareTokenId == 0) {
    compareToken = tokens.tokens[0];
  } else if (tokens.tokens.length === 2) {
    compareToken = tokens.tokens[1];
  } else {
    compareToken = tokens.tokens[0];
  }

  return (
    <ClientOnly fallback={<BalanceDisplaySkeletonBase />}>
      <BalanceDisplayBase
        token={token}
        compareToken={compareToken}
        balance={balance?.free}
        tokenConversionRate={props.tokenConversionRate}
      />
    </ClientOnly>
  );
}
