export interface StockPhoto {
  id: string;
  url: string;
  author: string;
}

const QUERIES = [
  "abstract",
  "texture",
  "nature",
  "city",
  "sky",
  "ocean",
  "forest",
  "architecture",
  "light",
  "water",
];

export async function fetchRandomStockPhotos(
  count: number,
  apiKey: string,
  rand: () => number,
): Promise<StockPhoto[]> {
  const idx = Math.floor(rand() * QUERIES.length);
  const query = QUERIES[idx] ?? "abstract";
  const perPage = Math.max(count, 1);
  const url =
    "https://api.pexels.com/v1/search?query=" +
    encodeURIComponent(query) +
    "&per_page=" +
    perPage +
    "&orientation=square";

  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (res.status >= 400) throw new Error("Pexels API error: " + res.status);

  const data = (await res.json()) as {
    photos: Array<{
      id: number;
      photographer: string;
      src: { large: string };
    }>;
  };

  return data.photos.slice(0, count).map((p) => ({
    id: String(p.id),
    url: p.src.large,
    author: p.photographer,
  }));
}

export async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (res.status >= 400) throw new Error("Download failed: " + res.status);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}
