'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

type StudyTone = 'quiz' | 'osce' | 'hub' | 'mixed' | 'reset';

type StudyBlock = {
  id: string;
  date: Date;
  title: string;
  compact: string;
  summary: string;
  duration: string;
  badge: string;
  tone: StudyTone;
  bullets: string[];
  href: string;
  hrefLabel: string;
  start: Date;
  end: Date;
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatRange(start: Date, end: Date) {
  const rangeFormatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  });

  return `${rangeFormatter.format(start)} - ${rangeFormatter.format(end)}`;
}

function formatShortDay(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
  }).format(date);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function formatGoogleDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}T${hour}${minute}00`;
}

function formatIcsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function buildGoogleUrl(block: StudyBlock, timeZone: string) {
  const details = [
    'The Nurse Lab exam-season study block.',
    '',
    block.summary,
    '',
    ...block.bullets.map((bullet) => `• ${bullet}`),
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `The Nurse Lab: ${block.title}`,
    details,
    dates: `${formatGoogleDate(block.start)}/${formatGoogleDate(block.end)}`,
    ctz: timeZone,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsFile(blocks: StudyBlock[]) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Nurse Lab//Exam Season Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  blocks.forEach((block) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${block.id}@nurselab.co.uk`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(block.start)}`,
      `DTEND:${formatIcsDate(block.end)}`,
      `SUMMARY:${escapeIcsText(`The Nurse Lab: ${block.title}`)}`,
      `DESCRIPTION:${escapeIcsText([block.summary, '', ...block.bullets.map((bullet) => `- ${bullet}`)].join('\n'))}`,
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

function buildBlock(date: Date, hasOsce: boolean, hasQuiz: boolean): StudyBlock {
  const weekday = date.getDay();
  const isoDate = date.toISOString().slice(0, 10);
  const start = new Date(date);
  const end = new Date(date);

  const setTimes = (hour: number, minute: number, lengthMinutes: number) => {
    start.setHours(hour, minute, 0, 0);
    end.setHours(hour, minute + lengthMinutes, 0, 0);
  };

  if (weekday === 1) {
    if (hasQuiz) {
      setTimes(19, 0, 25);
      return {
        id: `${isoDate}-quiz-recall`,
        date,
        title: 'Quiz recall reset',
        compact: '10 questions and one weak topic.',
        summary: 'Use Monday to wake your memory up without turning it into a marathon.',
        duration: '25 min',
        badge: 'Recall',
        tone: 'quiz',
        bullets: [
          'Open the quiz and do a short set first.',
          'Notice which topic still feels shaky.',
          'Write down one thing to revisit later in the week.',
        ],
        href: '/quiz',
        hrefLabel: 'Open Core Quiz',
        start,
        end,
      };
    }

    setTimes(19, 0, 20);
    return {
      id: `${isoDate}-hub-reset`,
      date,
      title: 'Hub reset read',
      compact: 'Open one guide and skim the high-yield bits.',
      summary: 'A calmer start works well if you do not have the quiz unlocked yet.',
      duration: '20 min',
      badge: 'Read',
      tone: 'hub',
      bullets: [
        'Pick one guide you keep meaning to revisit.',
        'Read headings, red flags, and recap only.',
        'Say one explanation out loud before you stop.',
      ],
      href: '/hub',
      hrefLabel: 'Open the hub',
      start,
      end,
    };
  }

  if (weekday === 2) {
    if (hasOsce) {
      setTimes(19, 15, 30);
      return {
        id: `${isoDate}-osce-practice`,
        date,
        title: 'One OSCE station aloud',
        compact: 'Run a single station properly.',
        summary: 'Treat one station like the real exam and focus on your structure rather than speed.',
        duration: '30 min',
        badge: 'Speak',
        tone: 'osce',
        bullets: [
          'Choose one station you would rather avoid.',
          'Say your answer out loud from start to finish.',
          'Fix the part where your wording gets vague.',
        ],
        href: '/osce',
        hrefLabel: 'Launch OSCE',
        start,
        end,
      };
    }

    setTimes(19, 15, 20);
    return {
      id: `${isoDate}-preview-practice`,
      date,
      title: 'Preview station practice',
      compact: 'Use the free station flow like a speaking prompt.',
      summary: 'Even the preview is enough for a short structure-focused session.',
      duration: '20 min',
      badge: 'Preview',
      tone: 'mixed',
      bullets: [
        'Open the OSCE preview and read the prompt once.',
        'Talk through A-E or your station structure aloud.',
        'Notice where you hesitate and repeat that bit once.',
      ],
      href: '/osce',
      hrefLabel: 'Open preview',
      start,
      end,
    };
  }

  if (weekday === 3) {
    setTimes(18, 45, 20);
    return {
      id: `${isoDate}-hub-consolidation`,
      date,
      title: 'Hub consolidation',
      compact: 'Read one guide with exams in mind.',
      summary: 'Use mid-week to tidy up definitions, signs, and red flags in a calmer reading block.',
      duration: '20 min',
      badge: 'Consolidate',
      tone: 'hub',
      bullets: [
        'Open one hub page linked to recent weak areas.',
        'Read the quick framework, callouts, and recap.',
        'Turn one section into your own plain-English explanation.',
      ],
      href: '/hub',
      hrefLabel: 'Browse the hub',
      start,
      end,
    };
  }

  if (weekday === 4) {
    if (hasQuiz) {
      setTimes(19, 0, 25);
      return {
        id: `${isoDate}-weak-topic-quiz`,
        date,
        title: 'Weak-topic quiz block',
        compact: 'Go straight at the topic you keep dodging.',
        summary: 'Thursday is a good day to stop circling your weaker area and actually test it.',
        duration: '25 min',
        badge: 'Target',
        tone: 'quiz',
        bullets: [
          'Choose one topic you scored poorly on before.',
          'Do a short set without notes first.',
          'Read the explanation and decide if the gap was recall or method.',
        ],
        href: '/quiz',
        hrefLabel: 'Practise weak topics',
        start,
        end,
      };
    }

    if (hasOsce) {
      setTimes(19, 0, 25);
      return {
        id: `${isoDate}-osce-repeat`,
        date,
        title: 'Repeat one weak station',
        compact: 'Re-run one station cleaner than last time.',
        summary: 'The second pass is usually where your structure starts to settle properly.',
        duration: '25 min',
        badge: 'Repeat',
        tone: 'osce',
        bullets: [
          'Pick the station that felt messy earlier in the week.',
          'Run it again with slower, clearer wording.',
          'Finish with one stronger escalation line.',
        ],
        href: '/osce',
        hrefLabel: 'Repeat a station',
        start,
        end,
      };
    }

    setTimes(19, 0, 20);
    return {
      id: `${isoDate}-hub-flags`,
      date,
      title: 'Red-flag tidy-up',
      compact: 'Use one guide to lock in key escalations.',
      summary: 'When tools are not unlocked, a short red-flag review is still a worthwhile exam-season move.',
      duration: '20 min',
      badge: 'Red flags',
      tone: 'hub',
      bullets: [
        'Open one guide with a strong red-flags section.',
        'Read only the warning signs and recap.',
        'Say who you would escalate to and why.',
      ],
      href: '/hub',
      hrefLabel: 'Read a guide',
      start,
      end,
    };
  }

  if (weekday === 5) {
    if (hasOsce && hasQuiz) {
      setTimes(18, 45, 35);
      return {
        id: `${isoDate}-mixed-check`,
        date,
        title: 'Mixed exam check-in',
        compact: 'Quiz first, then one timed station.',
        summary: 'Use Friday as your exam-style blend: one quick test block and one speaking block.',
        duration: '35 min',
        badge: 'Mixed',
        tone: 'mixed',
        bullets: [
          'Start with 5 to 8 quiz questions.',
          'Run one timed OSCE station straight afterwards.',
          'Write down the single bit you need to fix next week.',
        ],
        href: '/quiz',
        hrefLabel: 'Start with the quiz',
        start,
        end,
      };
    }

    if (hasOsce) {
      setTimes(18, 45, 30);
      return {
        id: `${isoDate}-timed-osce`,
        date,
        title: 'Timed station run',
        compact: 'Use Friday for one full timed attempt.',
        summary: 'A proper timed run at the end of the week gives you a clearer exam-season reality check.',
        duration: '30 min',
        badge: 'Timed',
        tone: 'osce',
        bullets: [
          'Pick one station and keep the timer on.',
          'Stay structured even when you feel rushed.',
          'Review only the bit that broke down under pressure.',
        ],
        href: '/osce',
        hrefLabel: 'Run a timed station',
        start,
        end,
      };
    }

    if (hasQuiz) {
      setTimes(18, 45, 25);
      return {
        id: `${isoDate}-friday-quiz`,
        date,
        title: 'Friday recall check',
        compact: 'Quick questions before the week ends.',
        summary: 'A short Friday set helps you notice what still is not sticking before the weekend.',
        duration: '25 min',
        badge: 'Check',
        tone: 'quiz',
        bullets: [
          'Answer quickly and commit before looking.',
          'Review the explanations on anything shaky.',
          'Save one topic to come back to on Saturday.',
        ],
        href: '/quiz',
        hrefLabel: 'Open the quiz',
        start,
        end,
      };
    }

    setTimes(18, 45, 20);
    return {
      id: `${isoDate}-friday-hub`,
      date,
      title: 'Friday quick review',
      compact: 'End the week with one guide, not ten tabs.',
      summary: 'A short end-of-week review is enough to keep some momentum going.',
      duration: '20 min',
      badge: 'Review',
      tone: 'hub',
      bullets: [
        'Open one saved page or hub route.',
        'Read only the quick framework and recap.',
        'Write down one area to revisit next week.',
      ],
      href: '/hub',
      hrefLabel: 'Open the hub',
      start,
      end,
    };
  }

  if (weekday === 6) {
    setTimes(11, 0, 25);
    return {
      id: `${isoDate}-catch-up`,
      date,
      title: 'Catch-up and tidy',
      compact: 'Use Saturday for whatever slipped in the week.',
      summary: 'This is the flexible session. Keep it small and use it to close the one gap that still feels annoying.',
      duration: '25 min',
      badge: 'Catch-up',
      tone: 'mixed',
      bullets: [
        'Re-open the tool or guide you avoided this week.',
        'Fix one weak topic, one station, or one set of notes.',
        'Stop once the weak bit feels cleaner.',
      ],
      href: hasQuiz ? '/quiz' : hasOsce ? '/osce' : '/hub',
      hrefLabel: hasQuiz ? 'Open Core Quiz' : hasOsce ? 'Open OSCE' : 'Open the hub',
      start,
      end,
    };
  }

  setTimes(17, 30, 15);
  return {
    id: `${isoDate}-reset-plan`,
    date,
    title: 'Reset and plan next week',
    compact: 'A tiny Sunday reset is enough.',
    summary: 'Sunday does not need to be a heavy revision day. Use it to choose next week’s first useful move.',
    duration: '15 min',
    badge: 'Reset',
    tone: 'reset',
    bullets: [
      'Check what you actually got done this week.',
      'Choose the first tool or guide for Monday.',
      'Leave yourself one small target instead of a long list.',
    ],
    href: '/dashboard',
    hrefLabel: 'Use the dashboard',
    start,
    end,
  };
}

function toneStyles(tone: StudyTone) {
  switch (tone) {
    case 'quiz':
      return {
        badge: 'bg-[rgba(241,246,255,0.95)] text-[var(--blue-600)]',
        border: 'border-[rgba(24,95,165,0.18)]',
        marker: 'bg-[var(--blue-600)]',
      };
    case 'osce':
      return {
        badge: 'bg-[rgba(240,249,247,0.95)] text-[var(--teal-600)]',
        border: 'border-[rgba(15,110,86,0.18)]',
        marker: 'bg-[var(--teal-600)]',
      };
    case 'hub':
      return {
        badge: 'bg-[rgba(245,243,240,0.92)] text-[var(--espresso)]',
        border: 'border-[rgba(26,24,21,0.1)]',
        marker: 'bg-[var(--espresso)]',
      };
    case 'mixed':
      return {
        badge: 'bg-[rgba(255,247,237,0.95)] text-[var(--coral-600)]',
        border: 'border-[rgba(153,60,29,0.18)]',
        marker: 'bg-[var(--coral-600)]',
      };
    default:
      return {
        badge: 'bg-[rgba(248,248,246,0.96)] text-[var(--charcoal)]/70',
        border: 'border-[rgba(26,24,21,0.08)]',
        marker: 'bg-[var(--charcoal)]/45',
      };
  }
}

export default function ExamSeasonPlanner({
  hasOsce,
  hasQuiz,
}: {
  hasOsce: boolean;
  hasQuiz: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  const blocks = useMemo(() => {
    const start = startOfWeek(today);
    return Array.from({ length: 7 }, (_, index) => buildBlock(addDays(start, index), hasOsce, hasQuiz));
  }, [hasOsce, hasQuiz, today]);

  const selectedBlock = useMemo(() => {
    if (selectedId) {
      const match = blocks.find((block) => block.id === selectedId);
      if (match) return match;
    }

    return blocks.find((block) => block.date >= today) ?? blocks[0];
  }, [blocks, selectedId, today]);

  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London', []);
  const googleUrl = useMemo(() => buildGoogleUrl(selectedBlock, timeZone), [selectedBlock, timeZone]);

  const nextBlock = useMemo(() => blocks.find((block) => block.date >= today) ?? blocks[0], [blocks, today]);

  const rangeLabel = useMemo(() => formatRange(blocks[0].date, blocks[blocks.length - 1].date), [blocks]);

  const handleDownloadIcs = () => {
    const file = new Blob([buildIcsFile(blocks)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'the-nurse-lab-suggested-revision-week.ics';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(247,243,239,0.96)_100%)]">
      <div className="border-b border-[rgba(26,24,21,0.08)] px-6 py-5 md:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/60">Exam season</p>

            <h3 className="mt-3 font-display text-[1.95rem] leading-[1.02] text-[var(--espresso)]">
              One simple week to borrow from.
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--charcoal)]/78">
              This is just a gentle seven-day sketch. Keep one or two ideas, move them around, or ignore the ones that do not fit. The calendar buttons are only there if they help.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex items-center justify-center gap-2 border border-[rgba(26,24,21,0.12)] bg-white px-4 py-2.5 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.2)]"
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide suggestions' : 'Show suggestions'}
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-4 space-y-1 text-sm text-[var(--charcoal)]/70">
          <p>This week: {rangeLabel}</p>
          <p>Suggested first move: {nextBlock.title}</p>
        </div>
      </div>

      {isOpen && (
        <div className="grid gap-6 px-6 py-6 md:px-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0">
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/60">Suggested week</p>
              <p className="mt-1 text-sm text-[var(--charcoal)]/75">
                Seven small slots. You do not need to use all seven.
              </p>
            </div>

            <div className="border border-[rgba(26,24,21,0.08)] bg-white/86 p-3 md:p-4">
              <div className="space-y-3">
                {blocks.map((block) => {
                  const styles = toneStyles(block.tone);
                  const isSelected = block.id === selectedBlock.id;
                  const isToday = sameDay(block.date, today);

                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setSelectedId(block.id)}
                      className={`group w-full border px-4 py-4 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[rgba(26,24,21,0.22)] bg-[rgba(255,255,255,0.98)]'
                          : `${styles.border} bg-[rgba(250,250,248,0.82)] hover:border-[rgba(26,24,21,0.15)] hover:bg-white`
                      }`}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="min-w-[64px] border border-[rgba(26,24,21,0.08)] bg-white px-3 py-2 text-center">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/55">
                              {formatShortDay(block.date)}
                            </p>
                            <p className="mt-1 font-display text-[1.35rem] leading-none text-[var(--espresso)]">
                              {block.date.getDate()}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${styles.badge}`}>
                                {block.badge}
                              </span>
                              {isToday && (
                                <span className="inline-flex items-center bg-[rgba(255,247,237,0.92)] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--coral-600)]">
                                  Today
                                </span>
                              )}
                            </div>

                            <p className="mt-2 font-display text-[1.1rem] leading-[1.04] text-[var(--espresso)]">
                              {block.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-[var(--charcoal)]/72">{block.compact}</p>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]/55">
                            Suggested time
                          </p>
                          <p className="mt-1 text-sm text-[var(--espresso)]">{block.duration}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(180deg,rgba(249,244,236,0.78)_0%,rgba(255,255,255,0.98)_100%)] px-5 py-5 lg:sticky lg:top-24">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/60">Selected idea</p>
            <h4 className="mt-2 font-display text-[1.9rem] leading-[1.02] text-[var(--espresso)]">
              {selectedBlock.title}
            </h4>
            <p className="mt-3 text-sm leading-7 text-[var(--charcoal)]/78">
              {formatDayLabel(selectedBlock.date)} · {selectedBlock.duration}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]/72">
              Shift this around if you need to. It is a useful default, not a fixed booking.
            </p>

            <div className="mt-5 border border-[rgba(26,24,21,0.08)] bg-white/86 px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/60">What to do</p>
              <p className="mt-2 text-sm leading-7 text-[var(--charcoal)]/78">{selectedBlock.summary}</p>

              <ul className="mt-4 space-y-3">
                {selectedBlock.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm leading-7 text-[var(--charcoal)]/78">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--espresso)]/50" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={selectedBlock.href}
                className="inline-flex items-center justify-center bg-[var(--espresso)] px-5 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]"
              >
                {selectedBlock.hrefLabel}
              </Link>

              <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-[rgba(26,24,21,0.12)] bg-white px-5 py-3 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.2)]"
              >
                Add this to Google Calendar
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex items-center justify-center border border-[rgba(26,24,21,0.12)] bg-white px-5 py-3 text-sm text-[var(--espresso)] transition-colors hover:border-[rgba(26,24,21,0.2)]"
              >
                Download week for iCal
              </button>
            </div>

            <p className="mt-4 text-xs leading-6 text-[var(--charcoal)]/60">
              Google adds the selected day only. The iCal file gives you the same week as a starting point to edit in your own calendar.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
