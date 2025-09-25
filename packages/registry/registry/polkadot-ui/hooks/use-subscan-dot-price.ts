import { useQuery } from "@tanstack/react-query";

export async function getSubscanDotPrice(apiKey?: string) {
  const myHeaders = new Headers();

  if (apiKey) {
    myHeaders.append("x-api-key", apiKey);
  }

  const response = await fetch("/api/price/dot", {
    method: "GET",
    headers: myHeaders,
  });
  const data = await response.json();
  const dotPrice = data?.price;
  const priceNumber = typeof dotPrice === "number" ? dotPrice : null;
  if (!Number.isFinite(priceNumber)) return null;
  return priceNumber;
}

export function useSubscanDotPrice(apiKey?: string) {
  return useQuery<number | null>({
    queryKey: ["subscan-dot-price"],
    queryFn: () => getSubscanDotPrice(apiKey),
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
