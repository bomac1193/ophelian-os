'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Characters' },
  { href: '/scenes', label: 'Scenes' },
  { href: '/globes', label: 'Globes' },
  { href: '/nexus', label: 'Nexus' },
  { href: '/ledger', label: 'Ledger' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <span className="nav-brand">Ophelian</span>
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
