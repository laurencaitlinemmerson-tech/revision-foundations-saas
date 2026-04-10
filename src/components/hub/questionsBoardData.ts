export const TAGS = [
  'OSCE',
  'Adult Nursing',
  'Paeds',
  'Mental Health',
  'Meds & Calculations',
  'Placement',
  'Exams',
  'General',
];

export const STARTER_PROMPTS = [
  {
    title: 'OSCE wording that feels awkward',
    description: 'Useful for the lines you keep stumbling over in introductions, explanations, or handovers.',
  },
  {
    title: 'Placement questions you do not want to carry alone',
    description: 'Ask about routines, documentation, confidence dips, or what usually helps on shift.',
  },
  {
    title: 'Calculations or safety checks that keep blurring together',
    description: 'Short, specific calculation questions are much easier to answer clearly than broad panic.',
  },
];

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
