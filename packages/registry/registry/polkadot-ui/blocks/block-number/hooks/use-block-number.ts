"use client";
import { useDedot } from "@/registry/polkadot-ui/providers/dedot-provider";
import { useEffect, useState } from "react";

export function useBlockNumber() {
  // Use the new provider API without specifying a chain - it uses the currently active chain
  // This is using PapiProvider
  // const { api, isLoading, error: apiError, currentChain } = usePolkadot();

  // Using DedotProvider
  const { api, legacy, isLoading: isLoadingDedot, error: apiError, currentChain } = useDedot();
  const [isLoadingBlock, setLoadingBlock] = useState(true);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    // Using PolkadotProvider
    // if (!api || isLoading(currentChain)) return;

    // // No type assertions needed - TypeScript knows the exact API structure!
    // const subscription = api.query.System.Number.watchValue("best").subscribe(
    //   (value: number) => {
    //     setBlockNumber(value);
    //   }
    // );

    // return () => {
    //   subscription?.unsubscribe();
    // };

    // Using DedotProvider
    let unsubscribe: any;
       
    (async () => {
     const client = api || legacy;
     if (!client) {
         return;
     }
     
     setLoadingBlock(true);

     unsubscribe = await client.query.system.number((blockNumber: number) => {   
         setBlockNumber(blockNumber);
         setLoadingBlock(false);
     });
    })();

     return () => {
         unsubscribe && unsubscribe();
     };
  }, [api, isLoadingDedot, currentChain, legacy]);

  return {
    blockNumber,
    isLoadingDedot,
    isLoadingBlock,
    error: apiError,
  };
}
