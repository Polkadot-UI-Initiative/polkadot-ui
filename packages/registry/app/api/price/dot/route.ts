export const revalidate = 60;

export async function GET() {
  try {
    const headers = new Headers();
    const apiKey = process.env.SUBSCAN_API_KEY;
    if (apiKey) headers.append("x-api-key", apiKey);

    const response = await fetch(
      "https://polkadot.api.subscan.io/api/scan/token",
      {
        headers,
        method: "GET",
        redirect: "follow",
        next: { revalidate },
      }
    );

    if (!response.ok) {
      return Response.json({ price: null }, { status: 200 });
    }

    const data = await response.json();
    const dotPrice = data?.data?.detail?.DOT?.price;
    const priceNumber =
      typeof dotPrice === "number" ? dotPrice : parseFloat(String(dotPrice));
    const price = Number.isFinite(priceNumber) ? priceNumber : null;

    return Response.json({ price }, { status: 200 });
  } catch {
    return Response.json({ price: null }, { status: 200 });
  }
}
