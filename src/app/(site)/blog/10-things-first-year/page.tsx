import Link from 'next/link';
import BlogArticle from '@/components/BlogArticle';
import { getBlogPost } from '@/lib/blog';
import { getArticleSchema } from '@/lib/seo';

const post = getBlogPost('10-things-first-year')!;

const articleSchema = getArticleSchema({
  headline: post.title,
  description: post.excerpt,
  path: post.href,
  datePublished: post.date,
  dateModified: post.date,
  keywords: [
    'first year nursing student',
    'student nurse advice',
    'nursing practice hours',
    'first placement',
    'UK nursing student',
  ],
});

export default function TenThingsFirstYearPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <BlogArticle
        post={post}
        titleNode={<>10 Things You Should Know as a <em>First Year</em></>}
        standfirst="Nobody sits you down in week one and tells you which parts of first year actually matter later. These are the ten I'd go back and tell myself — starting with the one that costs you the most if you get it wrong."
      >
        <p>
          First year is strange. It is the year with the least pressure on paper and the
          most confusion in practice: new city, new cohort, a uniform that does not fit
          properly, and a timetable that seems to change every fortnight. It is also the
          year where a few small habits quietly decide how hard second and third year are
          going to be.
        </p>
        <p>
          None of this is about being the best student on the ward. It is about the boring
          structural things that are easy to sort in September and horrible to fix in May.
        </p>

        <h2>
          <span className="bp-num c-purple">One</span>
          Attend everything. Get as many hours as you can.
        </h2>
        <p>
          This is the one. If you take nothing else from this post, take this.
        </p>

        <p className="bp-pull">
          Attend everything. Get as many hours as you can.
        </p>

        <p>
          A UK pre-registration nursing programme is built around a fixed number of hours —
          broadly 2,300 hours of practice learning and 2,300 hours of theory across the
          three years. Those are not a target you aim at. They are a requirement you have
          to evidence before you can register. Hours are counted, signed for, and audited.
        </p>
        <p>
          Which means every shift you miss has to come back from somewhere. And there is
          nowhere for it to come back from except your annual leave, your reading weeks,
          or your third year — the year you least want to be making up hours in. I have
          watched people lose an entire summer to a handful of days they skipped in
          November because they were tired and it was raining and it felt like one shift
          could not possibly matter.
        </p>
        <p>
          So: go in. Go in on the days you do not feel like it. Say yes to the extra long
          day if someone offers it and you are physically able. Say yes to the theatre
          list, the clinic, the community visit, the night shift you are nervous about. If
          the ward is quiet and another team will take you for a day, go. Get your hours
          banked early and get them signed off <strong>on the day</strong>, not from memory
          three weeks later.
        </p>
        <p>
          Being ahead on hours is the single biggest bit of breathing room you can give
          future you. Being behind on hours is the thing that ends people&rsquo;s courses.
        </p>

        <div className="bp-note">
          <p className="bp-note-label">The one exception</p>
          <p>
            Getting hours is not the same as working while ill. If you are genuinely unwell,
            you do not go onto a ward and take it to patients — you report sick properly,
            through both the placement and the university, and you make the time up. What
            you are avoiding is the quiet, unreported drift of days.
          </p>
        </div>

        <h2>
          <span className="bp-num c-coral">Two</span>
          Your practice document is not a last-week job.
        </h2>
        <p>
          Whatever your university calls it — PAD, MyPAD, PARE, e-portfolio — it is the
          document that proves you can do the job. It is also the thing students most
          reliably leave until the final fortnight of a placement, at which point their
          practice assessor is on nights, on leave, or has simply not seen them do the
          thing they need signing.
        </p>
        <p>
          Read it in week one. Highlight the proficiencies you need this placement. Then
          actively hunt for the opportunities rather than waiting for them to appear.
          &ldquo;I need to be observed doing a set of manual obs and a fluid balance chart
          this week — can I do the next one with you?&rsquo;&rsquo; is a completely normal
          sentence to say out loud.
        </p>

        <h2>
          <span className="bp-num c-blue">Three</span>
          You are supernumerary. Use it.
        </h2>
        <p>
          Supernumerary means you are additional to the staffing numbers — you are there to
          learn, not to be counted as a pair of hands. In practice, a busy ward will absorb
          you into the work if you let it, and there is a real skill in being useful without
          becoming free labour for six weeks of bed-making.
        </p>
        <p>
          Ask for the why. Why that antibiotic, why that catheter, why we escalated that
          NEWS2 score at 5 and not 6. Follow one patient properly rather than doing a
          little of everything for twelve. The students who get the most out of placement
          are not the ones who do the most tasks — they are the ones who ask the most
          questions.
        </p>

        <h2>
          <span className="bp-num c-teal">Four</span>
          Drug calculations start now and never stop.
        </h2>
        <p>
          Nobody fails drug calculations because the maths is hard. They fail because they
          have not touched it since the last exam, and the exam is usually pass-at-a-high-
          threshold, and there is a re-sit limit. Ten minutes a week from first year beats
          three panicked days before the paper, every single time.
        </p>
        <p>
          Get comfortable with the same four shapes over and over: tablets and capsules,
          liquid doses, IV infusion rates, and dosage by body weight. Then keep them warm.
          Our <Link href="/quiz">core quiz</Link> and the{' '}
          <Link href="/hub/resources/drug-calculations-cheat-sheet">
            drug calculations cheat sheet
          </Link>{' '}
          in the hub exist for exactly this.
        </p>

        <h2>
          <span className="bp-num c-amber">Five</span>
          Learn to write in the notes properly.
        </h2>
        <p>
          Documentation feels like admin in first year and turns out to be one of the most
          professionally serious things you do. Notes are a legal record. They are read
          back in complaints, coroners&rsquo; inquests and NMC referrals, sometimes years
          later.
        </p>
        <p>
          Learn the basics early: write contemporaneously, date and time everything, sign
          with your name and status, record what you observed rather than what you assumed,
          never document care you did not personally give, and never leave gaps for someone
          to fill in later. Get a registrant to countersign as your university requires.
        </p>

        <h2>
          <span className="bp-num c-sage">Six</span>
          Reference from week one.
        </h2>
        <p>
          Referencing marks are the cheapest marks on the whole degree and first years throw
          them away constantly. Pick up your university&rsquo;s referencing guide —
          usually a house version of Harvard or APA — and use it from the very first
          formative piece, when it does not count and the stakes are zero.
        </p>
        <p>
          Keep a running document of every source as you read it, with the page number.
          Rebuilding a reference list at 1am from a browser history is a specific kind of
          misery you only need to experience once.
        </p>

        <h2>
          <span className="bp-num c-purple">Seven</span>
          Sort the boring placement admin early.
        </h2>
        <p>
          The practical stuff eats far more energy than it should if you leave it late:
          your off-duty, travel routes for a 7am start, parking, uniform and spare uniform,
          ID badge, occupational health clearance, DBS, and how you are going to eat on a
          twelve-and-a-half hour shift.
        </p>
        <p>
          Also claim what you are entitled to. In England that is the NHS Learning Support
          Fund, which covers a training grant plus travel and dual-accommodation expenses
          for placement; Scotland, Wales and Northern Ireland run their own separate
          schemes. Whichever nation you are in, find out what you can claim, keep the
          receipts, and claim within the deadline — students routinely lose hundreds of
          pounds simply by not filling the form in.
        </p>

        <h2>
          <span className="bp-num c-coral">Eight</span>
          You will see things that stay with you.
        </h2>
        <p>
          At some point in first year — usually earlier than you expect — you will be
          present for a death, an aggressive patient, a distressed family, or a piece of
          care that you cannot stop replaying on the bus home. That is not a sign you are
          not cut out for this. It is a sign you are paying attention.
        </p>
        <p>
          Know your routes before you need them: your practice supervisor and practice
          assessor on the ward, your academic assessor or personal tutor at university,
          student support and counselling services, and the ward&rsquo;s own debrief after
          a significant event. Ask for the debrief if nobody offers one. Do not build the
          habit of carrying it silently, because the habit is what burns people out in year
          three.
        </p>

        <h2>
          <span className="bp-num c-blue">Nine</span>
          Look after the body doing the shifts.
        </h2>
        <p>
          Good shoes. Compression socks if you are on your feet for thirteen hours. Food
          you have actually prepped, because the canteen is shut at 3am and the vending
          machine is not a meal plan. Water. Sleep protected around night shifts rather
          than fitted in around everything else.
        </p>
        <p>
          This sounds like the softest item on the list and it is the one that decides
          whether you can sustain the other nine. I wrote about how I managed this during a
          heavy haematology and oncology placement{' '}
          <Link href="/blog/wellness-during-placement">here</Link>.
        </p>

        <h2>
          <span className="bp-num c-teal">Ten</span>
          Measure yourself against last month, not against your cohort.
        </h2>
        <p>
          There is always someone in the group chat who has already done a cannulation, or
          who talks about their placement like they are running the ward. Some of it is
          real and some of it is performance, and either way it tells you nothing useful
          about your own progress.
        </p>
        <p>
          The honest comparison is you in September versus you in January. Can you do a
          full set of obs without checking the order? Can you hand over a patient in three
          sentences? Can you walk into a bay and know who you are most worried about? That
          is the progress that counts, and it is invisible if you spend the year looking
          sideways.
        </p>
        <p>
          And ask for help early — the week you notice you are struggling, not the week
          before the deadline. Every single person marking your work would rather have that
          conversation in October than write an extenuating circumstances form in May.
        </p>

        <h2>If you only do one thing</h2>
        <p>
          Go in. Get the hours. Get them signed. Everything else on this list is easier to
          fix later — attendance is the only one that quietly compounds until it becomes
          the whole problem.
        </p>
      </BlogArticle>
    </>
  );
}
