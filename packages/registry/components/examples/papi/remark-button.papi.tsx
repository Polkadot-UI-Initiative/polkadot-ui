"use client";

import { ChainId } from "@reactive-dot/core";
import { TxButton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.papi";
import { Suspense } from "react";
import { Binary } from "polkadot-api";
import { useTypedApi } from "@reactive-dot/react";
import { TxButtonSkeleton } from "@/registry/polkadot-ui/blocks/tx-button/components/tx-button.base";

export function RemarkButton({ chainId }: { chainId: ChainId }) {
  // const { client } = usePapi(chainId);
  // const typedApi = client?.getTypedApi(config.chains[chainId].descriptor);

  const typedApi = useTypedApi({ chainId });
  const transaction = typedApi?.tx.System.remark({
    remark: Binary.fromText("Hello World from polkadot-ui"),
  });
  return (
    <Suspense fallback={<TxButtonSkeleton />}>
      <TxButton transaction={transaction} networkId={chainId}>
        Remark
      </TxButton>
    </Suspense>
  );
}
