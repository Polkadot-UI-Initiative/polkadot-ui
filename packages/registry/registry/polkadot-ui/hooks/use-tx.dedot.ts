// "use client";

// import { useEffect, useMemo } from "react";
// import type { ISubmittableExtrinsic, ISubmittableResult } from "dedot/types";
// import { useDedot } from "@/registry/polkadot-ui/providers/dedot-provider";
// import type { ChainId } from "@/registry/polkadot-ui/lib/config.dot-ui";
// import type { ConfiguredChainApi } from "@/registry/polkadot-ui/lib/types.dedot";

// // Overloads to enable inference when chainId is a literal
// export function useTx<T extends ChainId>(
//   build: (
//     tx: ConfiguredChainApi<T>["tx"]
//   ) => ISubmittableExtrinsic<ISubmittableResult> | undefined,
//   options: { chainId: T }
// ): ISubmittableExtrinsic | undefined;

// export function useTx(
//   build: (tx: any) => ISubmittableExtrinsic<ISubmittableResult> | undefined,
//   options?: { chainId?: ChainId }
// ): ISubmittableExtrinsic | undefined;

// export function useTx(
//   build: (tx: any) => ISubmittableExtrinsic<ISubmittableResult> | undefined,
//   options?: { chainId?: ChainId }
// ) {
//   const { apis, api: activeApi, initializeChain } = useDedot();
//   const requestedChainId = options?.chainId;

//   useEffect(() => {
//     if (!requestedChainId) return;
//     if (apis[requestedChainId]) return;
//     // Initialize lazily; no-op on server
//     initializeChain(requestedChainId).catch(() => {});
//   }, [requestedChainId, apis, initializeChain]);

//   const targetApi = (
//     requestedChainId
//       ? (apis[requestedChainId] as ConfiguredChainApi<ChainId> | undefined)
//       : (activeApi as ConfiguredChainApi<ChainId> | undefined)
//   ) as ConfiguredChainApi<ChainId> | undefined;

//   return useMemo(() => {
//     if (!targetApi) return undefined;
//     return build(targetApi.tx as any) ?? undefined;
//   }, [targetApi, build]);
// }
