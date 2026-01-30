import React from 'react';

export default function Y1AnatomyPhysiologyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Y1 Anatomy & Physiology</h1>
      <p className="mb-6 text-[var(--plum-dark)]/80">
        An essential overview of the major body systems, their functions, and key facts for Year 1 nursing students.
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Major Body Systems</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li><strong>Cardiovascular:</strong> Heart, blood vessels, blood. <em>Example:</em> The heart pumps oxygenated blood to the body and removes waste products.</li>
          <li><strong>Respiratory:</strong> Lungs, airways. <em>Example:</em> Gas exchange occurs in the alveoli, supplying oxygen and removing carbon dioxide.</li>
          <li><strong>Digestive:</strong> Stomach, intestines, liver, pancreas. <em>Example:</em> Nutrients are absorbed in the small intestine.</li>
          <li><strong>Renal/Urinary:</strong> Kidneys, bladder. <em>Example:</em> Kidneys filter blood and produce urine to remove waste.</li>
          <li><strong>Nervous:</strong> Brain, spinal cord, nerves. <em>Example:</em> The nervous system controls movement, sensation, and thought.</li>
          <li><strong>Musculoskeletal:</strong> Bones, muscles, joints. <em>Example:</em> Muscles contract to move bones at joints.</li>
          <li><strong>Integumentary:</strong> Skin, hair, nails. <em>Example:</em> The skin acts as a barrier to infection and regulates temperature.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Key Concepts</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Homeostasis: The body's ability to maintain a stable internal environment.</li>
          <li>Cell Structure: All body systems are made up of cells, the basic unit of life.</li>
          <li>Fluid & Electrolyte Balance: Essential for nerve and muscle function.</li>
        </ul>
      </section>
    </main>
  );
}
