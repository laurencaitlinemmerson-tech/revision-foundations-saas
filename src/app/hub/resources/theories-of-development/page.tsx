import React from 'react';

export default function TheoriesOfDevelopmentPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Theories of Development</h1>
      <p className="mb-6 text-[var(--plum-dark)]/80">
        A quick guide to the major developmental theories relevant to nursing, exams, and practice. Includes Piaget, Erikson, Bowlby, Vygotsky, and more.
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Piaget's Stages of Cognitive Development</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Sensorimotor</strong> (0-2 yrs): Experiencing the world through senses and actions.<br /><em>Example:</em> An infant learns that shaking a rattle makes a sound, or that objects continue to exist even when out of sight (object permanence).</li>
          <li><strong>Preoperational</strong> (2-7 yrs): Symbolic thinking, egocentrism, language develops.<br /><em>Example:</em> A child uses a broom as a "horse" during play, or struggles to see things from another person's perspective.</li>
          <li><strong>Concrete Operational</strong> (7-11 yrs): Logical thinking about concrete events, conservation.<br /><em>Example:</em> A child understands that the amount of liquid stays the same when poured into a different-shaped glass (conservation).</li>
          <li><strong>Formal Operational</strong> (12+ yrs): Abstract reasoning, hypothetical thinking.<br /><em>Example:</em> A teenager can discuss hypothetical situations, such as what might happen if gravity stopped working.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Erikson's Psychosocial Stages</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Trust vs. Mistrust</strong> (0-1 yr)<br /><em>Example:</em> A baby develops trust when caregivers provide consistent care and affection; mistrust if needs are not met.</li>
          <li><strong>Autonomy vs. Shame</strong> (1-3 yrs)<br /><em>Example:</em> A toddler wants to choose their own clothes; if criticized, they may feel shame or doubt their abilities.</li>
          <li><strong>Initiative vs. Guilt</strong> (3-6 yrs)<br /><em>Example:</em> A child plans a game with friends; if discouraged, they may feel guilty about their desires or efforts.</li>
          <li><strong>Industry vs. Inferiority</strong> (6-12 yrs)<br /><em>Example:</em> A child takes pride in schoolwork and accomplishments; repeated failure or criticism can lead to feelings of inferiority.</li>
          <li><strong>Identity vs. Role Confusion</strong> (12-18 yrs)<br /><em>Example:</em> A teenager explores different roles, beliefs, and friendships to form a personal identity.</li>
          <li>...and more for adulthood</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Bowlby: Attachment Theory</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Secure, insecure-avoidant, insecure-resistant, disorganized attachment types.<br /><em>Example:</em> A securely attached child is comforted by a caregiver's return after separation, while an insecure-avoidant child may avoid or ignore the caregiver.</li>
          <li>Importance of early bonds for emotional and social development.<br /><em>Example:</em> Consistent, responsive caregiving leads to healthy emotional regulation and relationships later in life.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Vygotsky: Social Development Theory</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Zone of Proximal Development (ZPD)<br /><em>Example:</em> A child can solve a puzzle with guidance from an adult but not alone; the support helps them learn new skills.</li>
          <li>Role of social interaction and scaffolding in learning<br /><em>Example:</em> A teacher provides hints and encouragement, gradually reducing help as the child becomes more competent.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Other Theories</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Kohlberg: Moral Development<br /><em>Example:</em> A child says stealing is wrong because they might get punished (pre-conventional), while an adult may say it's wrong because it violates ethical principles (post-conventional).</li>
          <li>Bandura: Social Learning Theory<br /><em>Example:</em> A child learns to say "please" and "thank you" by observing and imitating adults.</li>
          <li>Bronfenbrenner: Ecological Systems Theory<br /><em>Example:</em> A child's development is influenced by family, school, community, and broader society, such as cultural values or government policies.</li>
        </ul>
      </section>
    </main>
  );
}
