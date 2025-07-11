"use client"

import { useEffect, useState } from "react";
import { useApiContext } from "../../../providers/api-provider";

export function useBlockNumber() {
    const [blockNumber, setBlockNumber] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const { api, legacy, apiReady } = useApiContext();

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