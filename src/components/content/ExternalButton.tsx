/** Pixel button for links that leave the site (GitHub, demos); opens in a new tab. */
export function ExternalButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="self-start bg-wheat px-4 py-2 text-sm text-soil-dark pixel-button hover:bg-parchment">
      {label} ↗<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
