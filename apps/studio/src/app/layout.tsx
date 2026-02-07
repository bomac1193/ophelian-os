import type { Metadata } from 'next';
import './globals.css';
import { LayoutContent } from '@/components/LayoutContent';

export const metadata: Metadata = {
  title: 'ZÀNÀ',
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
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
