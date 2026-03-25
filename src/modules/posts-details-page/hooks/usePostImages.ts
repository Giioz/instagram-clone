export function usePostImages(imageUrl: string | null) {
  const imageUrls = (() => {
    if (!imageUrl) return [];
    try {
      const parsed = JSON.parse(imageUrl);
      return Array.isArray(parsed) ? parsed : [imageUrl];
    } catch {
      return [imageUrl];
    }
  })();

  return { imageUrls };
}
