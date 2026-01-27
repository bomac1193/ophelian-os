'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Characters' },
  { href: '/genome', label: 'Genome' },
  { href: '/scenes', label: 'Scenes' },
  { href: '/globes', label: 'Globes' },
  { href: '/nexus', label: 'Nexus' },
  { href: '/story-templates', label: 'Story Arcs' },
  { href: '/ledger', label: 'Ledger' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <span className="nav-brand">Bóveda</span>
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
