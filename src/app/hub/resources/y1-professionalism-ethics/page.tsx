import React from 'react';

export default function Y1ProfessionalismEthicsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Y1 Professionalism & Ethics</h1>
      <p className="mb-6 text-[var(--plum-dark)]/80">
        An introduction to professional behaviour, values, and ethical principles for Year 1 nursing students.
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Professionalism</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Accountability:</strong> Take responsibility for your actions and learning.</li>
          <li><strong>Respect:</strong> Treat all patients and colleagues with dignity and courtesy.</li>
          <li><strong>Teamwork:</strong> Work collaboratively and communicate effectively.</li>
          <li><strong>Appearance:</strong> Maintain a professional appearance and follow dress codes.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Ethics</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Confidentiality:</strong> Protect patient information at all times.</li>
          <li><strong>Consent:</strong> Always seek informed consent before care or procedures.</li>
          <li><strong>Non-maleficence:</strong> Do no harm.</li>
          <li><strong>Beneficence:</strong> Act in the best interest of the patient.</li>
          <li><strong>Justice:</strong> Treat patients fairly and without discrimination.</li>
        </ul>
      </section>
    </main>
  );
}
