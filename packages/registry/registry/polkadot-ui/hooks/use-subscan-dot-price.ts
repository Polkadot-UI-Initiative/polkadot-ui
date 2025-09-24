import { useQuery } from "@tanstack/react-query";

export function useSubscanDotPrice() {
  return useQuery<number | null>({
    queryKey: ["subscan-dot-price"],
    queryFn: async () => {
      console.log("Fetching dot price");
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", "4d0c8ba32dde4a06bda83d52af49120f");

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
    staleTime: 1000 * 60 * 0.5, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
