import type { ChainId } from "@/registry/dot-ui/lib/config.dot-ui";

const clientToChainId = new WeakMap<object, ChainId>();

export function registerClientChainId(client: unknown, chainId: ChainId): void {
  if (!client || (typeof client !== "object" && typeof client !== "function"))
    return;
  clientToChainId.set(client as object, chainId);
}

export function getChainIdForClient(client: unknown): ChainId | null {
  if (!client || (typeof client !== "object" && typeof client !== "function"))
    return null;
  return clientToChainId.get(client as object) ?? null;
}
