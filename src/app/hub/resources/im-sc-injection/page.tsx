'use client';

import Link from 'next/link';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.inj *, .inj *::before, .inj *::after { box-sizing: border-box; box-shadow: none !important; }

.inj {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.inj-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
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
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
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
  border-radius: 2px;
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
  border-radius: 2px;
}

.inj-table th {
  background: #F3F1EE;
  font-family: 'Source Serif 4', serif;
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
  border-radius: 0 2px 2px 0;
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
  border-radius: 0 2px 2px 0;
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
  border-radius: 0 2px 2px 0;
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
  border-radius: 2px;
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
          A step-by-step guide to intramuscular and subcutaneous injection technique in paediatric patients — site selection, needle choice, and the mistakes that trip people up on placement.
        </p>
        <p className="inj-byline">The Nurse Lab · Children&apos;s Hub</p>

        {/* ── Overview ── */}
        <div className="inj-info">
          <p>
            Injections are one of the first clinical skills you&apos;ll actually do on placement (not just watch). Getting the site, angle and needle length right matters — especially in kids where there&apos;s less muscle mass to work with. This guide covers both IM and SC with paed-specific stuff your lectures probably rushed through.
          </p>
        </div>

        {/* ── IM vs SC at a glance ── */}
        <h2 className="inj-h2">IM vs SC at a glance</h2>

        <div className="inj-compare">
          <div className="inj-compare-col">
            <p className="inj-compare-label">Intramuscular (IM)</p>
            <ul className="inj-ul">
              <li>Into muscle tissue</li>
              <li>90° angle to skin</li>
              <li>Faster absorption than SC</li>
              <li>Larger volumes OK (up to 1ml infants, 2ml children)</li>
              <li>Common drugs: vaccines, antibiotics, adrenaline</li>
            </ul>
          </div>
          <div className="inj-compare-col">
            <p className="inj-compare-label">Subcutaneous (SC)</p>
            <ul className="inj-ul">
              <li>Into fatty tissue below the skin</li>
              <li>45° angle (or 90° with short needle)</li>
              <li>Slower, sustained absorption</li>
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
          In paediatrics, site choice depends on the child&apos;s age and muscle development. You can&apos;t just default to the deltoid like you would with adults — babies don&apos;t have enough muscle there yet.
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
              <td>Middle third of outer thigh. Large muscle, easy to access, well-developed even in small babies.</td>
            </tr>
            <tr>
              <td><strong>Deltoid</strong></td>
              <td>Children over 2 (if muscle bulk is adequate)</td>
              <td>Two finger-widths below the acromion process. Good for older kids and vaccines. Smaller muscle = smaller volumes.</td>
            </tr>
            <tr>
              <td><strong>Ventrogluteal</strong></td>
              <td>Over 7 months (when walking develops muscle)</td>
              <td>Between greater trochanter and iliac crest. Becoming more recommended — fewer nerves and vessels than dorsogluteal.</td>
            </tr>
          </tbody>
        </table>

        <div className="inj-warn">
          <p className="inj-warn-title">Avoid the dorsogluteal site</p>
          <p>
            The traditional &quot;upper outer quadrant of the buttock&quot; is falling out of favour because of the risk of sciatic nerve injury. Most trusts and the RCN now recommend ventrogluteal instead. If your mentor asks you to use dorsogluteal, it&apos;s worth knowing this — but follow your local policy.
          </p>
        </div>

        {/* ── Needle Selection ── */}
        <h2 className="inj-h2">Needle selection</h2>
        <p className="inj-p">
          This is where people get confused. The needle needs to be long enough to reach the muscle (for IM) but not so long it goes through it. In kids, that window is smaller than adults.
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
            You draw up with a larger gauge needle (e.g. 18G or 19G — the &quot;pink&quot; or &quot;cream&quot; needle) and then swap to a smaller gauge for injection. Drawing up with the injection needle blunts it and makes it more painful. Always change the needle before injecting.
          </p>
        </div>

        {/* ── IM Technique ── */}
        <h2 className="inj-h2">IM technique step-by-step</h2>
        <ol className="inj-steps">
          <li>Check the prescription — right patient, drug, dose, route, time. Get a second checker if needed.</li>
          <li>Gather equipment — correct syringe, drawing-up needle, injection needle, alcohol swab (check local policy), sharps bin.</li>
          <li>Draw up the medication using the larger gauge needle. Tap out air bubbles, swap to the injection needle.</li>
          <li>Position the child and identify your site. For vastus lateralis: middle third of the outer thigh.</li>
          <li>Clean the site if required by local policy (some vaccine guidelines say you don&apos;t need to — check your trust).</li>
          <li>Spread the skin taut (Z-track is preferred for many IM injections — pull the skin to one side, inject, release).</li>
          <li>Insert the needle at 90° in one smooth motion. Don&apos;t jab — but don&apos;t go slowly either.</li>
          <li>Aspirate is no longer routinely recommended for most IM injections (WHO &amp; RCN guidance). Exception: when giving into the dorsogluteal site, aspiration may still be advised locally.</li>
          <li>Inject slowly and steadily — about 1ml per 10 seconds.</li>
          <li>Withdraw the needle, apply gentle pressure with gauze. Don&apos;t rub the site.</li>
          <li>Dispose of the needle straight into the sharps bin — do not resheath.</li>
          <li>Document: drug, dose, route, site, time, batch number (for vaccines), any reactions.</li>
        </ol>

        {/* ── SC Technique ── */}
        <h2 className="inj-h2">SC technique</h2>
        <p className="inj-p">
          SC injections go into the fatty layer just beneath the skin. They&apos;re simpler in some ways, but you still need to get the angle right or you&apos;ll end up going intradermally (too shallow) or into muscle (too deep).
        </p>

        <h3 className="inj-h3">Common SC sites</h3>
        <ul className="inj-ul">
          <li>Outer upper arm (over the triceps area)</li>
          <li>Anterior thigh</li>
          <li>Abdomen (avoiding 5cm around the umbilicus) — mainly for insulin in older children</li>
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
          For children who have regular injections (insulin, growth hormone, enoxaparin), rotating sites is really important. Repeated injections in the same spot cause lipohypertrophy — hard lumpy areas of fatty tissue that mess up absorption.
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
            Anaphylaxis signs (wheeze, swelling, rash, hypotension) — call for help, give IM adrenaline. Severe pain or numbness radiating down the limb (possible nerve injury). Significant bleeding or haematoma. Signs of infection at the site within 24–48 hours (redness, warmth, swelling, pus). Any signs of extravasation or tissue necrosis.
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
          This is the bit that matters most on placement — kids remember pain, and how you manage it affects whether they cooperate next time. Plus examiners love asking about this.
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
            Honestly, the distraction thing makes such a difference. I&apos;ve seen kids who were screaming before the needle even came out completely forget about it because a play specialist had them blowing bubbles. If there&apos;s a play team available, get them involved. It&apos;s not a &quot;nice to have&quot; — it&apos;s part of the skill.
          </p>
        </div>

        {/* ── OSCE Tips ── */}
        <h2 className="inj-h2">OSCE tips</h2>
        <p className="inj-p">
          Injection stations come up a lot. Here&apos;s what examiners are actually looking for beyond just &quot;can you stick the needle in the right place.&quot;
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
            <p>If they ask you to demonstrate, pull the skin to one side before inserting at 90°, hold while injecting, then release. This seals the track and prevents drug leaking back into subcutaneous tissue.</p>
          </div>
          <div className="inj-osce-card">
            <strong>Documentation</strong>
            <p>Finish by stating what you&apos;d document: drug, dose, route, site used, time, batch number, any adverse reactions, who administered and who checked.</p>
          </div>
        </div>

        <div className="inj-info">
          <p>
            <strong>Top tip:</strong> practise on the injection simulation arms/legs in the skills lab as much as you can before your OSCE. The technique feels very different on a real person vs reading about it. If you can, ask to observe or assist with vaccinations on placement — it&apos;s the best way to build confidence.
          </p>
        </div>

        {/* ── Footer nav ── */}
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)', marginTop: '48px', paddingTop: '32px' }}>
          <Link href="/hub" className="inj-back">
            <span>←</span> Back to Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
