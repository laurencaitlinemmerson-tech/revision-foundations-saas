'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import PremiumHubPageGate from '@/components/PremiumHubPageGate';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

const quizQuestions = [
  { question: 'What angle is used for an IM injection?', options: ['15°', '45°', '90°', '30°'], answer: 2 },
  { question: 'What is the first-choice IM injection site for infants under 2?', options: ['Deltoid', 'Dorsogluteal', 'Vastus lateralis', 'Ventrogluteal'], answer: 2 },
  { question: 'For a subcutaneous injection, should you pinch or spread the skin?', options: ['Spread the skin taut', 'Pinch a fold of skin', 'Neither — just insert', 'It depends on the drug'], answer: 1 },
  { question: 'Why is the dorsogluteal site avoided in children?', options: ['It is too painful', 'Risk of sciatic nerve injury', 'The muscle is too large', 'It takes too long to find'], answer: 1 },
  { question: 'What is the usual SC injection angle?', options: ['90°', '15°', '45°', '60°'], answer: 2 },
  { question: 'Why should you change the needle after drawing up the medication?', options: ['To save time', 'The drawing-up needle gets blunter and causes more pain', 'It helps sterilise the drug', 'Hospital policy requires it'], answer: 1 },
  { question: 'What should you do immediately after removing the needle?', options: ['Resheath it carefully', 'Wipe the site vigorously', 'Dispose of it in the sharps bin without resheathing', 'Leave it on the tray for later'], answer: 2 },
  { question: 'What causes lipohypertrophy?', options: ['Using the wrong needle size', 'Repeated injections in the same spot', 'Injecting too quickly', 'Not rotating the syringe'], answer: 1 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.inj *, .inj *::before, .inj *::after { box-sizing: border-box; box-shadow: none !important; }

.inj {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.inj-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.inj-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #706A63;
  text-decoration: none;
  margin-bottom: 44px;
}
.inj-back:hover { color: #555; }

/* Masthead */
.inj-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #706A63;
  margin-bottom: 14px;
}

.inj-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.inj-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.inj-byline {
  font-size: 10px;
  color: #706A63;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Section headings */
.inj-h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  color: #1A1815;
  margin: 0 0 20px;
  padding-top: 28px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
}

.inj-h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  margin: 32px 0 14px;
}

/* Body text */
.inj-p {
  font-size: 15px;
  color: #3D3A36;
  line-height: 1.72;
  margin: 0 0 16px;
  font-weight: 300;
}

/* Two-column comparison */
.inj-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 32px;
  border-radius: 0;
}

.inj-compare-col {
  padding: 22px 24px 26px;
}
.inj-compare-col:first-child {
  border-right: 0.5px solid rgba(0,0,0,0.12);
}

.inj-compare-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #706A63;
  margin-bottom: 14px;
  font-weight: 400;
}

/* Lists */
.inj-ul {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
}

.inj-ul li {
  font-size: 14px;
  color: #3D3A36;
  line-height: 1.65;
  padding: 4px 0 4px 16px;
  position: relative;
  font-weight: 300;
}

.inj-ul li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #C4C0B9;
}

/* Tables */
.inj-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 32px;
  font-size: 13px;
  border: 0.5px solid rgba(0,0,0,0.12);
  border-radius: 0;
}

.inj-table th {
  background: #F3F1EE;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 400;
  color: #706A63;
  text-align: left;
  padding: 12px 16px;
  border-bottom: 0.5px solid rgba(0,0,0,0.12);
}

.inj-table td {
  padding: 11px 16px;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
  color: #3D3A36;
  font-weight: 300;
  line-height: 1.5;
}

.inj-table tr:last-child td { border-bottom: none; }

/* Callouts */
.inj-pearl {
  background: #F3F1EE;
  border-left: 3px solid #C4C0B9;
  padding: 18px 22px;
  margin: 24px 0 28px;
  border-radius: 0;
}

.inj-pearl-title {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: #1A1815;
  margin-bottom: 8px;
}

.inj-pearl p {
  font-size: 13px;
  color: #5A5750;
  line-height: 1.65;
  margin: 0;
  font-weight: 300;
}

.inj-warn {
  background: #FFF8F6;
  border-left: 3px solid #C2705A;
  padding: 18px 22px;
  margin: 24px 0 28px;
  border-radius: 0;
}

.inj-warn-title {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 500;
  color: #8B3A2A;
  margin-bottom: 8px;
}

.inj-warn p {
  font-size: 13px;
  color: #7A4A3D;
  line-height: 1.65;
  margin: 0;
  font-weight: 300;
}

.inj-info {
  background: #F4F8FB;
  border-left: 3px solid #7BA3C4;
  padding: 18px 22px;
  margin: 24px 0 28px;
  border-radius: 0;
}

.inj-info p {
  font-size: 13px;
  color: #3D5A73;
  line-height: 1.65;
  margin: 0;
  font-weight: 300;
}

/* Numbered steps */
.inj-steps {
  counter-reset: step;
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
}

.inj-steps li {
  counter-increment: step;
  display: flex;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
  font-size: 14px;
  color: #3D3A36;
  line-height: 1.6;
  font-weight: 300;
}

.inj-steps li::before {
  content: counter(step);
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 22px;
  color: #C4C0B9;
  min-width: 28px;
  line-height: 1;
  padding-top: 2px;
}

/* OSCE tips grid */
.inj-osce-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 20px 0 32px;
}

.inj-osce-card {
  background: #F3F1EE;
  padding: 18px 20px;
  border-radius: 0;
}

.inj-osce-card strong {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-weight: 500;
  color: #1A1815;
  display: block;
  margin-bottom: 6px;
}

.inj-osce-card p {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
}

/* Mobile */
@media (max-width: 768px) {
  .inj-wrap { padding: 24px 20px 80px; }
  .inj-headline { font-size: 36px; }
  .inj-compare { grid-template-columns: 1fr; }
  .inj-compare-col:first-child { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .inj-osce-grid { grid-template-columns: 1fr; }
  .inj-table { font-size: 12px; }
  .inj-table th, .inj-table td { padding: 9px 12px; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function IMSCInjectionPage() {
  return (
    <PremiumHubPageGate resourceTitle="IM & SC Injections">
      <div className="inj">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div className="inj-wrap">
        {/* Back */}
        <Link href="/hub" className="inj-back">
          <span>←</span> Hub
        </Link>

        {/* Masthead */}
        <p className="inj-kicker">Clinical Skills · Children&apos;s Nursing</p>
        <h1 className="inj-headline">IM &amp; SC Injections</h1>
        <p className="inj-standfirst">
          A practical guide to IM and SC injections in children, with the details students usually wish someone had explained more plainly.
        </p>
        <p className="inj-byline">The Nurse Lab · Children&apos;s Hub</p>
        <EditorialSaveButton
          hubItemId="im-sc-injection"
          hubItemTitle="IM & SC Injections"
        />

        {/* ── Overview ── */}
        <div className="inj-info">
          <p>
            Student note: IM means into the muscle. SC means into the fatty layer under the skin. These are common placement and OSCE skills, and the big things to get right are the site, the angle, the needle length, and how you explain the procedure to the child and family.
          </p>
        </div>

        {/* ── IM vs SC at a glance ── */}
        <h2 className="inj-h2">IM vs SC at a glance</h2>

        <div className="inj-compare">
          <div className="inj-compare-col">
            <p className="inj-compare-label">Intramuscular (IM)</p>
            <ul className="inj-ul">
              <li>Into a muscle</li>
              <li>90° angle to skin</li>
              <li>Usually absorbed faster than SC</li>
              <li>Can take larger volumes than SC (up to 1ml in infants, 2ml in children)</li>
              <li>Common drugs: vaccines, antibiotics, adrenaline</li>
            </ul>
          </div>
          <div className="inj-compare-col">
            <p className="inj-compare-label">Subcutaneous (SC)</p>
            <ul className="inj-ul">
              <li>Into the fatty layer under the skin</li>
              <li>45° angle (or 90° with short needle)</li>
              <li>Usually absorbed more slowly and steadily</li>
              <li>Smaller volumes (up to 1ml usually)</li>
              <li>Common drugs: insulin, heparin, some vaccines</li>
            </ul>
          </div>
        </div>

        <div className="inj-pearl">
          <p className="inj-pearl-title">Quick way to remember</p>
          <p>
            IM = into <strong>M</strong>uscle = 90°. SC = <strong>S</strong>hallow = 45°. The angle matches the depth you&apos;re aiming for. If you can remember that, you&apos;re halfway there.
          </p>
        </div>

        {/* ── IM Site Selection ── */}
        <h2 className="inj-h2">IM site selection</h2>
        <p className="inj-p">
          In children, site choice depends on age and muscle development. You cannot just default to the deltoid like you might in adults, because babies and smaller children may not have enough muscle there yet.
        </p>

        <table className="inj-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>When to use</th>
              <th>Key points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Vastus lateralis</strong></td>
              <td>First choice for infants &amp; under 2s</td>
              <td>The outer thigh muscle. Big, easy to find, and well-developed even in small babies.</td>
            </tr>
            <tr>
              <td><strong>Deltoid</strong></td>
              <td>Children over 2 (if muscle bulk is adequate)</td>
              <td>Upper arm muscle, about two finger-widths below the top of the shoulder. Good for older children and vaccines, but it is a smaller site so the volume stays smaller too.</td>
            </tr>
            <tr>
              <td><strong>Ventrogluteal</strong></td>
              <td>Over 7 months (when walking develops muscle)</td>
              <td>The side-of-hip site. It is increasingly preferred because there are fewer major nerves and blood vessels than in the old buttock site.</td>
            </tr>
          </tbody>
        </table>

        <div className="inj-warn">
          <p className="inj-warn-title">Avoid the dorsogluteal site</p>
          <p>
            The traditional upper outer buttock site, called dorsogluteal, is used less now because of the risk of sciatic nerve injury. Many trusts and the RCN prefer the ventrogluteal site instead. It is worth knowing both names, but always follow local policy.
          </p>
        </div>

        {/* ── Needle Selection ── */}
        <h2 className="inj-h2">Needle selection</h2>
        <p className="inj-p">
          This is where people often get stuck. For IM, the needle has to be long enough to reach muscle, but not so long that it goes too deep. In children, there is less room for error than in adults, which is why age, size, and site all matter.
        </p>

        <table className="inj-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>IM needle</th>
              <th>SC needle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Preterm / very small neonate</td>
              <td>16mm (25G)</td>
              <td>16mm (25G) at 45°</td>
            </tr>
            <tr>
              <td>Term neonate – 2 months</td>
              <td>16mm (25G)</td>
              <td>16mm (25G) at 45°</td>
            </tr>
            <tr>
              <td>2 months – 1 year</td>
              <td>25mm (23G or 25G)</td>
              <td>16mm (25G) at 45°</td>
            </tr>
            <tr>
              <td>1 – 5 years</td>
              <td>25mm (23G)</td>
              <td>16mm (25G) at 45°</td>
            </tr>
            <tr>
              <td>6 – 12 years</td>
              <td>25mm (23G)</td>
              <td>16mm (25G) at 45°</td>
            </tr>
            <tr>
              <td>Over 12 / adolescent</td>
              <td>25–38mm (21G or 23G)</td>
              <td>16mm (25G) at 45°</td>
            </tr>
          </tbody>
        </table>

        <div className="inj-pearl">
          <p className="inj-pearl-title">Drawing up vs injecting</p>
          <p>
            You usually draw the medication up with a wider needle, then swap to the finer injection needle before giving it. If you draw up with the same needle you inject with, it gets blunter and the injection is more painful.
          </p>
        </div>

        {/* ── IM Technique ── */}
        <h2 className="inj-h2">IM technique step-by-step</h2>
        <ol className="inj-steps">
          <li>Check the prescription — right patient, drug, dose, route, time. Get a second checker if needed.</li>
          <li>Gather equipment — correct syringe, drawing-up needle, injection needle, alcohol swab (check local policy), sharps bin.</li>
          <li>Draw up the medication using the larger gauge needle. Tap out air bubbles, swap to the injection needle.</li>
          <li>Position the child and identify your site. For vastus lateralis: middle third of the outer thigh.</li>
          <li>Clean the site if local policy says to. Some vaccine guidance says skin cleaning is not always needed, so check your trust approach.</li>
          <li>Spread the skin taut. For some IM injections you may use the Z-track method, which means pulling the skin slightly to one side before injecting, then releasing it afterwards.</li>
          <li>Insert the needle at 90° in one smooth motion. Don&apos;t jab — but don&apos;t go slowly either.</li>
          <li>You do not usually pull back to check for blood first, because routine aspiration is no longer recommended for most IM injections. Some local policies may still advise it for the dorsogluteal site.</li>
          <li>Inject slowly and steadily — about 1ml per 10 seconds.</li>
          <li>Withdraw the needle, apply gentle pressure with gauze. Don&apos;t rub the site.</li>
          <li>Dispose of the needle straight into the sharps bin — do not resheath.</li>
          <li>Document: drug, dose, route, site, time, batch number (for vaccines), any reactions.</li>
        </ol>

        {/* ── SC Technique ── */}
        <h2 className="inj-h2">SC technique</h2>
        <p className="inj-p">
          SC injections go into the fatty layer just under the skin. They can feel simpler than IM, but the angle still matters. Too shallow and you stay in the skin itself. Too deep and you can accidentally go into muscle.
        </p>

        <h3 className="inj-h3">Common SC sites</h3>
        <ul className="inj-ul">
          <li>Outer upper arm (over the triceps area)</li>
          <li>Anterior thigh</li>
          <li>Abdomen, avoiding 5cm around the umbilicus or belly button, mainly for insulin in older children</li>
        </ul>

        <h3 className="inj-h3">Technique</h3>
        <ol className="inj-steps">
          <li>Prepare as for IM — check prescription, draw up, change needle.</li>
          <li>Pinch a fold of skin between your thumb and index finger. You want to lift the subcutaneous tissue away from the muscle.</li>
          <li>Insert the needle at 45° into the skin fold (or 90° if using a short 8mm insulin needle).</li>
          <li>Do not aspirate — not needed for SC injections.</li>
          <li>Inject slowly, withdraw, release the skin fold, apply gentle pressure.</li>
          <li>Document as above.</li>
        </ol>

        <div className="inj-pearl">
          <p className="inj-pearl-title">Pinch vs spread</p>
          <p>
            SC = <strong>pinch</strong> the skin (lifts fatty tissue). IM = <strong>spread</strong> the skin taut (flattens tissue so needle reaches muscle). Getting these mixed up is a classic OSCE mistake.
          </p>
        </div>

        {/* ── Site rotation ── */}
        <h2 className="inj-h2">Site rotation</h2>
        <p className="inj-p">
          For children who have regular injections such as insulin, growth hormone, or enoxaparin, rotating sites is really important. Repeated injections in the same spot can cause lipohypertrophy, which means hard lumpy areas under the skin that affect absorption.
        </p>
        <ul className="inj-ul">
          <li>Rotate between different body areas (e.g. left arm → right arm → left thigh → right thigh)</li>
          <li>Within each area, move at least 2.5cm from the last injection site</li>
          <li>Keep a rotation chart — especially for kids on insulin. Parents should be involved in tracking this</li>
          <li>If you feel a lump at the site, avoid that area until it resolves</li>
        </ul>

        {/* ── Red flags ── */}
        <h2 className="inj-h2">Red flags &amp; complications</h2>

        <div className="inj-warn">
          <p className="inj-warn-title">Stop and escalate if you see</p>
          <p>
            Signs of anaphylaxis such as wheeze, swelling, rash, or low blood pressure. Severe pain or numbness spreading down the limb, which could suggest nerve injury. Significant bleeding or a haematoma. Signs of infection at the site within 24 to 48 hours, such as redness, warmth, swelling, or pus. Any sign that the drug has leaked into surrounding tissue or that the skin is breaking down.
          </p>
        </div>

        <table className="inj-table">
          <thead>
            <tr>
              <th>Complication</th>
              <th>Why it happens</th>
              <th>How to avoid it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sciatic nerve injury</td>
              <td>Dorsogluteal injection in small children</td>
              <td>Use vastus lateralis or ventrogluteal instead</td>
            </tr>
            <tr>
              <td>Lipohypertrophy</td>
              <td>Repeated SC injections in same spot</td>
              <td>Rotate sites systematically</td>
            </tr>
            <tr>
              <td>Abscess / infection</td>
              <td>Poor aseptic technique</td>
              <td>Clean technique, check local ANTT policy</td>
            </tr>
            <tr>
              <td>Needle too short (IM)</td>
              <td>Drug deposits in SC tissue instead of muscle</td>
              <td>Choose needle length based on age &amp; site</td>
            </tr>
            <tr>
              <td>Pain &amp; bruising</td>
              <td>Injecting too fast, wrong angle, or blunt needle</td>
              <td>Inject slowly, change needle after drawing up, correct angle</td>
            </tr>
          </tbody>
        </table>

        {/* ── Pain minimisation ── */}
        <h2 className="inj-h2">Pain minimisation in children</h2>
        <p className="inj-p">
          This matters a lot on placement. Children remember painful procedures, and how the team handles them affects trust the next time round. Examiners also like asking about this because it shows whether you are thinking about the child&apos;s experience as well as the task.
        </p>
        <ul className="inj-ul">
          <li>Topical anaesthetic cream (e.g. EMLA or Ametop) — apply 30–60 mins before if planned. Doesn&apos;t work for all injection types but always worth considering</li>
          <li>Distraction — bubbles, counting, phone/tablet, conversation. Tailor to the child&apos;s age and interests</li>
          <li>Comfort positioning — let them sit on a parent&apos;s lap if possible, not pinned to the bed</li>
          <li>Breastfeeding during injection (for infants) — evidence-based pain reduction</li>
          <li>Sucrose solution (24%) — for neonates, 2 mins before the procedure</li>
          <li>Cold spray (ethyl chloride) — numbs for a few seconds, good for quick injections</li>
          <li>Don&apos;t say &quot;it won&apos;t hurt&quot; — be honest. &quot;You might feel a sharp scratch&quot; is better than lying</li>
          <li>Inject the most painful drug last if giving multiple injections</li>
        </ul>

        <div className="inj-pearl">
          <p className="inj-pearl-title">From placement</p>
          <p>
            Good distraction genuinely changes the experience. Children who are distressed before the needle even appears can settle dramatically when a play specialist, parent, or nurse gives them something meaningful to focus on. If a play team is available, involve them. It is not a bonus extra. It is part of good paediatric care.
          </p>
        </div>

        {/* ── OSCE Tips ── */}
        <h2 className="inj-h2">OSCE tips</h2>
        <p className="inj-p">
          Injection stations come up a lot. Examiners are usually looking for more than whether you know where the needle goes. They want to hear your safety checks, your reasoning, and how you would keep the child as comfortable as possible.
        </p>

        <div className="inj-osce-grid">
          <div className="inj-osce-card">
            <strong>Consent &amp; explanation</strong>
            <p>Explain the procedure in age-appropriate language. For young children, talk to the parent. For older kids, address them directly. Get verbal consent.</p>
          </div>
          <div className="inj-osce-card">
            <strong>Site selection reasoning</strong>
            <p>Don&apos;t just say &quot;I&apos;ll use the thigh.&quot; Say <em>why</em> — &quot;vastus lateralis is the recommended site for infants because the muscle is well-developed and there&apos;s lower risk of nerve injury.&quot;</p>
          </div>
          <div className="inj-osce-card">
            <strong>Sharps safety</strong>
            <p>Dispose immediately into the sharps bin. Never resheath. Never walk across the room holding a used needle. Examiners watch for this closely.</p>
          </div>
          <div className="inj-osce-card">
            <strong>Pain management</strong>
            <p>Mention at least one pain minimisation technique unprompted. Distraction, topical anaesthetic, comfort positioning — show you&apos;ve thought about the child&apos;s experience, not just the procedure.</p>
          </div>
          <div className="inj-osce-card">
            <strong>Z-track technique</strong>
            <p>If they ask you to demonstrate it, pull the skin slightly to one side before inserting at 90°, keep hold while you inject, then release. This helps stop the medication leaking back into the tissue under the skin.</p>
          </div>
          <div className="inj-osce-card">
            <strong>Documentation</strong>
            <p>Finish by stating what you&apos;d document: drug, dose, route, site used, time, batch number, any adverse reactions, who administered and who checked.</p>
          </div>
        </div>

        <div className="inj-info">
          <p>
            <strong>Top tip:</strong> practise on the injection simulation arms or legs in the skills lab before your OSCE. Injection technique makes much more sense once you have done the hand movements yourself, not just read about them. If you can, ask to observe or assist with vaccinations on placement because that is one of the quickest ways to build confidence.
          </p>
        </div>

        {/* ── Footer nav ── */}
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)', marginTop: '48px', paddingTop: '32px' }}>
          <Link href="/hub" className="inj-back">
            <span>←</span> Back to Hub
          </Link>
        </div>

        <SelfTestQuiz title="Test Yourself: IM & SC Injections" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'BNFC', title: 'British National Formulary for Children — administration routes', href: 'https://bnf.nice.org.uk/' },
          { citation: 'RCN (2022)', title: 'Standards for infusion therapy', href: 'https://www.rcn.org.uk/' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'NHS England', title: 'Medicines administration guidance', href: 'https://www.england.nhs.uk/patient-safety/medication-safety/' },
        ]} />
        </div>
      </div>
    </PremiumHubPageGate>
  );
}
