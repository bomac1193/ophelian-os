import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Living Character OS - Studio',
  description: 'Manage your AI characters, content, and publishing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-link">
            Characters
          </Link>
          <Link href="/world" className="nav-link">
            World
          </Link>
          <Link href="/ledger" className="nav-link">
            Ledger
          </Link>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
