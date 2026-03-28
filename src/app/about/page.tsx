'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion } from 'framer-motion';

export default function AboutPage() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero Section */}

      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Paeds Student Nurse Wallpaper</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 3840px;
  height: 2160px;
  overflow: hidden;
  background: #F2EBE0;
}

.wallpaper {
  position: relative;
  width: 3840px;
  height: 2160px;
  overflow: hidden;
}

.bg-base {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse 2400px 1800px at 30% 40%, #EFE5D5 0%, transparent 65%),
    radial-gradient(ellipse 1800px 1400px at 80% 70%, #E8DDD0 0%, transparent 55%),
    radial-gradient(ellipse 1200px 900px at 60% 15%, #F5EDE2 0%, transparent 50%),
    #F0E8DB;
}

.bg-lines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 59px,
    rgba(180,155,120,0.07) 60px
  );
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 0% 0%, rgba(140,100,60,0.08) 0%, transparent 35%),
    radial-gradient(ellipse at 100% 100%, rgba(140,100,60,0.1) 0%, transparent 40%),
    radial-gradient(ellipse at 100% 0%, rgba(180,130,80,0.05) 0%, transparent 30%),
    radial-gradient(ellipse at 0% 100%, rgba(160,110,70,0.07) 0%, transparent 30%);
}

.bg-dots {
  position: absolute;
  top: 0;
  right: 0;
  width: 1600px;
  height: 1400px;
  background-image: radial-gradient(circle, rgba(180,140,90,0.18) 1.5px, transparent 1.5px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 900px 900px at 80% 20%, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 900px 900px at 80% 20%, black 0%, transparent 70%);
}

.bg-stripe {
  position: absolute;
  top: 0;
  left: 0;
  width: 3840px;
  height: 420px;
  background: linear-gradient(180deg, rgba(200,165,110,0.09) 0%, transparent 100%);
}

.rule-top {
  position: absolute;
  top: 200px;
  left: 180px;
  right: 180px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(120,85,45,0.35) 15%, rgba(120,85,45,0.35) 85%, transparent);
}

.rule-bottom {
  position: absolute;
  bottom: 200px;
  left: 180px;
  right: 180px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(120,85,45,0.2) 15%, rgba(120,85,45,0.2) 85%, transparent);
}

.rule-left {
  position: absolute;
  top: 200px;
  bottom: 200px;
  left: 700px;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(120,85,45,0.22) 10%, rgba(120,85,45,0.22) 90%, transparent);
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
}

.col-left {
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 280px 80px 280px 180px;
}

.left-label {
  font-family: 'DM Mono', monospace;
  font-size: 22px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(100,70,35,0.55);
  margin-bottom: 60px;
}

.left-ornament {
  width: 60px;
  height: 3px;
  background: #B8824A;
  margin-bottom: 56px;
}

.left-stacked {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.left-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.left-item-label {
  font-family: 'DM Mono', monospace;
  font-size: 16px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(100,70,35,0.4);
}

.left-item-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-style: italic;
  color: #4A3020;
  line-height: 1.3;
}

.left-divider {
  width: 100%;
  height: 1px;
  background: rgba(150,110,60,0.2);
  margin: 8px 0;
}

.col-main {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 280px 120px;
  position: relative;
}

.ghost-text {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-52%);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 760px;
  font-weight: 900;
  font-style: italic;
  color: rgba(160,120,70,0.055);
  line-height: 0.85;
  letter-spacing: -0.04em;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 22px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #B8824A;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.main-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 900;
  font-size: 220px;
  line-height: 0.88;
  color: #2E1E0E;
  letter-spacing: -0.025em;
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}

.main-title-italic {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 220px;
  line-height: 0.88;
  font-style: italic;
  color: #B8824A;
  letter-spacing: -0.025em;
  position: relative;
  z-index: 2;
}

.title-rule {
  width: 280px;
  height: 3px;
  background: linear-gradient(90deg, #B8824A, rgba(184,130,74,0.2));
  margin: 52px 0;
  position: relative;
  z-index: 2;
}

.quote-block {
  position: relative;
  z-index: 2;
  max-width: 1400px;
}

.quote-mark {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 240px;
  line-height: 0.6;
  color: rgba(184,130,74,0.18);
  display: block;
  margin-bottom: -20px;
  margin-left: -20px;
}

.quote-text {
  font-family: 'Lora', Georgia, serif;
  font-size: 88px;
  font-style: italic;
  font-weight: 400;
  color: #3A2510;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.quote-text em {
  font-style: normal;
  font-weight: 600;
  color: #B8824A;
}

.col-right {
  width: 620px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 280px 180px 280px 60px;
  position: relative;
}

.right-rule {
  position: absolute;
  top: 200px;
  bottom: 200px;
  left: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(120,85,45,0.18) 10%, rgba(120,85,45,0.18) 90%, transparent);
}

.right-label {
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(100,70,35,0.45);
  margin-bottom: 52px;
}

.right-items {
  display: flex;
  flex-direction: column;
  gap: 42px;
}

.right-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 42px;
  border-bottom: 1px solid rgba(150,110,60,0.18);
}

.right-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.right-item-num {
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  letter-spacing: 0.15em;
  color: #B8824A;
  opacity: 0.7;
}

.right-item-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 30px;
  font-weight: 600;
  color: #2E1E0E;
  line-height: 1.2;
}

.right-item-sub {
  font-family: 'Lora', Georgia, serif;
  font-size: 24px;
  font-style: italic;
  color: rgba(80,50,20,0.55);
  line-height: 1.4;
}

.bottom-label {
  position: absolute;
  bottom: 130px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(100,70,35,0.35);
  white-space: nowrap;
}

.corner {
  position: absolute;
  width: 80px;
  height: 80px;
}
.corner-tl { top: 100px; left: 100px; border-top: 2px solid rgba(150,110,60,0.35); border-left: 2px solid rgba(150,110,60,0.35); }
.corner-tr { top: 100px; right: 100px; border-top: 2px solid rgba(150,110,60,0.35); border-right: 2px solid rgba(150,110,60,0.35); }
.corner-bl { bottom: 100px; left: 100px; border-bottom: 2px solid rgba(150,110,60,0.35); border-left: 2px solid rgba(150,110,60,0.35); }
.corner-br { bottom: 100px; right: 100px; border-bottom: 2px solid rgba(150,110,60,0.35); border-right: 2px solid rgba(150,110,60,0.35); }
</style>
</head>
<body>
<div class="wallpaper">
  <div class="bg-base"></div>
  <div class="bg-lines"></div>
  <div class="bg-vignette"></div>
  <div class="bg-dots"></div>
  <div class="bg-stripe"></div>
  <div class="rule-top"></div>
  <div class="rule-bottom"></div>
  <div class="rule-left"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>
  <div class="content">
    <div class="col-left">
      <div class="left-label">Year of Study</div>
      <div class="left-ornament"></div>
      <div class="left-stacked">
        <div class="left-item">
          <div class="left-item-label">Speciality</div>
          <div class="left-item-value">Paediatrics</div>
        </div>
        <div class="left-item">
          <div class="left-item-label">Role</div>
          <div class="left-item-value">Student Nurse</div>
        </div>
        <div class="left-divider"></div>
        <div class="left-item">
          <div class="left-item-label">Focus</div>
          <div class="left-item-value">OSCEs &amp; Exams</div>
        </div>
      </div>
    </div>
    <div class="col-main">
      <div class="ghost-text">Rn</div>
      <div class="eyebrow">Revision Foundations · Children's Hub</div>
      <div class="main-title">Student</div>
      <div class="main-title-italic">Nurse.</div>
      <div class="title-rule"></div>
      <div class="quote-block">
        <span class="quote-mark">"</span>
        <div class="quote-text">
          Small patients,<br><em>big hearts.</em>
        </div>
      </div>
    </div>
    <div class="col-right">
      <div class="right-rule"></div>
      <div class="right-label">Remember Always</div>
      <div class="right-items">
        <div class="right-item">
          <div class="right-item-num">01</div>
          <div class="right-item-title">Check the 9 Rights</div>
          <div class="right-item-sub">Before every medication</div>
        </div>
        <div class="right-item">
          <div class="right-item-num">02</div>
          <div class="right-item-title">If unsure — ask</div>
          <div class="right-item-sub">No question is too small</div>
        </div>
        <div class="right-item">
          <div class="right-item-num">03</div>
          <div class="right-item-title">Document everything</div>
          <div class="right-item-sub">Immediately after giving</div>
        </div>
        <div class="right-item">
          <div class="right-item-num">04</div>
          <div class="right-item-title">You belong here</div>
          <div class="right-item-sub">Rest, revise, repeat</div>
        </div>
      </div>
    </div>
  </div>
  <div class="bottom-label">Revision Foundations · Medication Safety · Children's Hub · Free Resource</div>
</div>
</body>
</html>
      <section className="pt-28 pb-12 bg-gradient-to-b from-[var(--lilac-soft)] via-[var(--pink-soft)]/30 to-cream relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.2 }} />
        <div className="blob blob-2" style={{ opacity: 0.2 }} />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="hero-title mb-4">
              <span className="gradient-text">Hey, I'm Lauren</span> 👋
            </h1>
            
            <p className="text-[var(--plum-dark)]/70 text-lg">
              Children's nursing student & creator of Revision Foundations
            </p>
          </motion.div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Main Story */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="card">
              <div className="space-y-6 text-[var(--plum-dark)]/80">
                <p>
                  I used to be a medical photographer – spent years in hospitals behind a camera. 
                  It was cool, but it never quite felt like <em>my thing</em>. So at 25, I decided 
                  to make a change and start nursing. Best decision ever.
                </p>
                
                <p>
                  Now I'm a children's nursing student and honestly loving it. But one thing that 
                  drove me mad? Trying to find decent revision resources. Everything was either 
                  boring, outdated, or ridiculously expensive.
                </p>
                <p>
                  So I started making my own. I shared them with my coursemates and they actually 
                  found them useful – that's when I thought... maybe other nursing students need 
                  this too? 💡
                </p>
                <p>
                  That's how Revision Foundations was born – study tools that are actually nice 
                  to look at, made by a student who gets it.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Quick Facts */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: '👶', label: 'Paeds Student' },
                { emoji: '🍒', label: 'Pepsi Max Cherry' },
                { emoji: '💜', label: 'Purple Everything' },
                { emoji: '✨', label: 'Design Nerd' },
              ].map((fact, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/60 rounded-2xl p-4 text-center"
                >
                  <span className="text-2xl block mb-1">{fact.emoji}</span>
                  <span className="text-xs font-medium text-[var(--plum-dark)]/70">{fact.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Promise */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="card-glass text-center">
              <Sparkles className="w-8 h-8 text-[var(--lavender)] mx-auto mb-3" />
              <h2 className="text-lg text-[var(--plum)] mb-4">What you can expect</h2>
              <div className="space-y-2 text-sm text-[var(--plum-dark)]/70">
                <p><strong className="text-[var(--plum)]">No subscriptions</strong> – pay once, yours forever</p>
                <p><strong className="text-[var(--plum)]">Made by a student</strong> – I know the struggle</p>
                <p><strong className="text-[var(--plum)]">Always improving</strong> – I use these tools too!</p>
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-[var(--plum-dark)]/60 text-sm mb-4">
              Questions? Just want to chat? I'd love to hear from you 💜
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn-primary">
                <Heart className="w-4 h-4" />
                Get in Touch
              </Link>
              <Link href="/hub" className="btn-secondary">
                <Sparkles className="w-4 h-4" />
                Explore the Hub
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
