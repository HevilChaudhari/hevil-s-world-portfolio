import { Missing } from '@/components/content/Missing';
import type { ContactInfo } from '@/types/profile';

interface ContactLink {
  label: string;
  href: string;
  text: string;
  external: boolean;
}

const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/**
 * Email, GitHub, LinkedIn and website links. Each of the three main channels
 * that is not set yet shows a "To be added" box instead of a guessed address.
 */
export function ContactLinks({ contact, compact = false }: { contact: ContactInfo; compact?: boolean }) {
  const links: ContactLink[] = [];
  if (contact.email) links.push({ label: 'Email', href: `mailto:${contact.email}`, text: contact.email, external: false });
  if (contact.github) links.push({ label: 'GitHub', href: contact.github, text: display(contact.github), external: true });
  if (contact.linkedin) links.push({ label: 'LinkedIn', href: contact.linkedin, text: display(contact.linkedin), external: true });
  if (contact.website) links.push({ label: 'Website', href: contact.website, text: display(contact.website), external: true });

  const missing = (
    [
      ['Email address', contact.email],
      ['GitHub profile link', contact.github],
      ['LinkedIn profile link', contact.linkedin],
    ] as const
  ).filter(([, value]) => !value);

  return (
    <div className="flex flex-col gap-3">
      {links.length > 0 && (
        <ul className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex flex-col bg-white px-4 py-3 pixel-border hover:bg-parchment"
              >
                <span className="font-pixel text-xs font-bold uppercase tracking-wider text-grass-dark">{link.label}</span>
                <span className="break-all font-semibold">
                  {link.text}
                  {link.external && (
                    <>
                      {' '}
                      ↗<span className="sr-only"> (opens in a new tab)</span>
                    </>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {contact.location && (
        <p className="text-sm">
          <span className="font-bold">Based in:</span> {contact.location}
        </p>
      )}
      {missing.map(([what]) => (
        <Missing key={what} what={what} hint="Set it in src/data/profile.ts (contact)." />
      ))}
    </div>
  );
}
