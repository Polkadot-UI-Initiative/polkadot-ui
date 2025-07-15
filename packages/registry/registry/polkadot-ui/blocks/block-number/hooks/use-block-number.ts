"use client"

import { useEffect, useState } from "react";
import { usePolkadotContext } from "@/registry/polkadot-ui/providers/polkadot-provider";

export function useBlockNumber() {
    const [blockNumber, setBlockNumber] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const { api, legacy, apiReady } = usePolkadotContext();

    useEffect(() => {
       let unsubscribe: any;
       
       (async () => {
        const client = api || legacy;
        if (!client) {
            return;
        }
        
        setLoading(true);

        unsubscribe = await client.query.system.number((blockNumber: number) => {   
            setBlockNumber(blockNumber);
            setLoading(false);
        });
       })();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [api, apiReady, legacy]);

    return {
        blockNumber,
        isLoading,
    };
}