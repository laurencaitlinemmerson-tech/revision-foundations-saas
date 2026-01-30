import React from 'react';

export default function Y1InfectionControlPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Y1 Infection Control</h1>
      <p className="mb-6 text-[var(--plum-dark)]/80">
        Core principles of infection prevention and control for Year 1 nursing students, including hand hygiene, PPE, and aseptic technique.
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Key Concepts</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Hand Hygiene:</strong> The single most effective way to prevent infection. <em>Example:</em> Wash hands before and after patient contact, after removing gloves, and after contact with bodily fluids.</li>
          <li><strong>Personal Protective Equipment (PPE):</strong> Gloves, aprons, masks, and eye protection. <em>Example:</em> Wear gloves when handling blood or body fluids; use masks for droplet precautions.</li>
          <li><strong>Aseptic Technique:</strong> Procedures to prevent contamination. <em>Example:</em> Use sterile gloves and equipment for wound care or catheter insertion.</li>
          <li><strong>Sharps Safety:</strong> Safe handling and disposal of needles and other sharp instruments.</li>
          <li><strong>Standard Precautions:</strong> Treat all blood and body fluids as potentially infectious.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Practical Tips</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Follow local policies and signage for isolation and infection control.</li>
          <li>Report any exposure incidents immediately.</li>
          <li>Keep work areas clean and clutter-free.</li>
        </ul>
      </section>
    </main>
  );
}
