import Link from 'next/link';
import BlogArticle from '@/components/BlogArticle';
import { getBlogPost } from '@/lib/blog';
import { getArticleSchema } from '@/lib/seo';

const post = getBlogPost('wellness-during-placement')!;

const articleSchema = getArticleSchema({
  headline: post.title,
  description: post.excerpt,
  path: post.href,
  datePublished: post.date,
  dateModified: post.date,
  keywords: [
    'nursing placement wellbeing',
    'student nurse meal prep',
    'placement burnout',
    'haematology oncology placement',
  ],
});

export default function WellnessDuringPlacementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <BlogArticle
        post={post}
        titleNode={<>Wellness During My <em>Haem/Onc</em> Placement</>}
        standfirst="Starting my first placement on a haematology and oncology ward was not what I expected. Here is how meal prep and ten-minute walks kept me going through the hardest weeks of it."
      >
        <p>
          I was excited to get hands-on experience, but I quickly realised just how
          emotionally and physically exhausting it could be. Some days I would come home
          and feel completely drained, barely able to lift a finger — and on top of all
          that, I was trying to keep up with my own health.
        </p>
        <p>
          Eventually I realised that to keep going, I needed to take care of myself first.
          So I started meal prepping and finding ways to sneak in a bit of exercise between
          shifts. It was not easy, but those small habits made a world of difference.
        </p>

        <h2>The emotional toll of a haem/onc placement</h2>
        <p>
          Working with patients facing serious illness is not just physically demanding —
          it is mentally draining too. Some days I would leave feeling like I did not have
          anything left to give. The emotional weight of caring for seriously ill patients,
          often in their final days, made every shift feel like a marathon.
        </p>
        <p>
          After a few weeks I realised I had to prioritise my own wellbeing if I wanted to
          be effective in the role. Looking after my own health let me keep showing up for
          patients, both mentally and physically. Setting boundaries, taking breaks when I
          needed them, and focusing on recovery meant I could give better care without
          feeling depleted by the end of the day.
        </p>

        <h2>Meal prep: the secret to eating well when you are busy</h2>
        <p>
          Between shifts and emotionally intense days, there was not a lot of time for
          cooking. I would grab quick, unhealthy snacks or eat on the go, which left me
          sluggish and unsatisfied. So I turned to meal prep — a few hours on a day off to
          batch-cook, so I never had to scramble for something nutritious in the gap
          between work and exhaustion.
        </p>
        <p>
          It was not gourmet, but it was healthy and easy to grab during the week. Big
          portions of vegetable-heavy stir-fries, overnight oats for breakfast, pasta
          loaded with greens. Easy to prepare, genuinely nourishing, and it made me feel
          like I was taking care of myself despite the demands of placement. Meal prep does
          not have to be time-consuming or complicated — it just has to be intentional.
        </p>

        <h2>Exercise: even ten minutes makes a difference</h2>
        <p>
          Honestly, after a long shift the last thing I wanted to do was exercise. But I
          learned that even a short burst of movement — a ten-minute walk, a quick stretch
          — could work wonders. It released the physical tension from hours of standing and
          kept me mentally sharper.
        </p>
        <p>
          It did not have to be an hour-long workout. Five minutes of stretching in the
          morning, or a short walk on my break. On the hardest days, those ten minutes made
          all the difference. Small doses of movement lift your energy, improve your mood,
          and hold burnout off a bit longer.
        </p>

        <h2>Mental health: it is okay to step back</h2>
        <p>
          One of the hardest lessons was giving myself grace. There were days I felt
          completely overwhelmed and did not have the energy to keep going, and that is
          okay. I made time for the things that grounded me: journalling, talking to
          friends, and being honest about my limits.
        </p>
        <p>
          Practising self-compassion helped me navigate the emotional weight of that
          placement. You cannot pour from an empty cup, and taking time to recharge is not
          a luxury — it is part of the job.
        </p>

        <h2>What I would tell a first year</h2>
        <p>
          Haem/onc was one of the most rewarding and most challenging experiences I have
          had. It pushed me physically and emotionally, but the small things — prepped
          food, short walks, actual boundaries — kept me balanced. If you are heading into
          something similar, the habits do not need to be impressive. They just need to be
          yours, and repeatable.
        </p>
        <p>
          There is more of this in{' '}
          <Link href="/blog/10-things-first-year">10 things you should know as a first year</Link>,
          and in the{' '}
          <Link href="/hub/resources/placement-survival">placement survival guide</Link> in
          the hub.
        </p>
      </BlogArticle>
    </>
  );
}
