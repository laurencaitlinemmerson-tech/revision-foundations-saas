import { generatePageMetadata } from '@/lib/seo';
import MuswellHillGame from '@/components/game/MuswellHillGame';

export const metadata = generatePageMetadata({
  title: 'Muswell Hill Makeover — a match-3 break',
  description:
    'A Homescapes-style match-3 game set in Muswell Hill, North London. Match Broadway icons — Alexandra Palace, the bakery, a flat white, the bookshop — to earn stars and do up a Victorian terrace. A calm five-minute study break.',
  path: '/game',
});

export default function GamePage() {
  return <MuswellHillGame />;
}
