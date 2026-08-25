import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Start Here',
  description:
    'A short onboarding page for choosing the calmest useful next step in The Nurse Lab, based on whether you are here for OSCEs, quizzes, placement, or free study guides.',
  path: '/onboarding',
  noIndex: true,
});

type RouteKey = 'free' | 'quiz' | 'osce' | 'bundle';

type StepLink = {
  href: string;
  label: string;
  note: string;
};

type RouteConfig = {
  kicker: string;
  title: string;
  summary: string;
  checklist: string[];
  primary: StepLink;
  secondary: StepLink;
  tertiary: StepLink;
};

const ROUTES: Record<RouteKey, RouteConfig> = {
  free: {
    kicker: 'Free start',
    title: 'Start with one useful free step.',
    summary:
      'If you signed up to stop drifting and get a calmer starting point, begin with one guide, one saved page, and one small practice block.',
    checklist: [
      'Read one study-skills guide before trying to plan the whole week.',
      'Open a free hub page and save the one you keep revisiting.',
      'Use the dashboard after you have done one useful action, not before.',
    ],
    primary: {
      href: '/study-skills',
      label: 'Browse study skills',
      note: 'Start with the gentlest route into revision structure and calmer setup changes.',
    },
    secondary: {
      href: '/how-to-use',
      label: 'Read how to use The Nurse Lab',
      note: 'Best if you want the site to tell you the order instead of inventing one from scratch.',
    },
    tertiary: {
      href: '/hub/childrens',
      label: 'Open the free hub',
      note: 'Pick one resource and treat that as today’s win.',
    },
  },
  quiz: {
    kicker: 'Quiz route',
    title: 'Use recall first, then tidy up the gaps.',
    summary:
      'Quiz access works best when you start active, notice what feels slow, then read only enough to patch that specific weak spot.',
    checklist: [
      'Answer a short block before reading anything.',
      'Write down one weak topic instead of six.',
      'Use a guide only after the quiz shows you what is sticky.',
    ],
    primary: {
      href: '/quiz',
      label: 'Start a quiz session',
      note: 'A short recall block gives you the clearest signal about what to do next.',
    },
    secondary: {
      href: '/dashboard',
      label: 'Open your dashboard',
      note: 'Useful after one session, when the stats have something real to say.',
    },
    tertiary: {
      href: '/hub/resources/drug-calculations-cheat-sheet',
      label: 'Read a targeted revision guide',
      note: 'Good when the quiz shows a specific weakness you can fix in one sitting.',
    },
  },
  osce: {
    kicker: 'OSCE route',
    title: 'Practise one station before you optimise anything.',
    summary:
      'OSCE prep improves fastest when you speak one station out loud, review the checklist honestly, and only then look for the next missing piece.',
    checklist: [
      'Run one station out loud before reading around it.',
      'Use the checklist as feedback, not a verdict.',
      'Pair practice with one placement guide when you want extra context.',
    ],
    primary: {
      href: '/osce',
      label: 'Open the OSCE tool',
      note: 'Start with one station and one clean reset, not a marathon.',
    },
    secondary: {
      href: '/hub/resources/placement-survival',
      label: 'Read placement survival',
      note: 'Best when you want practical context around confidence, communication, and first shifts.',
    },
    tertiary: {
      href: '/dashboard',
      label: 'Settle into your dashboard',
      note: 'Useful once you want your practice history and next-step widgets in one place.',
    },
  },
  bundle: {
    kicker: 'Bundle route',
    title: 'Use the tools in a simple order.',
    summary:
      'The calmest way into the full product is recall first, one practical station second, then one guide only for the bit that still feels thin.',
    checklist: [
      'Start with a short active block, not a long reading block.',
      'Let the tool result choose the guide, not the other way round.',
      'Stop after one clean loop and come back tomorrow.',
    ],
    primary: {
      href: '/quiz',
      label: 'Warm up with the quiz',
      note: 'Five to ten questions is enough to surface what needs attention.',
    },
    secondary: {
      href: '/osce',
      label: 'Run one OSCE station',
      note: 'Carry the same weak topic into one practical station while it is still fresh.',
    },
    tertiary: {
      href: '/hub/childrens',
      label: 'Patch the weakest topic in the hub',
      note: 'Use one guide to close one gap instead of opening six tabs.',
    },
  },
};

const OTHER_ROUTES: Array<{ key: RouteKey; label: string }> = [
  { key: 'free', label: 'Free guides' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'osce', label: 'OSCE' },
  { key: 'bundle', label: 'Full bundle' },
];

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pickRoute(product: string | undefined): RouteKey {
  if (product === 'quiz') return 'quiz';
  if (product === 'osce') return 'osce';
  if (product === 'bundle') return 'bundle';
  return 'free';
}

function buildOnboardingHref(route: RouteKey) {
  return route === 'free' ? '/onboarding?entry=signup' : `/onboarding?entry=success&product=${route}`;
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const firstName = user?.firstName?.trim() ?? null;
  const resolvedSearchParams = await searchParams;
  const entry = readParam(resolvedSearchParams.entry);
  const product = readParam(resolvedSearchParams.product);
  const route = pickRoute(product);
  const config = ROUTES[route];
  const intro =
    entry === 'success'
      ? 'Your access is live. Use this page to choose the least overwhelming way into it.'
      : 'You do not need a perfect plan. Pick the route that matches why you came here and let that be enough for today.';

  return (
    <div className="ob-page">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ob-page {
              min-height: 100vh;
              background:
                radial-gradient(circle at top left, rgba(250, 238, 218, 0.82), transparent 34%),
                linear-gradient(180deg, var(--surface-raised) 0%, var(--surface-sunken) 100%);
              color: #1c1813;
              font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }
            .ob-wrap {
              max-width: 1120px;
              margin: 0 auto;
              padding: 48px 24px 88px;
            }
            .ob-back {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 40px;
              color: #7a7267;
              text-decoration: none;
              text-transform: uppercase;
              letter-spacing: 0.16em;
              font-size: 10px;
            }
            .ob-back:hover { color: #1c1813; }
            .ob-hero {
              display: grid;
              grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.9fr);
              gap: 28px;
              align-items: start;
            }
            .ob-kicker {
              margin: 0 0 14px;
              text-transform: uppercase;
              letter-spacing: 0.18em;
              font-size: 10px;
              color: #8d7f70;
            }
            .ob-title {
              margin: 0 0 18px;
              font-family: "Playfair Display", Georgia, serif;
              font-size: clamp(2.7rem, 6vw, 4.6rem);
              line-height: 0.98;
              font-weight: 400;
              max-width: 10ch;
            }
            .ob-copy {
              max-width: 54ch;
              font-size: 15px;
              line-height: 1.9;
              color: var(--ink-soft);
              margin: 0;
            }
            .ob-recommendation {
              background: rgba(255, 255, 255, 0.72);
              border: 1px solid rgba(28, 24, 19, 0.1);
              padding: 22px 22px 24px;
              box-shadow: 0 18px 42px rgba(28, 24, 19, 0.07);
            }
            .ob-recommendation-label {
              margin: 0 0 10px;
              text-transform: uppercase;
              letter-spacing: 0.16em;
              font-size: 10px;
              color: #8d7f70;
            }
            .ob-recommendation-title {
              margin: 0 0 10px;
              font-family: "Playfair Display", Georgia, serif;
              font-size: 28px;
              line-height: 1.08;
              font-weight: 400;
            }
            .ob-recommendation-copy {
              margin: 0;
              font-size: 14px;
              line-height: 1.8;
              color: var(--ink-soft);
            }
            .ob-section-title {
              margin: 56px 0 18px;
              padding: 16px 0 14px;
              border-top: 1px solid rgba(28, 24, 19, 0.09);
              border-bottom: 1px solid rgba(28, 24, 19, 0.09);
              font-family: "Playfair Display", Georgia, serif;
              font-size: 28px;
              font-weight: 400;
            }
            .ob-grid {
              display: grid;
              grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
              gap: 22px;
            }
            .ob-card {
              background: rgba(255, 255, 255, 0.84);
              border: 1px solid rgba(28, 24, 19, 0.1);
              padding: 24px;
            }
            .ob-card-kicker {
              margin: 0 0 10px;
              text-transform: uppercase;
              letter-spacing: 0.18em;
              font-size: 10px;
              color: var(--ink-faint);
            }
            .ob-card-title {
              margin: 0 0 12px;
              font-family: "Playfair Display", Georgia, serif;
              font-size: 28px;
              line-height: 1.06;
              font-weight: 400;
            }
            .ob-card-copy {
              margin: 0 0 18px;
              font-size: 14px;
              line-height: 1.85;
              color: var(--ink-soft);
            }
            .ob-checklist {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            .ob-checklist li {
              position: relative;
              padding-left: 16px;
              margin-bottom: 10px;
              font-size: 13px;
              line-height: 1.7;
              color: #423d36;
            }
            .ob-checklist li::before {
              content: "–";
              position: absolute;
              left: 0;
              color: #b39779;
            }
            .ob-actions {
              display: grid;
              gap: 12px;
            }
            .ob-action {
              display: block;
              padding: 18px 20px;
              text-decoration: none;
              border: 1px solid rgba(28, 24, 19, 0.1);
              background: var(--surface-raised);
              color: inherit;
            }
            .ob-action:hover {
              background: var(--surface-raised);
              border-color: rgba(28, 24, 19, 0.18);
            }
            .ob-action-label {
              display: block;
              margin-bottom: 4px;
              font-size: 14px;
              color: #1c1813;
            }
            .ob-action-note {
              display: block;
              font-size: 12px;
              line-height: 1.7;
              color: #7a7267;
            }
            .ob-route-grid {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 14px;
            }
            .ob-route-card {
              border: 1px solid rgba(28, 24, 19, 0.1);
              background: rgba(255, 255, 255, 0.76);
              padding: 18px;
              text-decoration: none;
              color: inherit;
            }
            .ob-route-card:hover {
              border-color: rgba(28, 24, 19, 0.18);
              background: rgba(255, 248, 240, 0.92);
            }
            .ob-route-chip {
              display: inline-flex;
              margin-bottom: 12px;
              padding: 4px 8px;
              background: var(--amber-50);
              color: #7a4b2e;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              font-size: 9px;
            }
            .ob-route-title {
              margin: 0 0 8px;
              font-size: 14px;
              color: #1c1813;
            }
            .ob-route-note {
              margin: 0;
              font-size: 12px;
              line-height: 1.7;
              color: #6a6359;
            }
            @media (max-width: 920px) {
              .ob-hero,
              .ob-grid,
              .ob-route-grid {
                grid-template-columns: 1fr;
              }
            }
            @media (max-width: 640px) {
              .ob-wrap {
                padding: 32px 20px 72px;
              }
              .ob-card,
              .ob-recommendation,
              .ob-route-card {
                padding: 20px;
              }
            }
          `,
        }}
      />

      <div className="ob-wrap">
        <Link href="/dashboard" className="ob-back">
          <span>←</span>
          Back to dashboard
        </Link>

        <section className="ob-hero">
          <div>
            <p className="ob-kicker">Start Here · Onboarding</p>
            <h1 className="ob-title">
              {firstName ? `${firstName}, start with the calmest useful step.` : 'Start with the calmest useful step.'}
            </h1>
            <p className="ob-copy">{intro}</p>
          </div>

          <div className="ob-recommendation">
            <p className="ob-recommendation-label">Recommended route</p>
            <h2 className="ob-recommendation-title">{config.title}</h2>
            <p className="ob-recommendation-copy">{config.summary}</p>
          </div>
        </section>

        <h2 className="ob-section-title">Your next 15 minutes</h2>
        <section className="ob-grid">
          <div className="ob-card">
            <p className="ob-card-kicker">{config.kicker}</p>
            <h3 className="ob-card-title">Keep the plan small enough to start.</h3>
            <p className="ob-card-copy">
              A short, honest session is more useful than a perfect plan you do not open. Use this route as your container,
              then stop after one clean loop.
            </p>
            <ul className="ob-checklist">
              {config.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ob-actions" aria-label="Suggested next steps">
            {[config.primary, config.secondary, config.tertiary].map((action) => (
              <Link key={action.href} href={action.href} className="ob-action">
                <span className="ob-action-label">{action.label} →</span>
                <span className="ob-action-note">{action.note}</span>
              </Link>
            ))}
          </div>
        </section>

        <h2 className="ob-section-title">Other ways in</h2>
        <section className="ob-route-grid">
          {OTHER_ROUTES.filter((option) => option.key !== route).map((option) => {
            const routeConfig = ROUTES[option.key];
            return (
              <Link key={option.key} href={buildOnboardingHref(option.key)} className="ob-route-card">
                <span className="ob-route-chip">{option.label}</span>
                <p className="ob-route-title">{routeConfig.title}</p>
                <p className="ob-route-note">{routeConfig.summary}</p>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
}
