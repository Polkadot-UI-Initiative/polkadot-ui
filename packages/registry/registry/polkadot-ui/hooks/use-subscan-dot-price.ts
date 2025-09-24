import { useQuery } from "@tanstack/react-query";

export function useSubscanDotPrice(apiKey?: string) {
  return useQuery<number | null>({
    queryKey: ["subscan-dot-price"],
    queryFn: async () => {
      const myHeaders = new Headers();

      const subscanApiKey = apiKey || "4d0c8ba32dde4a06bda83d52af49120f";
      if (!subscanApiKey) {
        throw new Error("SUBSCAN_API_KEY is not set");
      }
      myHeaders.append("x-api-key", subscanApiKey);

      const response = await fetch(
        "https://polkadot.api.subscan.io/api/scan/token",
        {
          headers: myHeaders,
          method: "GET",
          redirect: "follow",
        }
      );
      const data = await response.json();
      const dotPrice = data?.data?.detail?.DOT?.price;
      const priceNumber =
        typeof dotPrice === "number" ? dotPrice : parseFloat(String(dotPrice));
      if (!Number.isFinite(priceNumber)) return null;
      return priceNumber;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        error.message.includes("SUBSCAN_API_KEY is not set")
      )
        return false;
      return failureCount < 5;
    },
    retryDelay: (attemptIndex) => {
      const baseDelayMs = 1000;
      const maxDelayMs = 30000;
      const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** attemptIndex);
      const jitter = Math.random() * 0.3 * exp;
      return exp + jitter;
    },
  });
}
