/**
 * Largest zoom that fits the container. Integer zoom keeps every game pixel the
 * same size; on screens smaller than the base resolution we fall back to a
 * fractional zoom so the game still fits.
 */
export function computePixelZoom(
  containerWidth: number,
  containerHeight: number,
  baseWidth: number,
  baseHeight: number,
): number {
  if (containerWidth <= 0 || containerHeight <= 0) return 1;
  const fit = Math.min(containerWidth / baseWidth, containerHeight / baseHeight);
  return fit >= 1 ? Math.floor(fit) : fit;
}
