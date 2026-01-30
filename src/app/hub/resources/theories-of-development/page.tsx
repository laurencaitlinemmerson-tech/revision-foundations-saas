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
          <li><strong>Sensorimotor</strong> (0-2 yrs): Experiencing the world through senses and actions.</li>
          <li><strong>Preoperational</strong> (2-7 yrs): Symbolic thinking, egocentrism, language develops.</li>
          <li><strong>Concrete Operational</strong> (7-11 yrs): Logical thinking about concrete events, conservation.</li>
          <li><strong>Formal Operational</strong> (12+ yrs): Abstract reasoning, hypothetical thinking.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Erikson's Psychosocial Stages</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Trust vs. Mistrust</strong> (0-1 yr)</li>
          <li><strong>Autonomy vs. Shame</strong> (1-3 yrs)</li>
          <li><strong>Initiative vs. Guilt</strong> (3-6 yrs)</li>
          <li><strong>Industry vs. Inferiority</strong> (6-12 yrs)</li>
          <li><strong>Identity vs. Role Confusion</strong> (12-18 yrs)</li>
          <li>...and more for adulthood</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Bowlby: Attachment Theory</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Secure, insecure-avoidant, insecure-resistant, disorganized attachment types.</li>
          <li>Importance of early bonds for emotional and social development.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Vygotsky: Social Development Theory</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Zone of Proximal Development (ZPD)</li>
          <li>Role of social interaction and scaffolding in learning</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Other Theories</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Kohlberg: Moral Development</li>
          <li>Bandura: Social Learning Theory</li>
          <li>Bronfenbrenner: Ecological Systems Theory</li>
        </ul>
      </section>
    </main>
  );
}
