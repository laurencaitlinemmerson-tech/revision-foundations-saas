import React from 'react';

export default function Y1DocumentationPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Y1 Documentation & Record Keeping</h1>
      <p className="mb-6 text-[var(--plum-dark)]/80">
        The basics of accurate, legal, and professional documentation for Year 1 nursing students.
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Key Principles</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Accuracy:</strong> Record facts, not opinions. <em>Example:</em> "Patient reports pain 7/10" not "Patient seems fine".</li>
          <li><strong>Timeliness:</strong> Document care as soon as possible after it is given.</li>
          <li><strong>Legibility:</strong> Write clearly and use approved abbreviations only.</li>
          <li><strong>Confidentiality:</strong> Keep patient information secure and private.</li>
          <li><strong>Sign & Date:</strong> Every entry must be signed and dated.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Common Pitfalls</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Never document care before it is given.</li>
          <li>Do not use correction fluid or erase errors; strike through with a single line and sign.</li>
          <li>Do not share login details or leave records unattended.</li>
        </ul>
      </section>
    </main>
  );
}
