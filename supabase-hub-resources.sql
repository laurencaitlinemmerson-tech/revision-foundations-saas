-- Hub Resources Table
-- Run this in your Supabase SQL editor

CREATE TABLE hub_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  difficulty VARCHAR(20) DEFAULT 'Moderate' CHECK (difficulty IN ('Quick Win', 'Moderate', 'Deep Dive')),
  is_locked BOOLEAN DEFAULT false,
  read_time VARCHAR(20) DEFAULT '5 min read',
  content JSONB NOT NULL DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_hub_resources_published ON hub_resources(is_published, display_order);
CREATE INDEX idx_hub_resources_slug ON hub_resources(slug);

-- Enable RLS
ALTER TABLE hub_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can read published resources
CREATE POLICY "Anyone can view published resources" ON hub_resources
  FOR SELECT USING (is_published = true);

-- Insert existing resources
INSERT INTO hub_resources (slug, title, description, tags, difficulty, is_locked, read_time, display_order, content) VALUES
(
  'paeds-respiratory-assessment',
  'Paeds Respiratory Assessment',
  'Complete guide to assessing respiratory function in children including work of breathing and red flags.',
  ARRAY['OSCE', 'Paeds', 'Assessment'],
  'Moderate',
  false,
  '5 min read',
  1,
  '[
    {"title": "Initial Approach", "type": "normal", "content": ["Observe from a distance before touching the child - note positioning, colour, and breathing effort.", "Use age-appropriate communication and involve parents/carers.", "Count respiratory rate for a full 60 seconds while child is calm."]},
    {"title": "Normal Respiratory Rates by Age", "type": "checklist", "content": ["Newborn: 30-60 breaths/min", "Infant (1-12 months): 25-50 breaths/min", "Toddler (1-3 years): 20-40 breaths/min", "Preschool (3-5 years): 20-30 breaths/min", "School age (6-12 years): 15-25 breaths/min", "Adolescent: 12-20 breaths/min"]},
    {"title": "Work of Breathing Assessment", "type": "checklist", "content": ["Nasal flaring - nostrils widening with each breath", "Tracheal tug - inward movement at the neck", "Subcostal recession - pulling in below the ribs", "Intercostal recession - pulling in between the ribs", "Sternal recession - pulling in of the breastbone", "Head bobbing (in infants) - head moves with each breath", "Grunting - expiratory noise indicating respiratory distress"]},
    {"title": "Red Flags - Escalate Immediately", "type": "warning", "content": ["Silent chest on auscultation", "Cyanosis (central - lips, tongue)", "Exhaustion or decreased consciousness", "Apnoea or irregular breathing", "SpO2 <92% on air (or dropping despite oxygen)", "Severe recession with minimal air entry"]},
    {"title": "Documentation Tips", "type": "tip", "content": ["Always document respiratory rate, work of breathing, SpO2, and oxygen requirements.", "Note the child''s position and activity level when assessing.", "Record any interventions and the child''s response."]}
  ]'::jsonb
),
(
  'sepsis-6-escalation',
  'Sepsis 6 & Escalation',
  'Step-by-step sepsis recognition and the Sepsis 6 bundle with escalation pathways.',
  ARRAY['Emergency/ABCDE', 'Adult Nursing', 'Critical Care'],
  'Deep Dive',
  true,
  '7 min read',
  2,
  '[
    {"title": "Recognising Sepsis - NICE Criteria", "type": "warning", "content": ["High risk if: objective evidence of altered mental state, systolic BP ≤90 or >40 below normal, heart rate >130, respiratory rate ≥25, needs O2 to keep SpO2 ≥92%, non-blanching rash/mottled/ashen/cyanotic, not passed urine in 18 hours (<0.5ml/kg/hr if catheterised), lactate ≥2 mmol/L, recent chemotherapy"]},
    {"title": "The Sepsis 6 - Complete Within 1 Hour", "type": "checklist", "content": ["1. GIVE high-flow oxygen (target SpO2 94-98%, or 88-92% if COPD)", "2. TAKE blood cultures (before antibiotics if possible)", "3. GIVE IV antibiotics (as per local guidelines)", "4. GIVE IV fluid challenge (500ml crystalloid stat, reassess)", "5. TAKE lactate level", "6. MEASURE urine output (catheterise if needed)"]},
    {"title": "Escalation Pathway", "type": "normal", "content": ["NEWS2 score 5-6 or 3 in one parameter: Urgent clinical review within 1 hour", "NEWS2 score ≥7: Emergency assessment by critical care team", "Suspected sepsis with red flag: Immediate senior review and Sepsis 6", "Document all escalations, times, and responses clearly"]},
    {"title": "Key Nursing Actions", "type": "tip", "content": ["Don''t wait for a full set of results to escalate - clinical suspicion is enough", "Ensure IV access is secured early (ideally 2 large-bore cannulae)", "Prepare fluids and antibiotics while awaiting review", "Reassess after each fluid bolus - check BP, HR, cap refill, urine output"]}
  ]'::jsonb
),
(
  'wound-care-infection-control',
  'Wound Care & Infection Control',
  'Wound assessment, dressing selection, and infection prevention best practices.',
  ARRAY['Adult Nursing', 'Placement', 'Practical'],
  'Moderate',
  false,
  '6 min read',
  3,
  '[
    {"title": "Wound Assessment - TIME Framework", "type": "checklist", "content": ["T - Tissue: Is it viable (healthy, granulating) or non-viable (sloughy, necrotic)?", "I - Infection/Inflammation: Signs of infection? Increased exudate, odour, erythema?", "M - Moisture: Is the wound too wet or too dry?", "E - Edge: Are the wound edges advancing? Any undermining or rolled edges?"]},
    {"title": "Signs of Wound Infection", "type": "warning", "content": ["Increased pain or tenderness", "Spreading erythema (redness beyond wound edge)", "Increased warmth around wound", "Purulent or increased exudate", "Malodour", "Delayed healing or wound breakdown", "Systemic signs: fever, raised WCC, feeling unwell"]},
    {"title": "Dressing Selection Guide", "type": "normal", "content": ["Dry wounds: Hydrogels, hydrocolloids to donate moisture", "Moderate exudate: Foam dressings, alginates", "Heavy exudate: Superabsorbent dressings, negative pressure wound therapy", "Infected wounds: Antimicrobial dressings (silver, iodine, honey)", "Granulating wounds: Non-adherent dressings, hydrocolloids", "Sloughy wounds: May need debridement - hydrogels, larvae therapy"]},
    {"title": "Infection Prevention", "type": "tip", "content": ["Hand hygiene before AND after wound care - even with gloves", "Use aseptic non-touch technique (ANTT) for all wound care", "Clean from cleanest to dirtiest area", "Single-use equipment where possible", "Document wound appearance, size, and any changes at each dressing change"]}
  ]'::jsonb
),
(
  'medicines-management-osce',
  'Medicines Management OSCE',
  'Drug calculations, administration routes, and common medication errors to avoid.',
  ARRAY['OSCE', 'Meds & Calculations'],
  'Deep Dive',
  true,
  '8 min read',
  4,
  '[
    {"title": "The 6 Rights of Medication Administration", "type": "checklist", "content": ["Right PATIENT - check ID band, ask to state name and DOB", "Right DRUG - check prescription, indication, allergies", "Right DOSE - calculate if needed, check appropriateness", "Right ROUTE - oral, IV, IM, SC, topical, etc.", "Right TIME - check frequency and when last given", "Right DOCUMENTATION - sign after administration"]},
    {"title": "Essential Drug Calculations", "type": "normal", "content": ["Basic formula: What you want ÷ What you''ve got × Volume", "Example: Need 250mg, have 500mg in 10ml = 250÷500×10 = 5ml", "IV rate (ml/hr): Volume (ml) ÷ Time (hours)", "Drops per minute: (Volume × Drop factor) ÷ (Time in minutes)", "Weight-based: Dose (mg/kg) × Patient weight (kg)"]},
    {"title": "Common Medication Errors to Avoid", "type": "warning", "content": ["Never leave medications unattended at bedside", "Don''t assume - always check allergies even for simple drugs", "Look-alike/sound-alike drugs: amlodipine vs amiloride, metformin vs metronidazole", "Decimal point errors: 1.0mg could be misread as 10mg - write 1 mg", "Don''t crush modified-release tablets", "Check renal/hepatic function for dose adjustments"]},
    {"title": "OSCE Tips", "type": "tip", "content": ["Talk through your process out loud - examiners can''t mark what they can''t hear", "Always wash hands at start and end", "Check expiry dates and integrity of packaging", "If you make an error, acknowledge it and explain what you would do", "Ask the patient about swallowing ability before giving oral meds"]}
  ]'::jsonb
),
(
  'sbar-handover',
  'SBAR Handover Template',
  'Printable SBAR template with examples for confident clinical handovers.',
  ARRAY['Placement', 'Communication'],
  'Quick Win',
  false,
  '3 min read',
  5,
  '[
    {"title": "S - Situation", "type": "normal", "content": ["I am calling about [patient name] in [bed/ward]", "The problem I am calling about is...", "State the issue clearly and concisely", "Include vital signs if relevant"]},
    {"title": "B - Background", "type": "normal", "content": ["The patient was admitted on [date] with [diagnosis]", "Relevant medical history includes...", "Current treatment includes...", "Include allergies and recent changes"]},
    {"title": "A - Assessment", "type": "normal", "content": ["I think the problem is... or I''m not sure what the problem is but...", "The patient''s condition is: stable / worsening / improving", "Include your clinical observations and concerns", "NEWS2 score if relevant"]},
    {"title": "R - Recommendation", "type": "normal", "content": ["I would like you to... (come see the patient, prescribe X, advise on Y)", "Do you agree?", "Is there anything else I should do in the meantime?", "Clarify timeframe for review"]},
    {"title": "Example SBAR", "type": "tip", "content": ["S: I''m calling about Mrs Jones in bed 4. She''s become acutely short of breath, RR 28, SpO2 88% on air.", "B: She''s day 2 post hip replacement, history of COPD. Was stable this morning.", "A: I''m concerned she may have a PE or COPD exacerbation. NEWS2 is 7.", "R: I''d like you to review her urgently please. I''ve started oxygen and will get an ECG."]}
  ]'::jsonb
),
(
  'iv-fluids-vitals',
  'IV Fluids & Vitals Red Flags',
  'Fluid balance essentials and vital signs that need immediate escalation.',
  ARRAY['Adult Nursing', 'Emergency/ABCDE', 'Critical Care'],
  'Deep Dive',
  true,
  '6 min read',
  6,
  '[
    {"title": "Common IV Fluids", "type": "normal", "content": ["0.9% Sodium Chloride (Normal Saline): Resuscitation, dehydration, diluting medications", "Hartmann''s (Ringer''s Lactate): Resuscitation, surgical patients, more physiological", "5% Dextrose: Maintenance fluid, NOT for resuscitation (distributes to all compartments)", "Dextrose-Saline: Maintenance when both glucose and sodium needed", "Plasmalyte: Balanced crystalloid, increasingly used for resuscitation"]},
    {"title": "Fluid Balance Red Flags", "type": "warning", "content": ["Urine output <0.5ml/kg/hr for 2+ hours - may indicate AKI or dehydration", "Positive fluid balance >2L in 24hrs - risk of overload", "Rising creatinine with oliguria - escalate urgently", "Signs of overload: peripheral oedema, raised JVP, crackles in lungs, increasing O2 requirement"]},
    {"title": "Vital Signs Red Flags - Escalate Immediately", "type": "warning", "content": ["RR <8 or >25", "SpO2 <92% (or <88% in COPD) on oxygen", "HR <40 or >130", "Systolic BP <90 or >200", "New confusion or reduced GCS", "Temperature <35°C or >39°C with other concerns"]},
    {"title": "Monitoring Tips", "type": "tip", "content": ["Record accurate fluid input AND output - check drains, catheter, vomit, diarrhoea", "Weigh patients daily if on strict fluid balance", "Check cannula site regularly for phlebitis", "Know your patient''s normal baseline - a BP of 100 may be normal for some, low for others"]}
  ]'::jsonb
),
(
  'news2-guide',
  'NEWS2 Quick Guide',
  'National Early Warning Score explained with scoring chart and response triggers.',
  ARRAY['Adult Nursing', 'Assessment', 'Emergency/ABCDE'],
  'Quick Win',
  false,
  '4 min read',
  7,
  '[
    {"title": "NEWS2 Parameters", "type": "checklist", "content": ["Respiratory rate (scores 0-3)", "SpO2 Scale 1 or Scale 2 (scores 0-3)", "Air or oxygen (0 or 2)", "Systolic blood pressure (scores 0-3)", "Pulse/heart rate (scores 0-3)", "Consciousness (Alert, Confusion, Voice, Pain, Unresponsive) (scores 0-3)", "Temperature (scores 0-3)"]},
    {"title": "SpO2 Scale 2 - When to Use", "type": "tip", "content": ["Use Scale 2 ONLY for patients with confirmed hypercapnic respiratory failure (usually COPD)", "Must have written prescription for target SpO2 88-92%", "If in doubt, use Scale 1 (target 94-98%)"]},
    {"title": "Response Triggers", "type": "normal", "content": ["Score 0: Routine monitoring (minimum 12-hourly)", "Score 1-4: Increase monitoring frequency, inform registered nurse", "Score 3 in any single parameter: Urgent review within 1 hour", "Score 5-6: Urgent response - hourly monitoring, urgent clinician review", "Score 7+: Emergency response - continuous monitoring, emergency clinical review, consider critical care"]},
    {"title": "Key Points", "type": "warning", "content": ["NEW confusion scores 3 - always escalate new confusion", "Don''t just document the score - ACT on it", "Clinical judgement still matters - escalate if concerned even with low score", "Trends matter - a rising score is concerning even if not yet at threshold"]}
  ]'::jsonb
),
(
  'pews-guide',
  'PEWS - Paediatric Early Warning Score',
  'Age-appropriate early warning scoring for children with escalation triggers and response guidance.',
  ARRAY['Paeds', 'Assessment', 'Emergency/ABCDE'],
  'Quick Win',
  false,
  '5 min read',
  8,
  '[
    {"title": "PEWS Parameters", "type": "checklist", "content": ["Behaviour: Playing/appropriate, Sleeping, Irritable, Lethargic/confused, Reduced response to pain", "Cardiovascular: Pink, cap refill 1-2s → Pale/grey, cap refill 3s → Mottled, cap refill 4s → Mottled/tachycardic, cap refill ≥5s", "Respiratory: Normal RR, no recession → Raised RR, using accessory muscles → RR >20 above normal or 5 below, retractions → Requires 40%+ O2 or 4L/min"]},
    {"title": "Normal Vital Signs by Age", "type": "checklist", "content": ["Infant (0-12 months): HR 110-160, RR 30-40, Systolic BP 70-90", "Toddler (1-2 years): HR 100-150, RR 25-35, Systolic BP 80-95", "Preschool (3-5 years): HR 95-140, RR 20-30, Systolic BP 80-100", "School age (6-12 years): HR 80-120, RR 15-25, Systolic BP 90-110", "Adolescent (13+ years): HR 60-100, RR 12-20, Systolic BP 100-120"]},
    {"title": "Response Triggers", "type": "normal", "content": ["Score 1: Increase observation frequency, inform nurse in charge", "Score 2: Nurse in charge to review, consider medical review", "Score 3: Urgent medical review within 30 minutes", "Score 4+: Immediate medical review, consider PICU/resus team", "Any score of 3 in a single parameter: Immediate review required"]},
    {"title": "Red Flags - Escalate Immediately", "type": "warning", "content": ["Unresponsive or only responds to pain", "Severe respiratory distress or apnoea", "Central cyanosis", "Weak/absent pulses, cap refill >5 seconds", "Significant bradycardia for age", "Parental concern that child is not themselves", "Staff gut feeling that something is wrong"]},
    {"title": "Key Differences from Adult NEWS2", "type": "tip", "content": ["Vital signs must be interpreted using age-appropriate ranges", "Behaviour is a key parameter - children compensate then deteriorate rapidly", "Parental concern should always be taken seriously", "Children can maintain BP until very late - watch for subtle signs", "Work of breathing is more important than respiratory rate alone", "Always consider safeguarding if presentation doesn''t fit history"]}
  ]'::jsonb
),
(
  'pressure-area-care',
  'Pressure Area Care Plan',
  'Waterlow scoring, prevention strategies, and SSKIN bundle implementation.',
  ARRAY['Adult Nursing', 'Placement', 'Care Planning'],
  'Moderate',
  true,
  '5 min read',
  9,
  '[
    {"title": "Waterlow Risk Assessment Categories", "type": "checklist", "content": ["Build/weight for height", "Skin type and visual risk areas", "Sex and age", "Continence", "Mobility", "Appetite and nutrition", "Special risks: tissue malnutrition, neurological deficit, major surgery/trauma, medication"]},
    {"title": "Waterlow Scores", "type": "normal", "content": ["10-14: At risk", "15-19: High risk", "20+: Very high risk", "Reassess regularly and when condition changes"]},
    {"title": "SSKIN Bundle", "type": "checklist", "content": ["S - Surface: appropriate mattress/cushion for risk level", "S - Skin inspection: check pressure areas at every opportunity", "K - Keep moving: reposition 2-4 hourly, mobilise where possible", "I - Incontinence/moisture: keep skin clean and dry, use barrier products", "N - Nutrition: ensure adequate nutrition and hydration"]},
    {"title": "Pressure Ulcer Categories", "type": "warning", "content": ["Category 1: Non-blanching erythema (redness that doesn''t fade when pressed)", "Category 2: Partial thickness skin loss - shallow open ulcer or blister", "Category 3: Full thickness skin loss - fat visible, may see slough", "Category 4: Full thickness tissue loss - bone/tendon/muscle exposed", "Unstageable: Full thickness, base obscured by slough/eschar", "Deep tissue injury: Purple/maroon discoloured intact skin"]}
  ]'::jsonb
),
(
  'ae-assessment',
  'A-E Assessment Checklist',
  'Systematic ABCDE assessment approach with printable pocket checklist.',
  ARRAY['OSCE', 'Emergency/ABCDE', 'Assessment'],
  'Quick Win',
  false,
  '5 min read',
  10,
  '[
    {"title": "A - Airway", "type": "checklist", "content": ["Is the patient talking? (Patent airway if speaking)", "Look for obstruction: secretions, vomit, blood, foreign body", "Listen for abnormal sounds: stridor, gurgling, snoring", "Feel for air movement", "If obstructed: head tilt/chin lift, suction, consider airway adjuncts", "Call for help early if airway compromised"]},
    {"title": "B - Breathing", "type": "checklist", "content": ["Respiratory rate (count for 60 seconds)", "SpO2 on air, then on oxygen if needed", "Work of breathing: accessory muscles, recession", "Chest expansion: equal bilateral?", "Auscultate: air entry, added sounds (wheeze, crackles)", "Percussion if indicated", "Give oxygen if SpO2 <94% (or <88% COPD)"]},
    {"title": "C - Circulation", "type": "checklist", "content": ["Heart rate and rhythm (manual pulse)", "Blood pressure", "Capillary refill time (<2 seconds normal)", "Skin colour and moisture", "Temperature", "Urine output (if catheterised)", "Look for bleeding (visible and consider hidden)", "IV access if unwell, take bloods, consider fluids"]},
    {"title": "D - Disability", "type": "checklist", "content": ["AVPU: Alert, Voice, Pain, Unresponsive", "GCS if reduced consciousness", "Pupil size and reactivity", "Blood glucose (treat if <4mmol/L)", "Check drug chart: sedatives, opioids, insulin?", "Consider causes: hypoxia, hypoglycaemia, opiates, seizures, stroke"]},
    {"title": "E - Exposure", "type": "checklist", "content": ["Full body inspection (maintain dignity)", "Look for rashes, wounds, swelling, bruising", "Check behind/underneath patient", "Review charts, notes, observation trends", "Keep patient warm after examination"]}
  ]'::jsonb
),
(
  'end-of-life-communication',
  'End of Life Communication Phrases',
  'Compassionate phrases and frameworks for difficult conversations with families.',
  ARRAY['Mental Health', 'Palliative', 'Communication'],
  'Deep Dive',
  true,
  '6 min read',
  11,
  '[
    {"title": "Setting Up the Conversation", "type": "normal", "content": ["Find a private, quiet space", "Ensure you have time and won''t be interrupted", "Sit at eye level, maintain appropriate eye contact", "Ask who they would like present", "I need to talk to you about something important. Is now a good time?"]},
    {"title": "Delivering Difficult News", "type": "normal", "content": ["Give a warning shot: I''m afraid I have some difficult news...", "Be clear and avoid euphemisms: dying not passing away", "Pause after giving information - allow time to process", "Don''t fill silences - let them lead", "I''m so sorry. This must be very hard to hear."]},
    {"title": "Helpful Phrases", "type": "tip", "content": ["What is your understanding of what''s happening?", "I wish things were different.", "This must be really frightening/overwhelming.", "What matters most to you/them right now?", "We will make sure they are comfortable and not in pain.", "You don''t have to make any decisions right now.", "It''s okay to feel however you''re feeling."]},
    {"title": "Things to Avoid", "type": "warning", "content": ["Don''t say I know how you feel - you don''t", "Avoid at least they had a good life - minimises grief", "Don''t give false hope or unrealistic reassurance", "Avoid medical jargon", "Don''t rush - this conversation can''t be hurried"]},
    {"title": "After the Conversation", "type": "normal", "content": ["Summarise what was discussed", "Ask if they have questions", "Explain next steps clearly", "Offer written information if available", "Arrange follow-up and give contact details", "Document the conversation in the notes", "Debrief with colleagues if you need support"]}
  ]'::jsonb
);
