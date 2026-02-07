'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Operators' },
  { href: '/imprint', label: 'Imprint' },
  { href: '/genome-legend', label: 'Symbols' },
  { href: '/marketplace', label: 'Threshold' },
  { href: '/rights', label: 'Rights' },
  { href: '/universes', label: 'Universes' },
  { href: '/scenes', label: 'Scenes' },
  { href: '/globes', label: 'Regions' },
  { href: '/nexus', label: 'Nexus' },
  { href: '/story-templates', label: 'Trajectories' },
  { href: '/ledger', label: 'Ledger' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <span className="nav-brand">ZÀNÀ</span>
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
