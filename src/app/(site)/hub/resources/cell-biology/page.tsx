'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.cb-guide *, .cb-guide *::before, .cb-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.cb-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.cb-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.cb-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-decoration: none;
  margin-bottom: 44px;
}
.cb-back:hover { color: var(--ink-soft); }
.cb-back-arrow { font-style: normal; }

/* Masthead */
.cb-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.cb-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.cb-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.cb-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Golden rules grid */
.cb-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.cb-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.cb-golden-cell:last-child { border-right: none; }

.cb-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.cb-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.cb-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step sections */
.cb-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.cb-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.cb-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.cb-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.cb-step-content {
  padding-left: 32px;
}

.cb-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.cb-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* 4-column content grid */
.cb-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.cb-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.cb-content-col:last-child { border-right: none; }

.cb-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.cb-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cb-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.cb-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.cb-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.cb-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.cb-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.cb-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.cb-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.cb-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.cb-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 36px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--hairline-firm);
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Table */
.cb-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.cb-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid var(--hairline-firm);
  border-right: 0.5px solid var(--hairline-firm);
  text-align: left;
  background: var(--surface-sunken);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.cb-table th:last-child { border-right: none; }

.cb-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.cb-table td:last-child { border-right: none; }
.cb-table tr:last-child td { border-bottom: none; }
.cb-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* 2-col grid */
.cb-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.cb-grid-2-cell {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.cb-grid-2-cell:nth-child(2n) { border-right: none; }

.cb-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step colour system */
.cb-letter-1 { color: var(--blue-600); }
.cb-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.cb-letter-2 { color: var(--teal-600); }
.cb-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.cb-letter-3 { color: var(--coral-600); }
.cb-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.cb-letter-4 { color: var(--purple-600); }
.cb-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.cb-letter-5 { color: var(--gray-600); }
.cb-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.cb-letter-6 { color: #8B5E3C; }
.cb-badge-6 { background: var(--surface-sunken); color: #6B4729; }

/* Responsive */
@media (max-width: 860px) {
  .cb-wrap { padding: 24px 20px 48px; }
  .cb-headline { font-size: 34px; }
  .cb-golden { grid-template-columns: repeat(2, 1fr); }
  .cb-golden-cell:nth-child(2) { border-right: none; }
  .cb-golden-cell:nth-child(1), .cb-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .cb-step { grid-template-columns: 64px 1fr; }
  .cb-step-letter { font-size: 48px; }
  .cb-content-grid { grid-template-columns: repeat(2, 1fr); }
  .cb-content-col:nth-child(2) { border-right: none; }
  .cb-content-col:nth-child(1), .cb-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .cb-grid-2 { grid-template-columns: 1fr; }
  .cb-grid-2-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .cb-grid-2-cell:last-child { border-bottom: none; }
}

@media (max-width: 520px) {
  .cb-golden { grid-template-columns: 1fr; }
  .cb-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .cb-golden-cell:last-child { border-bottom: none; }
  .cb-content-grid { grid-template-columns: 1fr; }
  .cb-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .cb-content-col:last-child { border-bottom: none; }
  .cb-step { grid-template-columns: 52px 1fr; }
  .cb-step-letter { font-size: 38px; }
  .cb-step-content { padding-left: 18px; }
}
`;


// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'Cell Structure & Organelles',
    question: 'What are the basic building blocks inside every human cell?',
    cols: [
      {
        header: 'Nucleus',
        items: [
          'Contains DNA (the genetic blueprint)',
          'Surrounded by a double membrane (nuclear envelope)',
          'Nuclear pores control what enters and leaves',
          'Nucleolus inside makes ribosomal RNA',
        ],
      },
      {
        header: 'Cytoplasm & ribosomes',
        items: [
          'Cytoplasm: jelly-like fluid filling the cell',
          'Ribosomes: build proteins from mRNA instructions',
          'Free ribosomes make proteins for the cell itself',
          'Bound ribosomes (on rough ER) make export proteins',
        ],
      },
      {
        header: 'ER & Golgi',
        items: [
          'Rough ER: studded with ribosomes, makes proteins',
          'Smooth ER: makes lipids, detoxifies drugs',
          'Golgi apparatus: packages and sorts proteins',
          'Vesicles bud off the Golgi for delivery',
        ],
      },
      {
        header: 'Mitochondria & lysosomes',
        items: [
          'Mitochondria: powerhouses, make ATP (energy)',
          'Have their own DNA (inherited from the mother)',
          'Lysosomes: contain digestive enzymes',
          'Lysosomes break down waste and old organelles',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Mitochondria have their own DNA because they were once free-living bacteria that became part of our cells. This is why mitochondrial diseases are always inherited from the mother, and why some antibiotics that target bacterial ribosomes can also affect mitochondria.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Cell Membrane & Transport',
    question: 'How does the cell control what gets in and out?',
    cols: [
      {
        header: 'Membrane structure',
        items: [
          'Phospholipid bilayer: two layers of fat molecules',
          'Hydrophilic heads face outward (water-loving)',
          'Hydrophobic tails face inward (water-hating)',
          'Cholesterol adds stability and fluidity',
        ],
      },
      {
        header: 'Passive transport',
        items: [
          'Diffusion: molecules move high to low concentration',
          'Osmosis: water moves across a semi-permeable membrane',
          'Facilitated diffusion: uses channel or carrier proteins',
          'No energy (ATP) needed for any passive transport',
        ],
      },
      {
        header: 'Active transport',
        items: [
          'Moves substances against their concentration gradient',
          'Requires ATP (energy)',
          'Sodium-potassium pump: 3 Na⁺ out, 2 K⁺ in',
          'Essential for nerve impulses and muscle contraction',
        ],
      },
      {
        header: 'Bulk transport',
        items: [
          'Endocytosis: cell engulfs material inward',
          'Phagocytosis: cell "eats" large particles',
          'Pinocytosis: cell "drinks" fluid droplets',
          'Exocytosis: vesicles release contents outside',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Osmosis is why IV fluid choice matters so much. Give a hypotonic fluid and water moves into cells, causing them to swell. Give a hypertonic fluid and water moves out of cells, causing them to shrink. Isotonic fluids like 0.9% saline match cell concentration, so water stays balanced.',
  },
  {
    number: '3',
    colour: '3',
    name: 'DNA, Genes & Protein Synthesis',
    question: 'How does the cell read its genetic instructions and build what it needs?',
    cols: [
      {
        header: 'DNA basics',
        items: [
          'Double helix made of nucleotide bases',
          'A pairs with T, C pairs with G',
          '23 pairs of chromosomes in each human cell',
          'A gene is a section of DNA coding for one protein',
        ],
      },
      {
        header: 'Transcription',
        items: [
          'DNA unzips in the nucleus',
          'One strand is copied into messenger RNA (mRNA)',
          'mRNA carries the code out through nuclear pores',
          'Happens in the nucleus',
        ],
      },
      {
        header: 'Translation',
        items: [
          'mRNA attaches to a ribosome',
          'Transfer RNA (tRNA) brings matching amino acids',
          'Amino acids are linked into a polypeptide chain',
          'The chain folds into a functional protein',
        ],
      },
      {
        header: 'Why it matters',
        items: [
          'Mutations change the DNA code',
          'Changed code can make faulty or missing proteins',
          'Sickle cell: one base change alters haemoglobin',
          'Cancer: mutations in growth-control genes',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'The central dogma in plain terms: DNA makes RNA, RNA makes protein. Almost every drug, every disease process, and every lab test you encounter in nursing connects back to this chain somewhere. A faulty gene means a faulty protein, and a faulty protein means a body system that does not work as expected.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Cell Division & the Cell Cycle',
    question: 'How do cells copy themselves and why does it matter when it goes wrong?',
    cols: [
      {
        header: 'The cell cycle',
        items: [
          'G1: cell grows and prepares',
          'S phase: DNA is copied (replicated)',
          'G2: cell checks the copy and prepares to divide',
          'M phase: actual division (mitosis or meiosis)',
        ],
      },
      {
        header: 'Mitosis',
        items: [
          'Produces two identical daughter cells',
          'Used for growth, repair, and replacement',
          'Same chromosome number as the parent (46)',
          'Skin, gut lining, blood cells all rely on mitosis',
        ],
      },
      {
        header: 'Meiosis',
        items: [
          'Produces four genetically unique cells',
          'Used only for egg and sperm production',
          'Halves the chromosome number (46 to 23)',
          'Genetic variation through crossing over',
        ],
      },
      {
        header: 'When division goes wrong',
        items: [
          'Checkpoints normally catch DNA errors',
          'Failed checkpoints can lead to uncontrolled growth',
          'Cancer is fundamentally a disease of cell division',
          'Chemotherapy targets rapidly dividing cells',
        ],
      },
    ],
    redFlags: ['Rapidly growing mass', 'Unexplained weight loss', 'New or changing skin lesions', 'Unusual bleeding or discharge'],
    pearl:
      'Chemotherapy works by targeting cells that divide quickly, which is why it hits cancer cells hard. But it also damages other rapidly dividing healthy cells like hair follicles, gut lining, and bone marrow. That is the reason behind hair loss, nausea, and low blood counts as side effects.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Tissues & Cell Specialisation',
    question: 'How do cells organise into tissues, and why are different cell types shaped differently?',
    cols: [
      {
        header: 'Epithelial tissue',
        items: [
          'Covers body surfaces and lines organs',
          'Squamous: thin and flat, for diffusion (alveoli)',
          'Cuboidal: cube-shaped, for secretion (kidney tubules)',
          'Columnar: tall, for absorption (gut lining)',
        ],
      },
      {
        header: 'Connective tissue',
        items: [
          'Supports, connects, and protects',
          'Bone, cartilage, blood, and fat are all connective',
          'Blood is a liquid connective tissue',
          'Collagen fibres give tensile strength',
        ],
      },
      {
        header: 'Muscle tissue',
        items: [
          'Skeletal: voluntary, striated, attached to bones',
          'Cardiac: involuntary, striated, only in the heart',
          'Smooth: involuntary, in walls of hollow organs',
          'All muscle tissue contracts to produce movement',
        ],
      },
      {
        header: 'Nervous tissue',
        items: [
          'Neurones transmit electrical impulses',
          'Long axons carry signals over distance',
          'Glial cells support and insulate neurones',
          'Found in brain, spinal cord, and peripheral nerves',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Every cell in your body has exactly the same DNA, yet a nerve cell looks and works completely differently from a skin cell. The difference is which genes are switched on. Cell specialisation (differentiation) is the process of activating certain genes and silencing others to create a cell with a specific job.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Clinical Connections',
    question: 'How does cell biology connect to what you see on placement?',
    cols: [
      {
        header: 'Inflammation',
        items: [
          'Damaged cells release chemical signals',
          'Blood vessels dilate (redness, heat)',
          'Capillaries become leaky (swelling)',
          'White blood cells migrate to the area',
        ],
      },
      {
        header: 'Wound healing',
        items: [
          'Haemostasis: clotting stops the bleeding',
          'Inflammation: clears debris and bacteria',
          'Proliferation: new cells fill the gap (mitosis)',
          'Remodelling: scar tissue strengthens over months',
        ],
      },
      {
        header: 'Infection & immunity',
        items: [
          'Pathogens enter through broken barriers',
          'Phagocytes engulf and destroy invaders',
          'Lymphocytes make antibodies (adaptive immunity)',
          'Memory cells give faster response next time',
        ],
      },
      {
        header: 'Medications & the cell',
        items: [
          'Many drugs work by binding to cell receptors',
          'Antibiotics target bacterial cell structures',
          'Anti-inflammatories block chemical signalling',
          'Understanding the target helps predict side effects',
        ],
      },
    ],
    redFlags: ['Signs of sepsis', 'Non-healing wound', 'Unexpected immune suppression', 'Allergic or anaphylactic reaction'],
    pearl:
      'When you give a drug, it does not just "work". It binds to a specific receptor or enzyme at the cell level. Understanding this helps you predict side effects, drug interactions, and why timing and dose matter. The cell is where pharmacology actually happens.',
  },
];

const organelleRows = [
  { organelle: 'Nucleus', structure: 'Double membrane with pores, contains chromatin', function: 'Stores DNA and controls cell activity' },
  { organelle: 'Mitochondria', structure: 'Double membrane with inner folds (cristae)', function: 'Aerobic respiration — produces ATP (energy)' },
  { organelle: 'Rough ER', structure: 'Membrane network studded with ribosomes', function: 'Synthesises proteins for export' },
  { organelle: 'Smooth ER', structure: 'Membrane network without ribosomes', function: 'Makes lipids, detoxifies drugs and alcohol' },
  { organelle: 'Golgi apparatus', structure: 'Stack of flattened membrane sacs', function: 'Modifies, packages, and sorts proteins' },
  { organelle: 'Lysosomes', structure: 'Membrane-bound sacs with digestive enzymes', function: 'Breaks down waste, worn-out organelles, and pathogens' },
  { organelle: 'Ribosomes', structure: 'Small granules of RNA and protein', function: 'Site of protein synthesis (translation)' },
  { organelle: 'Cell membrane', structure: 'Phospholipid bilayer with embedded proteins', function: 'Controls entry and exit of substances' },
  { organelle: 'Cytoskeleton', structure: 'Network of protein filaments and tubules', function: 'Maintains cell shape, enables movement' },
  { organelle: 'Centrioles', structure: 'Paired cylindrical structures near the nucleus', function: 'Organise spindle fibres during cell division' },
];

const transportRows = [
  ['Simple diffusion', 'Passive', 'Small non-polar molecules move down the concentration gradient', 'O₂ and CO₂ across alveolar membrane'],
  ['Facilitated diffusion', 'Passive', 'Larger or charged molecules use channel or carrier proteins', 'Glucose entering cells via GLUT transporters'],
  ['Osmosis', 'Passive', 'Water moves across a semi-permeable membrane from dilute to concentrated', 'Water reabsorption in kidney tubules'],
  ['Active transport', 'Active (ATP)', 'Substances pumped against their concentration gradient', 'Na⁺/K⁺ pump in nerve and muscle cells'],
  ['Endocytosis', 'Active (ATP)', 'Cell membrane folds inward to engulf material', 'Phagocytes engulfing bacteria'],
  ['Exocytosis', 'Active (ATP)', 'Vesicles fuse with cell membrane to release contents', 'Neurotransmitter release at synapses'],
];

const tissueRows = [
  ['Simple squamous epithelium', 'Single layer of thin flat cells', 'Diffusion and filtration', 'Alveoli, blood vessel lining'],
  ['Simple cuboidal epithelium', 'Single layer of cube-shaped cells', 'Secretion and absorption', 'Kidney tubules, gland ducts'],
  ['Simple columnar epithelium', 'Single layer of tall cells, often with goblet cells', 'Absorption and mucus secretion', 'Stomach and intestinal lining'],
  ['Stratified squamous epithelium', 'Multiple layers of flat cells', 'Protection against abrasion', 'Skin, mouth, oesophagus'],
  ['Connective tissue (loose)', 'Scattered fibres in gel-like ground substance', 'Cushioning and support', 'Under skin, around organs'],
  ['Connective tissue (dense)', 'Tightly packed collagen fibres', 'Strong attachment and support', 'Tendons, ligaments'],
];

const cellCycleRows = [
  ['G1 (Gap 1)', 'Cell grows, makes proteins, carries out normal functions', 'Hours to days'],
  ['S (Synthesis)', 'DNA is replicated so each chromosome is copied', '6–8 hours'],
  ['G2 (Gap 2)', 'Cell checks the DNA copy and prepares for division', '3–4 hours'],
  ['Mitosis', 'Nucleus divides: prophase, metaphase, anaphase, telophase', '~1 hour'],
  ['Cytokinesis', 'Cytoplasm splits, producing two daughter cells', 'Minutes'],
  ['G0 (Quiescence)', 'Cell exits the cycle and stops dividing', 'Indefinite (e.g. neurones)'],
];

const clinicalLinkRows = [
  ['Sickle cell disease', 'Single DNA base mutation changes one amino acid in haemoglobin', 'Red blood cells become rigid and sickle-shaped, blocking small vessels'],
  ['Cystic fibrosis', 'Mutation in CFTR gene on chromosome 7', 'Chloride channel does not work properly, leading to thick sticky mucus'],
  ['Type 1 diabetes', 'Autoimmune destruction of insulin-producing beta cells', 'No insulin production; cells cannot take up glucose properly'],
  ['Cancer', 'Mutations in tumour suppressor genes or oncogenes', 'Uncontrolled cell division bypassing normal checkpoints'],
  ['Down syndrome', 'Trisomy 21 — three copies of chromosome 21 instead of two', 'Extra genetic material affects development and organ function'],
  ['Oedema', 'Fluid shifts due to osmotic or hydrostatic pressure imbalance', 'Excess fluid in interstitial spaces causing visible swelling'],
];

const quizQuestions = [
  {
    question: 'What is the main function of mitochondria?',
    options: ['Protein synthesis', 'Producing ATP through aerobic respiration', 'Storing DNA', 'Breaking down waste'],
    answer: 1,
    explanation: 'Mitochondria are the powerhouses of the cell. They carry out aerobic respiration to produce ATP, the energy currency that drives almost every process in the body.',
  },
  {
    question: 'Which type of transport requires ATP?',
    options: ['Simple diffusion', 'Osmosis', 'Facilitated diffusion', 'Active transport'],
    answer: 3,
    explanation: 'Active transport moves substances against their concentration gradient, which requires energy in the form of ATP. All three passive methods (diffusion, osmosis, facilitated diffusion) do not need ATP.',
  },
  {
    question: 'What does the Golgi apparatus do?',
    options: ['Copies DNA', 'Produces ATP', 'Modifies, packages, and sorts proteins', 'Digests waste material'],
    answer: 2,
    explanation: 'The Golgi apparatus receives proteins from the rough ER, modifies them (e.g. adding sugar groups), packages them into vesicles, and sends them to the right destination.',
  },
  {
    question: 'In which phase of the cell cycle is DNA replicated?',
    options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
    answer: 1,
    explanation: 'The S (synthesis) phase is when the cell copies all of its DNA so that each daughter cell will receive a complete set of chromosomes after division.',
  },
  {
    question: 'What is the key difference between mitosis and meiosis?',
    options: ['Mitosis produces four cells, meiosis produces two', 'Mitosis is for growth and repair, meiosis is for gametes', 'Meiosis produces identical cells', 'Mitosis halves the chromosome number'],
    answer: 1,
    explanation: 'Mitosis produces two identical daughter cells for growth and repair. Meiosis produces four genetically unique cells (gametes) with half the chromosome number, used only for reproduction.',
  },
  {
    question: 'Why does chemotherapy cause hair loss and nausea?',
    options: ['It only targets cancer cells', 'It damages all cells equally', 'It targets rapidly dividing cells, including healthy ones like hair and gut lining', 'It blocks nerve signals'],
    answer: 2,
    explanation: 'Chemotherapy targets rapidly dividing cells. Cancer cells divide quickly, but so do hair follicle cells and gut lining cells, which is why these tissues are affected as side effects.',
  },
  {
    question: 'Which tissue type lines the alveoli to allow gas exchange?',
    options: ['Stratified squamous epithelium', 'Simple columnar epithelium', 'Simple squamous epithelium', 'Connective tissue'],
    answer: 2,
    explanation: 'Simple squamous epithelium is a single layer of very thin flat cells, which is ideal for allowing gases to diffuse quickly across the alveolar membrane.',
  },
  {
    question: 'What happens to cells placed in a hypotonic solution?',
    options: ['They shrink', 'They stay the same', 'They swell and may burst', 'They divide faster'],
    answer: 2,
    explanation: 'In a hypotonic solution, the water concentration outside the cell is higher than inside, so water moves into the cell by osmosis, causing it to swell and potentially burst (lyse).',
  },
];


// ─── Component ────────────────────────────────────────────────────────────────

export default function CellBiologyPage() {
  return (
    <div className="cb-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cb-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="cb-back">
          <span className="cb-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="cb-kicker">Nursing · Cell Biology</p>
        <h1 className="cb-headline">Cell Biology &amp; the Body</h1>
        <p className="cb-standfirst">
          How cells are built, how they communicate and divide, and why understanding the cell helps you make sense of disease, drugs, and what you see on placement.
        </p>
        <p className="cb-byline">Nursing foundations · The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="cell-biology"
          hubItemTitle="Cell Biology & the Body"
        />

        {/* Student note pearl */}
        <div className="cb-pearl" style={{ marginBottom: '40px' }}>
          <p className="cb-pearl-label">Student note</p>
          <p>Organelles are the tiny structures inside a cell that each have a specific job. ATP is adenosine triphosphate, the molecule cells use as energy. The phospholipid bilayer is the double layer of fat molecules that forms the cell membrane. Mitosis means cell division for growth and repair. Meiosis is division that makes eggs and sperm.</p>
        </div>

        {/* Golden rules */}
        <div className="cb-golden">
          {[
            { n: '01', title: 'Energy', text: 'Mitochondria make ATP. No ATP, no cellular work. Think of them as the batteries inside every cell.' },
            { n: '02', title: 'Membrane rule', text: 'The phospholipid bilayer decides what gets in and out. It is selectively permeable, not freely open.' },
            { n: '03', title: 'Central dogma', text: 'DNA makes RNA, RNA makes protein. Almost every disease and drug connects back to this chain.' },
            { n: '04', title: 'Division', text: 'Mitosis = 2 identical cells (growth). Meiosis = 4 unique cells (gametes). Cancer = mitosis gone wrong.' },
          ].map((cell) => (
            <div key={cell.n} className="cb-golden-cell">
              <span className="cb-golden-numeral">{cell.n}</span>
              <p className="cb-golden-title">{cell.title}</p>
              <p className="cb-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.number} className="cb-step">
            {/* Sidebar */}
            <div className="cb-step-sidebar">
              <span className={`cb-step-letter cb-letter-${section.colour}`}>{section.number}</span>
              <span className={`cb-step-badge cb-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            {/* Content */}
            <div className="cb-step-content">
              <h2 className="cb-step-name">{section.name}</h2>
              <p className="cb-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="cb-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="cb-content-col">
                    <p className="cb-col-header">{col.header}</p>
                    <ul className="cb-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Red flags */}
              {section.redFlags.length > 0 && (
                <>
                  <p className="cb-redflags-label">Red flags</p>
                  <div className="cb-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="cb-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="cb-pearl">
                  <p className="cb-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Organelle reference table */}
        <h2 className="cb-section-title">Organelle Reference</h2>
        <table className="cb-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Organelle</th>
              <th>Structure</th>
              <th>Function</th>
            </tr>
          </thead>
          <tbody>
            {organelleRows.map((row) => (
              <tr key={row.organelle}>
                <td>{row.organelle}</td>
                <td>{row.structure}</td>
                <td>{row.function}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Transport mechanisms */}
        <h2 className="cb-section-title">Transport Mechanisms</h2>
        <table className="cb-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Mechanism</th>
              <th>Type</th>
              <th>How it works</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {transportRows.map(([mechanism, type, how, example]) => (
              <tr key={mechanism}>
                <td>{mechanism}</td>
                <td>{type}</td>
                <td>{how}</td>
                <td>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cb-pearl" style={{ marginBottom: '32px' }}>
          <p className="cb-pearl-label">Clinical pearl</p>
          <p>When you hang an IV bag, you are manipulating osmosis and diffusion at the cellular level. The concentration of the fluid you give determines which way water moves across cell membranes throughout the body.</p>
        </div>

        {/* Tissue types */}
        <h2 className="cb-section-title">Tissue Types Reference</h2>
        <table className="cb-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Tissue</th>
              <th>Structure</th>
              <th>Function</th>
              <th>Where found</th>
            </tr>
          </thead>
          <tbody>
            {tissueRows.map(([tissue, structure, fn, where]) => (
              <tr key={tissue}>
                <td>{tissue}</td>
                <td>{structure}</td>
                <td>{fn}</td>
                <td>{where}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Cell cycle */}
        <h2 className="cb-section-title">The Cell Cycle</h2>
        <table className="cb-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Phase</th>
              <th>What happens</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {cellCycleRows.map(([phase, what, duration]) => (
              <tr key={phase}>
                <td>{phase}</td>
                <td>{what}</td>
                <td>{duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cb-pearl" style={{ marginBottom: '32px' }}>
          <p className="cb-pearl-label">Clinical pearl</p>
          <p>Some cells like neurones spend most of their life in G0 and rarely divide. This is why brain and spinal cord injuries are so difficult to recover from. Other cells like gut epithelium divide every few days, which is why the gut lining is so sensitive to chemotherapy.</p>
        </div>

        {/* Clinical links */}
        <h2 className="cb-section-title">Clinical Links</h2>
        <table className="cb-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Condition</th>
              <th>Cell biology</th>
              <th>Clinical effect</th>
            </tr>
          </thead>
          <tbody>
            {clinicalLinkRows.map(([condition, biology, effect]) => (
              <tr key={condition}>
                <td>{condition}</td>
                <td>{biology}</td>
                <td>{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Key terms recap */}
        <h2 className="cb-section-title">Key Terms at a Glance</h2>
        <div className="cb-grid-2">
          {[
            ['ATP', 'The energy currency of the cell — produced mainly by mitochondria'],
            ['Phospholipid bilayer', 'The double layer of fat molecules forming the cell membrane'],
            ['Osmosis', 'Movement of water from dilute to concentrated across a semi-permeable membrane'],
            ['Mitosis', 'Cell division producing two identical daughter cells for growth and repair'],
            ['Meiosis', 'Cell division producing four genetically unique gametes with half the chromosomes'],
            ['Differentiation', 'The process by which a cell becomes specialised for a particular function'],
          ].map(([term, definition]) => (
            <div key={term} className="cb-grid-2-cell">
              <p className="cb-grid-2-header">{term}</p>
              <ul className="cb-col-list">
                <li>{definition}</li>
              </ul>
            </div>
          ))}
        </div>

        {/* Mnemonic recap */}
        <h2 className="cb-section-title">Quick Mnemonic Recap</h2>
        <div className="cb-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'Organelle order', text: 'Naughty Mice Run Smoothly, Getting Lively — Nucleus, Mitochondria, Rough ER, Smooth ER, Golgi, Lysosomes.' },
            { n: '02', title: 'DNA → protein', text: 'DNA → mRNA (Transcription) → Protein (Translation). "T before T" — transcription before translation.' },
            { n: '03', title: 'Transport', text: 'Passive = no energy, downhill. Active = ATP, uphill. Think of passive as rolling downhill for free.' },
            { n: '04', title: 'Tissues', text: 'ECMN — Epithelial, Connective, Muscle, Nervous. "Every Cell Must Need" a tissue type.' },
          ].map((cell) => (
            <div key={cell.n} className="cb-golden-cell">
              <span className="cb-golden-numeral">{cell.n}</span>
              <p className="cb-golden-title">{cell.title}</p>
              <p className="cb-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Quiz */}
        <h2 className="cb-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Cell Biology & the Body" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'Tortora GJ & Derrickson B (2017)', title: 'Principles of Anatomy and Physiology (15th edn)', href: 'https://www.wiley.com/' },
          { citation: 'Khan Academy', title: 'Cell biology — AP Biology', href: 'https://www.khanacademy.org/science/ap-biology/cell-biology' },
        ]} />
      </div>
    </div>
  );
}
