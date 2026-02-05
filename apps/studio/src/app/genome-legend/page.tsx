/**
 * Symbol Legend Page
 * Interactive reference for all Orisha symbols and their meanings
 */

import { SymbolLegend } from '@/components/genome';

export const metadata = {
  title: 'Symbol Legend | Bóveda Studio',
  description: 'Explore the symbolic language of character genomes. Discover how Orishas, mathematical symbols, and geometric primitives create unique character archetypes.',
};

export default function GenomeLegendPage() {
  return <SymbolLegend searchable />;
}
