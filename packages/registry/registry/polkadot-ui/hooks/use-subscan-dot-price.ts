import { useQuery } from "@tanstack/react-query";

export function useSubscanDotPrice(apiKey?: string) {
  const subscanApiKey = apiKey;
  return useQuery<number | null>({
    queryKey: ["subscan-dot-price"],
    queryFn: async () => {
      const myHeaders = new Headers();

      if (subscanApiKey) {
        myHeaders.append("x-api-key", subscanApiKey);
      }

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
    enabled: !!subscanApiKey,
    retry: (failureCount) => failureCount < 5,
    retryDelay: (attemptIndex) => {
      const baseDelayMs = 1000;
      const maxDelayMs = 30000;
      const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** attemptIndex);
      const jitter = Math.random() * 0.3 * exp;
      return exp + jitter;
    },
  });
}
