/**
 * Resolves a path inside /public against Vite's configured base URL.
 * Never hardcode '/assets/...' or a repository name: always go through this helper,
 * so the build works at both the domain root and a GitHub Pages sub-path.
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
