'use client';

import React, {
  useState, useEffect, useCallback, useMemo, FormEvent, useRef, CSSProperties, ReactNode,
} from 'react';
import { motion, useInView, useReducedMotion, useMotionValue, animate, useTransform } from 'framer-motion';
import FitnessLineChart, { type FitnessChartRange } from '@/components/operator/fitness/FitnessLineChart';
import PhotoTimeline from '@/components/operator/fitness/PhotoTimeline';
import HealthMetricsSection, { useHealthStream } from '@/components/operator/health/HealthMetricsSection';
import type { HealthStreamFetch } from '@/components/operator/health/HealthMetricsSection';
import type { FitnessPhotoMilestone } from '@/lib/fitness/types';
import { isPlausibleWeightKg } from '@/lib/fitnessValidation';

// ─── Motion helpers ───────────────────────────────────────────────────────────

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, y = 14, className, id }: { children: ReactNode; delay?: number; y?: number; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const reduce = useReducedMotion();
  if (reduce) {
    return <div ref={ref} id={id} className={className}>{children}</div>;
  }
  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedNumber({ value, decimals = 1, className }: { value: number; decimals?: number; className?: string }) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(reduce ? value : 0);
  const display = useTransform(motionValue, (v) => v.toFixed(decimals));
  useEffect(() => {
    if (reduce) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 1.1, ease: EASE_OUT });
    return controls.stop;
  }, [value, reduce, motionValue]);
  return <motion.span className={className}>{display}</motion.span>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FitnessReading {
  id: string; date: string; weight: number; bmi: number;
  bodyFat: number; water: number; muscleMass: number; boneMass: number;
  visceralFat?: number;
}
interface Reg {
  slope: number; intercept: number; r2: number; t0: number;
}

// Local-timezone YYYY-MM-DD. Avoids toISOString() rolling back a day when
// local clock is past midnight but still before midnight UTC.
function localIsoDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isoDay(value: string): string {
  return value.slice(0, 10);
}

function parseLocalDateInput(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay(value));
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
  }

  return new Date(value);
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  paper:    '#FAFAF8', surface: '#FBF8F3',
  ink:      '#1A1815', body:    '#5A5750', muted: '#9A948C',
  line:     'rgba(26,24,21,0.11)', softLine: 'rgba(26,24,21,0.07)',
  blue:     '#185FA5', blueSoft:  '#EAF1FA',
  green:    '#1C7A67', greenSoft: '#E4F2EC',
  gold:     '#633806', goldSoft:  '#FAEEDA',
  rose:     '#A14A57', roseSoft:  '#F9E8EB',
  display:  "'Playfair Display', Georgia, serif",
  sans:     "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'operator-log-v4';
const AUTH_KEY    = 'operator-log-auth-v3';
const GOAL_KEY    = 'operator-log-goal-v3';
const AUTH_TTL    = 30 * 24 * 60 * 60 * 1000;
const HEIGHT_M    = 1.57;
const DEFAULT_AGE = 30;
const TRAINING_WEEK_ACTIVITY = 1.4;
const MODERATE_DEFICIT_KCAL = 500;

// 110 weekly readings from Aug 2023 → May 2026 (imported from scale CSV)
const SEED: FitnessReading[] = [
  { id:'s1', date:'2023-08-13', weight:77.5, bmi:31.4, bodyFat:43.9, water:40.0, muscleMass:52.6, boneMass:3.4, visceralFat:8.0 },
  { id:'s2', date:'2023-08-20', weight:76.2, bmi:30.9, bodyFat:43.0, water:40.7, muscleMass:53.5, boneMass:3.5, visceralFat:8.0 },
  { id:'s3', date:'2023-08-27', weight:76.5, bmi:31.0, bodyFat:43.0, water:40.7, muscleMass:53.5, boneMass:3.5, visceralFat:8.0 },
  { id:'s4', date:'2023-09-03', weight:75.0, bmi:30.4, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s5', date:'2023-09-09', weight:74.8, bmi:30.3, bodyFat:42.5, water:41.0, muscleMass:54.0, boneMass:3.5, visceralFat:8.0 },
  { id:'s6', date:'2023-09-17', weight:75.1, bmi:30.5, bodyFat:40.3, water:42.6, muscleMass:56.0, boneMass:3.6, visceralFat:8.0 },
  { id:'s7', date:'2023-09-23', weight:73.5, bmi:29.8, bodyFat:42.6, water:41.0, muscleMass:53.9, boneMass:3.5, visceralFat:8.0 },
  { id:'s8', date:'2023-09-30', weight:73.2, bmi:29.7, bodyFat:42.4, water:41.1, muscleMass:54.1, boneMass:3.5, visceralFat:7.0 },
  { id:'s9', date:'2023-10-08', weight:74.3, bmi:30.1, bodyFat:42.4, water:41.1, muscleMass:54.1, boneMass:3.5, visceralFat:8.0 },
  { id:'s10', date:'2023-10-11', weight:72.1, bmi:29.3, bodyFat:42.2, water:41.3, muscleMass:54.2, boneMass:3.6, visceralFat:7.0 },
  { id:'s11', date:'2023-10-22', weight:72.9, bmi:28.8, bodyFat:41.4, water:41.8, muscleMass:55.0, boneMass:3.6, visceralFat:7.0 },
  { id:'s12', date:'2023-10-29', weight:71.3, bmi:28.2, bodyFat:40.9, water:42.2, muscleMass:55.4, boneMass:3.6, visceralFat:7.0 },
  { id:'s13', date:'2023-11-03', weight:73.1, bmi:28.9, bodyFat:41.5, water:41.8, muscleMass:54.9, boneMass:3.6, visceralFat:7.0 },
  { id:'s14', date:'2023-11-12', weight:72.6, bmi:28.7, bodyFat:41.2, water:42.0, muscleMass:55.2, boneMass:3.6, visceralFat:7.0 },
  { id:'s15', date:'2023-11-18', weight:71.7, bmi:28.4, bodyFat:40.8, water:42.3, muscleMass:55.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s16', date:'2023-11-26', weight:72.9, bmi:28.8, bodyFat:40.7, water:42.3, muscleMass:55.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s17', date:'2023-12-01', weight:70.8, bmi:28.0, bodyFat:40.8, water:42.3, muscleMass:55.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s18', date:'2023-12-07', weight:71.5, bmi:28.3, bodyFat:40.9, water:42.2, muscleMass:55.4, boneMass:3.6, visceralFat:7.0 },
  { id:'s19', date:'2023-12-17', weight:72.6, bmi:28.7, bodyFat:41.3, water:41.9, muscleMass:55.1, boneMass:3.6, visceralFat:7.0 },
  { id:'s20', date:'2023-12-24', weight:72.7, bmi:28.8, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s21', date:'2023-12-29', weight:72.1, bmi:28.5, bodyFat:41.0, water:42.1, muscleMass:55.4, boneMass:3.6, visceralFat:7.0 },
  { id:'s22', date:'2024-01-13', weight:72.7, bmi:28.8, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s23', date:'2024-01-18', weight:70.1, bmi:27.7, bodyFat:40.8, water:42.2, muscleMass:55.5, boneMass:3.7, visceralFat:7.0 },
  { id:'s24', date:'2024-01-25', weight:70.7, bmi:28.0, bodyFat:40.7, water:42.3, muscleMass:55.6, boneMass:3.7, visceralFat:7.0 },
  { id:'s25', date:'2024-02-01', weight:72.2, bmi:28.6, bodyFat:41.7, water:41.6, muscleMass:54.7, boneMass:3.6, visceralFat:7.0 },
  { id:'s26', date:'2024-02-14', weight:71.7, bmi:28.4, bodyFat:41.2, water:42.0, muscleMass:55.2, boneMass:3.6, visceralFat:7.0 },
  { id:'s27', date:'2024-03-10', weight:73.4, bmi:29.0, bodyFat:41.8, water:41.6, muscleMass:54.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s28', date:'2024-03-16', weight:72.8, bmi:28.8, bodyFat:41.2, water:42.0, muscleMass:55.2, boneMass:3.6, visceralFat:7.0 },
  { id:'s29', date:'2024-03-24', weight:73.1, bmi:28.9, bodyFat:41.5, water:41.7, muscleMass:54.9, boneMass:3.6, visceralFat:7.0 },
  { id:'s30', date:'2024-03-30', weight:73.4, bmi:29.0, bodyFat:41.8, water:41.5, muscleMass:54.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s31', date:'2024-04-07', weight:75.3, bmi:30.5, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s32', date:'2024-04-11', weight:74.2, bmi:30.1, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s33', date:'2024-04-20', weight:74.0, bmi:30.0, bodyFat:42.4, water:41.1, muscleMass:54.0, boneMass:3.5, visceralFat:8.0 },
  { id:'s34', date:'2024-04-28', weight:71.9, bmi:29.2, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s35', date:'2024-05-05', weight:72.6, bmi:29.5, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s36', date:'2024-05-08', weight:72.1, bmi:29.3, bodyFat:40.3, water:42.6, muscleMass:56.0, boneMass:3.7, visceralFat:7.0 },
  { id:'s37', date:'2024-05-19', weight:71.8, bmi:29.1, bodyFat:41.8, water:41.6, muscleMass:54.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s38', date:'2024-05-26', weight:73.1, bmi:29.7, bodyFat:43.0, water:40.7, muscleMass:53.5, boneMass:3.5, visceralFat:8.0 },
  { id:'s39', date:'2024-06-02', weight:73.2, bmi:29.7, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s40', date:'2024-06-07', weight:71.5, bmi:29.0, bodyFat:41.7, water:41.7, muscleMass:54.7, boneMass:3.6, visceralFat:7.0 },
  { id:'s41', date:'2024-06-23', weight:71.5, bmi:29.0, bodyFat:42.0, water:41.4, muscleMass:54.5, boneMass:3.6, visceralFat:7.0 },
  { id:'s42', date:'2024-06-30', weight:71.2, bmi:28.9, bodyFat:41.7, water:41.6, muscleMass:54.7, boneMass:3.6, visceralFat:7.0 },
  { id:'s43', date:'2024-07-07', weight:71.9, bmi:29.2, bodyFat:42.0, water:41.4, muscleMass:54.4, boneMass:3.6, visceralFat:7.0 },
  { id:'s44', date:'2024-07-14', weight:72.3, bmi:29.3, bodyFat:42.2, water:41.3, muscleMass:54.2, boneMass:3.6, visceralFat:7.0 },
  { id:'s45', date:'2024-07-19', weight:71.9, bmi:29.2, bodyFat:41.8, water:41.5, muscleMass:54.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s46', date:'2024-07-25', weight:73.7, bmi:29.9, bodyFat:42.7, water:40.9, muscleMass:53.8, boneMass:3.5, visceralFat:8.0 },
  { id:'s47', date:'2024-08-03', weight:73.4, bmi:29.8, bodyFat:40.0, water:42.8, muscleMass:56.3, boneMass:3.7, visceralFat:8.0 },
  { id:'s48', date:'2024-08-11', weight:74.0, bmi:30.0, bodyFat:42.7, water:40.9, muscleMass:53.8, boneMass:3.5, visceralFat:8.0 },
  { id:'s49', date:'2024-08-16', weight:71.9, bmi:29.2, bodyFat:41.9, water:41.5, muscleMass:54.6, boneMass:3.6, visceralFat:7.0 },
  { id:'s50', date:'2024-08-23', weight:73.4, bmi:29.8, bodyFat:42.1, water:41.3, muscleMass:54.3, boneMass:3.6, visceralFat:8.0 },
  { id:'s51', date:'2024-09-01', weight:74.8, bmi:30.3, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s52', date:'2024-09-08', weight:74.6, bmi:30.3, bodyFat:42.6, water:41.0, muscleMass:53.9, boneMass:3.5, visceralFat:8.0 },
  { id:'s53', date:'2024-09-14', weight:74.2, bmi:30.1, bodyFat:42.8, water:40.8, muscleMass:53.7, boneMass:3.5, visceralFat:8.0 },
  { id:'s54', date:'2024-09-22', weight:75.5, bmi:30.6, bodyFat:43.1, water:40.6, muscleMass:53.4, boneMass:3.5, visceralFat:8.0 },
  { id:'s55', date:'2024-09-27', weight:74.2, bmi:30.1, bodyFat:42.8, water:40.8, muscleMass:53.7, boneMass:3.5, visceralFat:8.0 },
  { id:'s56', date:'2024-10-06', weight:74.7, bmi:30.3, bodyFat:43.0, water:40.7, muscleMass:53.5, boneMass:3.5, visceralFat:8.0 },
  { id:'s57', date:'2024-10-13', weight:75.1, bmi:30.5, bodyFat:43.4, water:40.4, muscleMass:53.1, boneMass:3.5, visceralFat:8.0 },
  { id:'s58', date:'2024-10-14', weight:75.9, bmi:30.8, bodyFat:42.8, water:40.9, muscleMass:53.7, boneMass:3.5, visceralFat:8.0 },
  { id:'s59', date:'2024-10-23', weight:74.4, bmi:30.2, bodyFat:42.9, water:40.8, muscleMass:53.6, boneMass:3.5, visceralFat:8.0 },
  { id:'s60', date:'2025-03-30', weight:78.0, bmi:31.6, bodyFat:43.8, water:40.1, muscleMass:52.8, boneMass:3.4, visceralFat:8.0 },
  { id:'s61', date:'2025-04-06', weight:76.0, bmi:30.8, bodyFat:43.4, water:40.4, muscleMass:53.1, boneMass:3.5, visceralFat:8.0 },
  { id:'s62', date:'2025-04-12', weight:77.2, bmi:31.3, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s63', date:'2025-04-17', weight:77.2, bmi:31.3, bodyFat:43.9, water:40.1, muscleMass:52.7, boneMass:3.4, visceralFat:8.0 },
  { id:'s64', date:'2025-04-22', weight:78.6, bmi:31.9, bodyFat:43.8, water:40.1, muscleMass:52.7, boneMass:3.4, visceralFat:9.0 },
  { id:'s65', date:'2025-06-22', weight:79.8, bmi:32.4, bodyFat:44.4, water:39.7, muscleMass:52.2, boneMass:3.4, visceralFat:9.0 },
  { id:'s66', date:'2025-06-29', weight:79.6, bmi:32.3, bodyFat:44.4, water:39.7, muscleMass:52.2, boneMass:3.4, visceralFat:9.0 },
  { id:'s67', date:'2025-07-06', weight:80.0, bmi:32.5, bodyFat:44.4, water:39.7, muscleMass:52.2, boneMass:3.4, visceralFat:9.0 },
  { id:'s68', date:'2025-07-13', weight:79.2, bmi:32.1, bodyFat:43.9, water:40.0, muscleMass:52.6, boneMass:3.4, visceralFat:9.0 },
  { id:'s69', date:'2025-07-20', weight:77.8, bmi:31.6, bodyFat:43.8, water:40.1, muscleMass:52.7, boneMass:3.4, visceralFat:8.0 },
  { id:'s70', date:'2025-07-27', weight:81.0, bmi:32.9, bodyFat:44.7, water:39.4, muscleMass:51.9, boneMass:3.4, visceralFat:9.0 },
  { id:'s71', date:'2025-08-03', weight:79.8, bmi:32.4, bodyFat:44.6, water:39.6, muscleMass:52.1, boneMass:3.4, visceralFat:9.0 },
  { id:'s72', date:'2025-08-10', weight:78.8, bmi:32.0, bodyFat:44.2, water:39.8, muscleMass:52.4, boneMass:3.4, visceralFat:9.0 },
  { id:'s73', date:'2025-08-17', weight:79.0, bmi:32.0, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s74', date:'2025-08-24', weight:81.2, bmi:32.9, bodyFat:44.7, water:39.5, muscleMass:51.9, boneMass:3.4, visceralFat:9.0 },
  { id:'s75', date:'2025-08-25', weight:81.8, bmi:33.2, bodyFat:44.9, water:39.3, muscleMass:51.7, boneMass:3.4, visceralFat:9.0 },
  { id:'s76', date:'2025-09-07', weight:82.0, bmi:33.3, bodyFat:44.6, water:39.5, muscleMass:52.0, boneMass:3.4, visceralFat:9.0 },
  { id:'s77', date:'2025-09-14', weight:79.8, bmi:32.4, bodyFat:44.8, water:39.4, muscleMass:51.8, boneMass:3.4, visceralFat:9.0 },
  { id:'s78', date:'2025-09-21', weight:80.4, bmi:32.6, bodyFat:44.4, water:39.7, muscleMass:52.2, boneMass:3.4, visceralFat:9.0 },
  { id:'s79', date:'2025-09-28', weight:81.6, bmi:33.1, bodyFat:44.4, water:39.7, muscleMass:52.2, boneMass:3.4, visceralFat:9.0 },
  { id:'s80', date:'2025-10-05', weight:83.2, bmi:33.8, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s81', date:'2025-10-12', weight:83.6, bmi:33.9, bodyFat:45.7, water:38.7, muscleMass:51.0, boneMass:3.3, visceralFat:9.0 },
  { id:'s82', date:'2025-10-18', weight:82.2, bmi:33.3, bodyFat:45.2, water:39.1, muscleMass:51.4, boneMass:3.3, visceralFat:9.0 },
  { id:'s83', date:'2025-10-22', weight:82.4, bmi:33.4, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s84', date:'2025-11-08', weight:83.0, bmi:33.7, bodyFat:45.5, water:38.9, muscleMass:51.2, boneMass:3.3, visceralFat:9.0 },
  { id:'s85', date:'2025-11-16', weight:82.0, bmi:33.3, bodyFat:45.5, water:38.9, muscleMass:51.2, boneMass:3.3, visceralFat:9.0 },
  { id:'s86', date:'2025-11-23', weight:84.2, bmi:34.2, bodyFat:46.1, water:38.5, muscleMass:50.6, boneMass:3.3, visceralFat:9.0 },
  { id:'s87', date:'2025-11-30', weight:82.4, bmi:33.4, bodyFat:45.6, water:38.9, muscleMass:51.1, boneMass:3.3, visceralFat:9.0 },
  { id:'s88', date:'2025-12-07', weight:83.2, bmi:33.8, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s89', date:'2025-12-14', weight:82.8, bmi:33.6, bodyFat:45.5, water:38.9, muscleMass:51.1, boneMass:3.3, visceralFat:9.0 },
  { id:'s90', date:'2025-12-21', weight:85.0, bmi:34.5, bodyFat:44.0, water:40.0, muscleMass:52.6, boneMass:3.4, visceralFat:10.0 },
  { id:'s91', date:'2025-12-28', weight:85.4, bmi:34.6, bodyFat:46.2, water:38.4, muscleMass:50.5, boneMass:3.3, visceralFat:10.0 },
  { id:'s92', date:'2026-01-04', weight:84.6, bmi:34.3, bodyFat:46.1, water:38.5, muscleMass:50.6, boneMass:3.3, visceralFat:10.0 },
  { id:'s93', date:'2026-01-11', weight:84.6, bmi:34.3, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s94', date:'2026-01-18', weight:84.2, bmi:34.2, bodyFat:45.6, water:38.8, muscleMass:51.1, boneMass:3.3, visceralFat:10.0 },
  { id:'s95', date:'2026-01-25', weight:82.8, bmi:33.6, bodyFat:45.3, water:39.1, muscleMass:51.4, boneMass:3.3, visceralFat:9.0 },
  { id:'s96', date:'2026-02-01', weight:83.0, bmi:33.7, bodyFat:45.7, water:38.7, muscleMass:51.0, boneMass:3.3, visceralFat:9.0 },
  { id:'s97', date:'2026-02-08', weight:83.0, bmi:33.7, bodyFat:45.7, water:38.7, muscleMass:51.0, boneMass:3.3, visceralFat:9.0 },
  { id:'s98', date:'2026-02-13', weight:83.8, bmi:34.0, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s99', date:'2026-03-01', weight:84.4, bmi:34.2, bodyFat:45.8, water:38.7, muscleMass:50.9, boneMass:3.3, visceralFat:10.0 },
  { id:'s100', date:'2026-03-04', weight:83.8, bmi:34.0, bodyFat:45.9, water:38.6, muscleMass:50.8, boneMass:3.3, visceralFat:9.0 },
  { id:'s101', date:'2026-03-15', weight:85.6, bmi:34.7, bodyFat:46.3, water:38.3, muscleMass:50.4, boneMass:3.3, visceralFat:10.0 },
  { id:'s102', date:'2026-03-22', weight:85.4, bmi:34.6, bodyFat:46.4, water:38.3, muscleMass:50.4, boneMass:3.3, visceralFat:10.0 },
  { id:'s103', date:'2026-03-29', weight:87.0, bmi:35.3, bodyFat:46.7, water:38.1, muscleMass:50.1, boneMass:3.2, visceralFat:10.0 },
  { id:'s104', date:'2026-04-05', weight:86.0, bmi:34.9, bodyFat:46.6, water:38.2, muscleMass:50.2, boneMass:3.3, visceralFat:10.0 },
  { id:'s105', date:'2026-04-12', weight:85.6, bmi:34.7, bodyFat:46.3, water:38.3, muscleMass:50.4, boneMass:3.3, visceralFat:10.0 },
  { id:'s106', date:'2026-04-19', weight:87.6, bmi:35.5, bodyFat:47.0, water:37.9, muscleMass:49.8, boneMass:3.2, visceralFat:10.0 },
  { id:'s107', date:'2026-04-26', weight:87.6, bmi:35.5, bodyFat:0.0, water:0.0, muscleMass:0.0, boneMass:0.0, visceralFat:0.0 },
  { id:'s108', date:'2026-05-03', weight:87.4, bmi:35.5, bodyFat:46.9, water:37.9, muscleMass:49.9, boneMass:3.2, visceralFat:10.0 },
  { id:'s109', date:'2026-05-10', weight:87.2, bmi:35.4, bodyFat:46.7, water:38.0, muscleMass:50.0, boneMass:3.2, visceralFat:10.0 },
  { id:'s110', date:'2026-05-17', weight:88.2, bmi:35.8, bodyFat:47.0, water:37.9, muscleMass:49.8, boneMass:3.2, visceralFat:10.0 },
];

// ─── Math ─────────────────────────────────────────────────────────────────────

function regress(readings: FitnessReading[]): Reg | null {
  if (readings.length < 2) return null;
  const t0 = new Date(readings[0].date).getTime();
  const xs = readings.map(r => (new Date(r.date).getTime() - t0) / 86400000);
  const ys = readings.map(r => r.weight);
  const n = xs.length;
  const mx = xs.reduce((a,b)=>a+b,0)/n, my = ys.reduce((a,b)=>a+b,0)/n;
  let num=0, den=0;
  for (let i=0;i<n;i++) { num+=(xs[i]-mx)*(ys[i]-my); den+=(xs[i]-mx)**2; }
  const slope = den ? num/den : 0;
  const intercept = my - slope*mx;
  const ssTot = ys.reduce((a,y)=>a+(y-my)**2,0);
  const ssRes = ys.reduce((a,y,i)=>a+(y-(slope*xs[i]+intercept))**2,0);
  const r2 = ssTot ? 1-ssRes/ssTot : 1;
  return { slope, intercept, r2, t0 };
}

function project(reg: Reg, daysFromStart: number): number {
  return reg.intercept + reg.slope * daysFromStart;
}

function daysFrom(reg: Reg, date: Date): number {
  return (date.getTime() - reg.t0) / 86400000;
}

function goalDate(reg: Reg, goal: number): Date | null {
  if (reg.slope >= 0) return null;
  const days = (goal - reg.intercept) / reg.slope;
  return new Date(reg.t0 + days * 86400000);
}

// ─── Editorial helpers ────────────────────────────────────────────────────────

// Monospace date stamp — "MAY · 17 · 2026".
function dateStamp(iso: string): string {
  const d = parseLocalDateInput(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase()
    .replace(/[ ,]+/g, ' · ');
}

function DateStamp({ iso, style }: { iso: string; style?: CSSProperties }) {
  return (
    <span style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 10.5,
      letterSpacing: '0.18em',
      color: T.muted,
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>{dateStamp(iso)}</span>
  );
}

// Full-width editorial section divider with an eyebrow.
function HeadlineSparkline({
  readings,
  variant = 'compact',
}: {
  readings: FitnessReading[];
  variant?: 'compact' | 'wide';
}) {
  if (readings.length < 2) return null;
  const isWide = variant === 'wide';
  const w = isWide ? 520 : 220;
  const h = isWide ? 68 : 48;
  const pad = isWide ? 12 : 4;
  const ys = readings.map(r => r.weight);
  const yMin = Math.min(...ys) - 0.4;
  const yMax = Math.max(...ys) + 0.4;
  const span = Math.max(yMax - yMin, 0.1);
  const xs = readings.map((_, i) => pad + (i / (readings.length - 1)) * (w - pad * 2));
  const ypts = readings.map(r => pad + (1 - (r.weight - yMin) / span) * (h - pad * 2));
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ypts[i].toFixed(1)}`).join(' ');
  return (
    <div className={`fit-hero-spark ${isWide ? 'fit-hero-spark-wide' : ''}`}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <path d={path} fill="none" stroke={T.ink} strokeWidth={isWide ? '1.55' : '1.1'} strokeLinejoin="round" strokeLinecap="round" />
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ypts[i]} r={isWide ? (i === readings.length - 1 ? 4.4 : 3.4) : (i === readings.length - 1 ? 3 : 2.2)} fill={T.paper} stroke={T.ink} strokeWidth={isWide ? '1.2' : '0.8'} />
            {i === readings.length - 1 && <circle cx={x} cy={ypts[i]} r={isWide ? '1.9' : '1.3'} fill={T.ink} />}
          </g>
        ))}
      </svg>
      <div className="fit-hero-spark-axis">
        {readings.map((r, i) => (
          <span key={i} className={i === readings.length - 1 ? 'is-latest' : ''}>
            {r.weight.toFixed(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

function EditorialDivider({ eyebrow, note, style }: { eyebrow: string; note?: string; style?: CSSProperties }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      gap: 18,
      margin: '40px 0 22px',
      ...style,
    }}>
      <span style={{
        fontFamily: T.sans,
        fontSize: 9.5,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        fontWeight: 600,
        color: T.ink,
      }}>{eyebrow}</span>
      <span style={{ height: 0.5, background: T.line, display: 'block' }} />
      {note ? (
        <span style={{
          fontFamily: T.display,
          fontStyle: 'italic',
          fontSize: 13,
          color: T.muted,
        }}>{note}</span>
      ) : <span />}
    </div>
  );
}

function CollapsibleSection({ eyebrow, note, children, defaultOpen = false, dividerStyle }: {
  eyebrow: string;
  note?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  dividerStyle?: CSSProperties;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `op-collapsible-${eyebrow.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        alignItems: 'center',
        gap: 18,
        margin: '40px 0 22px',
        ...dividerStyle,
      }}>
        <span style={{
          fontFamily: T.sans,
          fontSize: 9.5,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: T.ink,
        }}>{eyebrow}</span>
        <span style={{ height: 0.5, background: T.line, display: 'block' }} />
        {note ? (
          <span style={{
            fontFamily: T.display,
            fontStyle: 'italic',
            fontSize: 13,
            color: T.muted,
          }}>{note}</span>
        ) : <span />}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            padding: '4px 0 4px 14px',
            fontFamily: T.sans,
            fontSize: 9.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: T.muted,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          <span>{open ? 'Hide' : 'Show'}</span>
          <span
            aria-hidden
            style={{
              fontSize: 11,
              lineHeight: 1,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 180ms ease',
              display: 'inline-block',
            }}
          >
            ▾
          </span>
        </button>
      </div>
      <div id={contentId} hidden={!open}>
        {children}
      </div>
    </>
  );
}

// Auto-generated italic intention line — reads current state aloud.
function intentionLine(state: State, latest: FitnessReading, goal: number): string {
  const delta = latest.weight - goal;
  const weeks = state.weeksAtCurrent;
  const trend = state.trendKgPerWeek;

  if (delta <= 0) {
    return weeks >= 4
      ? 'At goal. Holding the line.'
      : 'At goal. The work was the steady part.';
  }
  if (state.direction === 'losing-fast') {
    return trend < -0.7
      ? 'Moving — but watch the pace. Patience compounds.'
      : 'Quietly moving. Trust the line, not the morning.';
  }
  if (state.direction === 'losing-slow') {
    return weeks >= 3
      ? `Patient. Steady. ${weeks} weeks of slow, useful work.`
      : 'Patient. The slow line is the honest one.';
  }
  if (state.direction === 'stable') {
    return weeks >= 4
      ? `Held for ${weeks} weeks. The plateau is information.`
      : 'Steady. Sometimes that is the day\'s job.';
  }
  if (state.direction === 'gaining') {
    return trend > 0.5
      ? 'Drifted up. Not a failure — a signal.'
      : 'A small drift. Two clean days settles it.';
  }
  return 'Reading the line, not the scale.';
}

function HeroIntention({ state, latest, goal }: { state: State; latest: FitnessReading; goal: number }) {
  return (
    <p style={{
      fontFamily: T.display,
      fontStyle: 'italic',
      fontSize: 17,
      lineHeight: 1.45,
      color: T.ink,
      margin: '14px 0 0',
      maxWidth: '42ch',
      opacity: 0.85,
    }}>{intentionLine(state, latest, goal)}</p>
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtDate(iso: string, opts: { long?: boolean } = {}) {
  const d = parseLocalDateInput(iso);
  if (opts.long) return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDateObj(d: Date) {
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function weightStatus(w: number, goal: number): [string, string] {
  if (w <= goal) return ['At goal', T.green];
  return ['Above goal', T.gold];
}
function bmiStatus(b: number): [string, string] {
  if (b < 18.5) return ['Below healthy range', T.gold];
  if (b < 25)   return ['Healthy range', T.green];
  if (b < 30)   return ['Above healthy range', T.gold];
  if (b < 35)   return ['Above healthy range', T.rose];
  return ['Clinical risk range', T.rose];
}
function fatStatus(f: number): [string, string] {
  if (f < 21) return ['Below typical', T.gold];
  if (f < 33) return ['Healthy range', T.green];
  if (f < 39) return ['Above target', T.gold];
  return ['Above healthy range', T.rose];
}
function waterStatus(w: number): [string, string] {
  if (w < 45) return ['Below target', T.gold];
  return ['Healthy range', T.green];
}
function muscleStatus(m: number): [string, string] {
  if (m >= 45) return ['Strong', T.green];
  if (m >= 38) return ['Within range', T.gold];
  return ['Below average', T.gold];
}
function boneStatus(b: number): [string, string] {
  if (b >= 3.0) return ['Healthy range', T.green];
  return ['Below typical', T.gold];
}

function nutritionTargets(reading: FitnessReading) {
  const bmr = Math.round(10 * reading.weight + 6.25 * HEIGHT_M * 100 - 5 * DEFAULT_AGE - 161);
  const activeTdee = Math.round(bmr * TRAINING_WEEK_ACTIVITY);
  const intake = Math.round((activeTdee - MODERATE_DEFICIT_KCAL) / 20) * 20;
  const maintenance = Math.round(activeTdee / 20) * 20;
  const protein = Math.round(reading.weight * 1.8);

  return { bmr, activeTdee, intake, maintenance, protein };
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const kStyle: CSSProperties = {
  fontFamily: T.sans, fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: T.muted,
};
const CARD_SHADOW = '0 24px 60px rgba(26,24,21,0.05)';

function Kicker({ children, color, style }: { children: React.ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ ...kStyle, color: color ?? T.muted, ...style }}>{children}</div>;
}
function Rule({ weight=0.5, style }: { weight?: number; style?: CSSProperties }) {
  return <div style={{ borderTop:`${weight}px solid ${T.line}`, ...style }} />;
}
function ThickRule({ style }: { style?: CSSProperties }) {
  return <div style={{ borderTop:`2px solid ${T.ink}`, ...style }} />;
}
function AccordionPanel({
  kicker,
  title,
  summary,
  children,
  defaultOpen = false,
  style,
}: {
  kicker: string;
  title: string;
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  style?: CSSProperties;
}) {
  return (
    <details
      open={defaultOpen}
      style={{
        border: `1px solid ${T.line}`,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(251,248,243,0.96) 100%)',
        padding: '0 20px',
        ...style,
      }}
    >
      <summary style={{ cursor: 'pointer', padding: '18px 0 16px' }}>
        <Kicker style={{ marginBottom: 8 }}>{kicker}</Kicker>
        <div style={{ fontFamily: T.display, fontStyle: 'italic', fontSize: 18, color: T.ink, marginBottom: 6 }}>
          {title}
        </div>
        <p style={{ fontFamily: T.sans, fontSize: 12, color: T.body, fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: '52ch' }}>
          {summary}
        </p>
      </summary>
      <div style={{ padding: '0 0 20px' }}>
        <Rule style={{ marginBottom: 18 }} />
        {children}
      </div>
    </details>
  );
}
function Wrap({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ maxWidth:1120, margin:'0 auto', padding:'clamp(28px, 4vw, 56px) clamp(16px, 4vw, 40px) 120px', ...style }}>
      {children}
    </div>
  );
}
function ScrollRail({
  children, minWidth, style, innerStyle,
}: {
  children: React.ReactNode;
  minWidth?: number | string;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
}) {
  return (
    <div style={{ overflowX:'auto', paddingBottom:6, scrollbarWidth:'thin', ...style }}>
      <div style={{ minWidth, ...innerStyle }}>
        {children}
      </div>
    </div>
  );
}

// ─── State assessment (drives adaptive content across tabs) ────────────────

interface State {
  daysSinceWeighIn: number;
  weighInStatus: 'today' | 'on-time' | 'due-soon' | 'overdue';
  trendKgPerWeek: number;           // last 4 readings
  trendKgPerWeek8: number;          // last 8 readings
  direction: 'gaining' | 'stable' | 'losing-slow' | 'losing-fast';
  thisWeekTarget: number;           // recommended weight 7 days from latest
  phaseNum: number;
  phaseName: string;
  phaseColor: string;
  weeksAtCurrent: number;           // weeks since last significant change
  best: { weight: number; date: string };
  peak: { weight: number; date: string };
}

function assessState(sorted: FitnessReading[], goal: number, todayIso: string = localIsoDate()): State {
  const latest = sorted[sorted.length - 1];
  const today = parseLocalDateInput(todayIso);
  const latestDate = parseLocalDateInput(latest.date);
  const daysSince = Math.max(0, Math.round((today.getTime() - latestDate.getTime()) / 86400000));
  const status: State['weighInStatus'] =
    daysSince === 0 ? 'today' : daysSince <= 5 ? 'on-time' : daysSince <= 7 ? 'due-soon' : 'overdue';

  const last4 = sorted.slice(-4);
  const last8 = sorted.slice(-8);
  const trend4 = last4.length >= 2
    ? (last4[last4.length - 1].weight - last4[0].weight) / Math.max(1, last4.length - 1)
    : 0;
  const trend8 = last8.length >= 2
    ? (last8[last8.length - 1].weight - last8[0].weight) / Math.max(1, last8.length - 1)
    : 0;

  let direction: State['direction'];
  if (trend4 > 0.2)      direction = 'gaining';
  else if (trend4 > -0.1) direction = 'stable';
  else if (trend4 > -0.6) direction = 'losing-slow';
  else                    direction = 'losing-fast';

  // Recommended this-week target: −0.45 kg (moderate cut)
  const thisWeekTarget = Math.round((latest.weight - 0.45) * 10) / 10;

  // Phase derivation by weight band
  let phaseNum: number, phaseName: string, phaseColor: string;
  if (latest.weight > 80)      { phaseNum = 1; phaseName = 'The Cut';                phaseColor = T.rose; }
  else if (latest.weight > 78) { phaseNum = 2; phaseName = 'Diet Break';             phaseColor = T.gold; }
  else if (latest.weight > 70) { phaseNum = 3; phaseName = 'Cut Continued';          phaseColor = T.rose; }
  else if (latest.weight > 68) { phaseNum = 4; phaseName = 'Diet Break #2';          phaseColor = T.gold; }
  else if (latest.weight > 65) { phaseNum = 5; phaseName = 'Recomposition';          phaseColor = T.blue; }
  else if (latest.weight > goal) { phaseNum = 6; phaseName = 'Final Cut';            phaseColor = T.rose; }
  else                          { phaseNum = 7; phaseName = 'Maintenance';           phaseColor = T.green; }

  // Weeks at "current" level — within 1 kg of latest reading
  let weeksAtCurrent = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (Math.abs(sorted[i].weight - latest.weight) <= 1.0) weeksAtCurrent++;
    else break;
  }

  // Best (lowest) and peak (highest)
  const sortedByWeight = [...sorted].sort((a, b) => a.weight - b.weight);
  const best = sortedByWeight[0];
  const peak = sortedByWeight[sortedByWeight.length - 1];

  return {
    daysSinceWeighIn: daysSince,
    weighInStatus: status,
    trendKgPerWeek: trend4,
    trendKgPerWeek8: trend8,
    direction,
    thisWeekTarget,
    phaseNum,
    phaseName,
    phaseColor,
    weeksAtCurrent,
    best: { weight: best.weight, date: best.date },
    peak: { weight: peak.weight, date: peak.date },
  };
}

// ─── Status Strip (always-visible context bar) ────────────────────────────────

function StatusStrip({ state, latest, goal, setTab }: {
  state: State; latest: FitnessReading; goal: number; setTab: (t: string) => void;
}) {
  const wiColor = state.weighInStatus === 'overdue' ? T.rose
                : state.weighInStatus === 'due-soon' ? T.gold
                : T.green;
  const wiText  = state.weighInStatus === 'today' ? 'TODAY'
                : state.weighInStatus === 'on-time' ? `${state.daysSinceWeighIn}D AGO`
                : state.weighInStatus === 'due-soon' ? `DUE SOON · ${state.daysSinceWeighIn}D`
                : `OVERDUE · ${state.daysSinceWeighIn}D`;

  const trendColor = state.trendKgPerWeek > 0.1 ? T.rose
                  : state.trendKgPerWeek < -0.1 ? T.green
                  : T.gold;
  const trendLabel = state.trendKgPerWeek > 0.1 ? 'GAINING'
                  : state.trendKgPerWeek < -0.1 ? 'LOSING'
                  : 'STABLE';

  const cells = [
    {
      kicker: 'Latest weigh-in',
      value: `${latest.weight}`, unit: 'kg', sub: wiText, subColor: wiColor,
      onClick: () => setTab('Overview'),
    },
    {
      kicker: 'This week → target',
      value: `${state.thisWeekTarget}`, unit: 'kg', sub: '−0.45 kg pace', subColor: T.gold,
      onClick: () => setTab('Plan'),
    },
    {
      kicker: 'Current phase',
      value: `${state.phaseNum}`, unit: state.phaseName.toUpperCase(),
      sub: state.phaseName, subColor: state.phaseColor,
      onClick: () => setTab('Projections'),
    },
    {
      kicker: 'Last 4 weeks',
      value: `${state.trendKgPerWeek >= 0 ? '+' : ''}${state.trendKgPerWeek.toFixed(2)}`,
      unit: 'kg/wk', sub: trendLabel, subColor: trendColor,
      onClick: () => setTab('Health'),
    },
  ];

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:16, flexWrap:'wrap', marginBottom:12 }}>
        <div>
          <Kicker style={{ marginBottom: 4 }}>At a glance</Kicker>
          <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, margin:0, maxWidth:'48ch' }}>
            These are the four numbers worth checking before you dig into any of the deeper tabs.
          </p>
        </div>
        <Kicker color={T.muted}>Goal · {goal.toFixed(1)} kg</Kicker>
      </div>
      <ScrollRail minWidth={760}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(170px, 1fr))', gap:12 }}>
          {cells.map((c, i) => (
            <button key={i} onClick={c.onClick} style={{
              padding:'16px 16px 14px',
              border:`1px solid ${T.line}`,
              background:'rgba(255,255,255,0.76)',
              cursor:'pointer',
              textAlign:'left',
              fontFamily:T.sans,
            }}>
              <Kicker style={{ marginBottom:8, fontSize:9 }}>{c.kicker}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
                <span style={{ fontFamily:T.display, fontSize:24, color:T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{c.value}</span>
                <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted, letterSpacing:'0.1em', textTransform:'uppercase' }}>{c.unit}</span>
              </div>
              <span style={{ fontFamily:T.sans, fontSize:10, fontWeight:600, letterSpacing:'0.14em', color:c.subColor, textTransform:'uppercase' }}>{c.sub}</span>
            </button>
          ))}
        </div>
      </ScrollRail>
    </div>
  );
}

function AnalyticsSection({
  latest,
  sorted,
  goal,
  nutrition,
  state,
  healthStream,
}: {
  latest: FitnessReading;
  sorted: FitnessReading[];
  goal: number;
  nutrition: { bmr: number; activeTdee: number; intake: number; maintenance: number; protein: number };
  state: State;
  healthStream?: HealthStreamFetch;
}) {
  const healthDays = healthStream?.days;

  const remainingWeight = Math.max(0, latest.weight - goal);
  const dailyDeficit = nutrition.activeTdee - nutrition.intake;
  const weeklyDeficit = dailyDeficit * 7;
  const expectedLoss = weeklyDeficit > 0 ? weeklyDeficit / 7700 : 0;
  const expectedTrend = -0.45;
  const trendDifference = Number.isFinite(state.trendKgPerWeek)
    ? state.trendKgPerWeek - expectedTrend
    : NaN;
  const trendComparison = !Number.isFinite(state.trendKgPerWeek)
    ? 'Not enough trend data yet'
    : trendDifference >= 0
    ? `${trendDifference.toFixed(2)} kg/wk slower than target`
    : `${Math.abs(trendDifference).toFixed(2)} kg/wk faster than target`;
  const trendDirection = latest.weight <= goal
    ? 'At goal or below'
    : state.trendKgPerWeek < 0
    ? 'Moving toward goal'
    : state.trendKgPerWeek > 0
    ? 'Moving away from goal'
    : 'Trend is flat';
  const eta = state.trendKgPerWeek < -0.05 && remainingWeight > 0
    ? new Date(new Date(latest.date).getTime() + (remainingWeight / Math.abs(state.trendKgPerWeek)) * 7 * 86400000)
    : null;
  const etaLabel = remainingWeight <= 0
    ? 'Goal reached'
    : eta
    ? fmtDateObj(eta)
    : 'Not enough trend data yet';
  const deficitStatus = !Number.isFinite(dailyDeficit)
    ? 'Not enough data yet'
    : dailyDeficit <= 0
    ? 'Maintenance likely'
    : dailyDeficit < 200
    ? 'Deficit too small'
    : dailyDeficit > 900
    ? 'Deficit too aggressive'
    : 'On track';
  const deficitTone = dailyDeficit <= 0
    ? T.gold
    : dailyDeficit < 200
    ? T.rose
    : dailyDeficit > 900
    ? T.rose
    : T.green;

  // ── Chart data: last ~12 weeks of weekly-binned weights ──────────────────
  const weightTrendPoints = useMemo(() => {
    const recent = sorted.slice(-84); // ~12 weeks of daily-ish readings
    return recent.map((r, i) => ({ x: i, w: r.weight, date: r.date }));
  }, [sorted]);

  const proteinTarget = Math.round(latest.weight * 1.8);
  // Actual protein intake comes from Apple Health (MFP-fed), not the target.
  const todayIso = localIsoDate();
  const todayHealth = healthDays?.find((d) => d.date.slice(0, 10) === todayIso) ?? healthDays?.[healthDays.length - 1];
  const proteinIntake = todayHealth?.nutrition?.proteinG ?? null;
  const proteinPct = proteinTarget > 0 && proteinIntake !== null ? Math.min(1.2, proteinIntake / proteinTarget) : 0;
  const proteinNote = proteinIntake === null
    ? 'Awaiting Apple Health / MyFitnessPal protein log'
    : proteinPct >= 1
      ? 'Target met today'
      : proteinPct >= 0.85
        ? 'Close to target'
        : 'Needs another protein feed';
  const proteinSourceLabel = !todayHealth
    ? 'Awaiting sync'
    : todayHealth.date.slice(0, 10) === todayIso
      ? 'Logged today'
      : `Latest log ${formatReferenceDate(todayHealth.date)}`;

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{
        background: `linear-gradient(180deg, ${T.paper} 0%, rgba(251,248,243,0.94) 100%)`,
        border: `0.5px solid ${T.line}`,
        padding: '22px 22px 24px',
      }}>
        <div className="fit-panel-head" style={{ marginBottom: 18, padding: 0, borderBottom: 'none' }}>
          <div>
            <h3 style={{ fontSize: 24 }}>Performance <em>analysis</em></h3>
            <div className="meta" style={{ fontSize: 12 }}>
              Deficit, weight trend, and protein support — at a glance.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>

          {/* ── Card 1: Weight trend vs goal ── */}
          <AnalysisCard
            label="Weight trend"
            headline={`${latest.weight.toFixed(1)} kg`}
            sub={`${state.trendKgPerWeek >= 0 ? '+' : ''}${state.trendKgPerWeek.toFixed(2)} kg/wk · target ${etaLabel}`}
            tone={latest.weight <= goal ? 'good' : state.trendKgPerWeek < -0.05 ? 'good' : 'warn'}
          >
            <MiniLineChart
              points={weightTrendPoints.map((p) => p.w)}
              goal={goal}
              color={T.gold}
              height={148}
            />
            <AnalysisStats
              rows={[
                ['To goal', `${remainingWeight.toFixed(1)} kg`],
                ['Direction', trendDirection],
                ['vs target rate', trendComparison],
              ]}
            />
          </AnalysisCard>

          {/* ── Card 2: Energy balance ── */}
          <AnalysisCard
            label="Energy balance"
            headline={dailyDeficit > 0 ? `${dailyDeficit.toLocaleString()} kcal` : 'Setup'}
            sub={`${deficitStatus} · expected ${expectedLoss.toFixed(2)} kg/wk loss`}
            tone={dailyDeficit > 0 && dailyDeficit < 900 && dailyDeficit >= 200 ? 'good' : 'warn'}
          >
            <BalanceBars
              maintenance={nutrition.activeTdee}
              intake={nutrition.intake}
              deficit={Math.max(0, dailyDeficit)}
              height={148}
            />
            <AnalysisStats
              rows={[
                ['Maintenance', `${nutrition.activeTdee.toLocaleString()} kcal`],
                ['Target intake', `${nutrition.intake.toLocaleString()} kcal`],
                ['Weekly deficit', weeklyDeficit > 0 ? `${weeklyDeficit.toLocaleString()} kcal` : '—'],
              ]}
            />
          </AnalysisCard>

          {/* ── Card 3: Protein vs target ── */}
          <AnalysisCard
            label="Protein support"
            headline={proteinIntake !== null ? `${Math.round(proteinIntake)} g` : '—'}
            sub={`${proteinNote} · ${proteinTarget} g target (1.8 g/kg)`}
            tone={proteinIntake === null ? 'neutral' : proteinPct >= 1 ? 'good' : proteinPct >= 0.85 ? 'neutral' : 'warn'}
          >
            <ProteinGauge current={proteinIntake} target={proteinTarget} />
            <AnalysisStats
              rows={[
                [proteinSourceLabel, proteinIntake !== null ? `${Math.round(proteinIntake)} g` : '—'],
                ['Target', `${proteinTarget} g`],
                ['Daily kcal', `${nutrition.intake.toLocaleString()} kcal`],
                ['Coverage', proteinIntake !== null ? `${Math.round(proteinPct * 100)}% of target` : 'Awaiting macro sync'],
              ]}
            />
          </AnalysisCard>

        </div>
      </div>
    </section>
  );
}

// ─── Analysis card helpers ────────────────────────────────────────────────────

function AnalysisCard({
  label, headline, sub, tone, children,
}: {
  label: string; headline: string; sub: string; tone: 'good' | 'warn' | 'neutral';
  children: React.ReactNode;
}) {
  const toneColor = tone === 'good' ? T.green : tone === 'warn' ? T.rose : T.muted;
  return (
    <article style={{
      background: 'rgba(255,255,255,0.72)', border: `0.5px solid ${T.line}`, padding: '22px 22px 18px',
      display: 'flex', flexDirection: 'column', gap: 14, minHeight: 320,
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, color: T.muted }}>{label}</span>
        <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: toneColor, fontWeight: 600 }}>
          {tone === 'good' ? 'On track' : tone === 'warn' ? 'Needs review' : 'Steady'}
        </span>
      </header>
      <div>
        <div style={{ fontFamily: T.display, fontSize: 34, color: T.ink, lineHeight: 0.98, letterSpacing: '-0.015em' }}>{headline}</div>
        <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.body, marginTop: 7, lineHeight: 1.6 }}>{sub}</div>
      </div>
      {children}
    </article>
  );
}

function AnalysisStats({ rows }: { rows: [string, string][] }) {
  return (
    <dl style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px',
      margin: 0, paddingTop: 12, borderTop: `0.5px solid ${T.softLine}`,
    }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gridColumn: rows.length === 3 && k === rows[2][0] ? '1 / -1' : undefined }}>
          <dt style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted }}>{k}</dt>
          <dd style={{ margin: 0, fontFamily: T.sans, fontSize: 12.5, color: T.ink, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function MiniLineChart({ points, goal, color, height }: { points: number[]; goal?: number; color: string; height: number }) {
  const width = 320;
  if (points.length < 2) {
    return <div style={{ height, fontFamily: T.sans, fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Not enough data yet</div>;
  }
  const min = Math.min(...points, goal ?? Infinity);
  const max = Math.max(...points, goal ?? -Infinity);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const yFor = (v: number) => height - ((v - min) / range) * (height - 10) - 5;
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${yFor(v).toFixed(1)}`).join(' ');
  const goalY = goal !== undefined ? yFor(goal) : null;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      {goalY !== null && (
        <>
          <line x1={0} x2={width} y1={goalY} y2={goalY} stroke={T.green} strokeWidth={0.5} strokeDasharray="3 3" />
          <text x={width - 2} y={goalY - 4} textAnchor="end" fontSize={9} fill={T.green} fontFamily={T.sans} letterSpacing="0.08em">GOAL {goal?.toFixed(1)}</text>
        </>
      )}
      <path d={path} fill="none" stroke={color} strokeWidth={1.25} strokeLinejoin="round" />
      <circle cx={(points.length - 1) * step} cy={yFor(points[points.length - 1])} r={2.5} fill={color} />
    </svg>
  );
}

function MiniColumnChart({ values, labels, color, height, formatValue }: {
  values: number[]; labels: string[]; color: string; height: number;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '4px 0' }}>
      {values.map((v, i) => {
        const pct = (v / max) * 100;
        const isToday = i === values.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div
                title={`${labels[i]}: ${formatValue ? formatValue(v) : v}`}
                style={{
                  width: '100%',
                  height: `${Math.max(pct, v > 0 ? 4 : 0)}%`,
                  background: v > 0 ? color : T.softLine,
                  opacity: isToday ? 1 : v > 0 ? 0.55 : 1,
                  borderTop: isToday && v > 0 ? `1.5px solid ${T.gold}` : undefined,
                }}
              />
            </div>
            <span style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '0.1em', color: isToday ? T.ink : T.muted, fontWeight: isToday ? 600 : 400 }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function BalanceBars({ maintenance, intake, deficit, height }: { maintenance: number; intake: number; deficit: number; height: number }) {
  const max = Math.max(maintenance, intake, 1);
  const rows: [string, number, string][] = [
    ['Maintenance', maintenance, T.muted],
    ['Intake', intake, T.gold],
    ['Deficit', deficit, deficit > 0 ? T.green : T.rose],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height, justifyContent: 'center' }}>
      {rows.map(([label, value, color]) => {
        const pct = label === 'Deficit' ? (value / max) * 100 : (value / max) * 100;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.sans, fontSize: 11 }}>
            <span style={{ width: 76, color: T.muted, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 9.5 }}>{label}</span>
            <div style={{ flex: 1, height: 10, background: T.softLine, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${Math.min(100, pct)}%`, background: color, opacity: 0.85 }} />
            </div>
            <span style={{ width: 70, textAlign: 'right', color: T.ink, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{Math.round(value).toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}

function ProteinGauge({ current, target }: { current: number | null; target: number }) {
  const logged = current ?? 0;
  const pct = current !== null && target > 0 ? Math.min(1.2, logged / target) : 0;
  const fillPct = Math.min(100, pct * 100);
  const overTarget = pct > 1;
  const color = pct >= 1 ? T.green : pct >= 0.85 ? T.gold : T.rose;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', height: 148 }}>
      <div style={{ position: 'relative', height: 14, background: T.softLine }}>
        <div style={{ position: 'absolute', inset: 0, width: `${fillPct}%`, background: color, opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: -3, bottom: -3, left: '100%', width: 1.5, background: T.ink, opacity: 0.5 }}
          title={`Target ${target} g`} />
        <div style={{ position: 'absolute', top: -14, left: '100%', transform: 'translateX(-50%)', fontFamily: T.sans, fontSize: 9, letterSpacing: '0.12em', color: T.muted, textTransform: 'uppercase' }}>Target</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.sans, fontSize: 10.5, color: T.body }}>
        <span>0 g</span>
        <span style={{ color: overTarget ? T.green : T.ink, fontWeight: 600 }}>
          {current !== null ? `${Math.round(current)} g logged` : 'Awaiting sync'}
        </span>
        <span>{Math.max(target, logged).toFixed(0)} g</span>
      </div>
    </div>
  );
}

function CommandDeck({ state, latest, goal, reg, cloudOk, syncing, setCompose, setTab }: {
  state: State;
  latest: FitnessReading;
  goal: number;
  reg: Reg | null;
  cloudOk: boolean | null;
  syncing: boolean;
  setCompose: (open: boolean) => void;
  setTab: (tab: string) => void;
}) {
  const remaining = Math.max(0, latest.weight - goal);
  const moderateEta = new Date(new Date(latest.date).getTime() + (remaining / 0.45) * 7 * 86400000);
  const syncLabel = cloudOk === null ? 'Local-first mode' : cloudOk ? syncing ? 'Cloud syncing now' : 'Cloud sync active' : 'Local backup only';
  const syncColor = cloudOk ? T.green : cloudOk === false ? T.gold : T.muted;
  const focus = state.weighInStatus === 'overdue'
    ? {
        label: 'Reading overdue',
        copy: `${state.daysSinceWeighIn} days since the last weigh-in. File the number before interpreting anything else.`,
        color: T.rose,
        soft: T.roseSoft,
      }
    : state.direction === 'gaining'
    ? {
        label: 'Trend is rising',
        copy: `The last four readings are up ${state.trendKgPerWeek.toFixed(2)} kg per week. Tighten the plan before drift becomes the new baseline.`,
        color: T.rose,
        soft: T.roseSoft,
      }
    : state.direction === 'stable'
    ? {
        label: 'Plateau window',
        copy: 'The line is flat enough to intervene cleanly. Use the plan tab and restart the moderate deficit this week.',
        color: T.gold,
        soft: T.goldSoft,
      }
    : {
        label: 'Momentum recovered',
        copy: 'The line is finally moving in the right direction. Protect consistency and keep the weekly rhythm boring.',
        color: T.green,
        soft: T.greenSoft,
      };

  const callouts = [
    {
      kicker: 'To goal',
      value: `${remaining.toFixed(1)} kg`,
      sub: `${latest.weight.toFixed(1)} now → ${goal.toFixed(1)} target`,
      color: T.ink,
    },
    {
      kicker: 'Moderate-cut ETA',
      value: moderateEta.toLocaleDateString('en-GB', { month:'short', year:'numeric' }),
      sub: 'Assumes 0.45 kg per week',
      color: T.gold,
    },
    {
      kicker: 'Regression confidence',
      value: reg ? `${Math.round(reg.r2 * 100)}% R²` : 'Need more data',
      sub: reg ? `${(reg.slope * 7).toFixed(2)} kg per week slope` : 'Add more readings',
      color: reg && reg.slope < 0 ? T.green : T.body,
    },
  ];

  return (
    <div style={{
      background:'linear-gradient(135deg, rgba(251,248,243,0.98) 0%, rgba(255,255,255,0.92) 100%)',
      border:`1px solid ${T.line}`,
      boxShadow:CARD_SHADOW,
      padding:'clamp(20px, 4vw, 30px)',
      marginBottom:28,
    }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20 }}>
        <div>
          <Kicker style={{ marginBottom:10 }}>This week&apos;s focus</Kicker>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 12px', background:focus.soft, color:focus.color, marginBottom:14 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:focus.color }} />
            <span style={{ fontFamily:T.sans, fontSize:10, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase' }}>{focus.label}</span>
          </div>
          <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.ink, lineHeight:1.25, margin:'0 0 12px', maxWidth:'16ch' }}>
            See the signal first, then act on it.
          </p>
          <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:0, maxWidth:'58ch' }}>
            {focus.copy}
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:18 }}>
            {[
              { label:'File reading', action:() => setCompose(true), solid:true },
              { label:'Open plan', action:() => setTab('Plan') },
              { label:'Open ledger', action:() => setTab('Ledger') },
            ].map((action) => (
              <button key={action.label} onClick={action.action} style={{
                background: action.solid ? T.ink : 'transparent',
                color: action.solid ? T.paper : T.ink,
                border: `1px solid ${action.solid ? T.ink : T.line}`,
                cursor:'pointer',
                padding:'11px 16px',
                fontFamily:T.sans,
                fontSize:10,
                fontWeight:600,
                letterSpacing:'0.14em',
                textTransform:'uppercase',
              }}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          border:`1px solid ${T.line}`,
          background:'rgba(255,255,255,0.78)',
          padding:'18px 18px 16px',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, marginBottom:14, flexWrap:'wrap' }}>
            <Kicker>Quick status</Kicker>
            <Kicker color={syncColor}>{syncLabel}</Kicker>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:10 }}>
            <div>
              <Kicker style={{ marginBottom:5 }}>Latest</Kicker>
              <div style={{ fontFamily:T.display, fontSize:22, color:T.ink, lineHeight:1 }}>{latest.weight.toFixed(1)} kg</div>
            </div>
            <div>
              <Kicker style={{ marginBottom:5 }}>Phase</Kicker>
              <div style={{ fontFamily:T.display, fontSize:22, color:state.phaseColor, lineHeight:1 }}>{state.phaseNum}</div>
            </div>
            <div>
              <Kicker style={{ marginBottom:5 }}>Next target</Kicker>
              <div style={{ fontFamily:T.display, fontSize:22, color:T.gold, lineHeight:1 }}>{state.thisWeekTarget.toFixed(1)} kg</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginTop:18 }}>
        {callouts.map((item) => (
          <div key={item.kicker} style={{ border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.72)', padding:'14px 16px' }}>
            <Kicker style={{ marginBottom:8 }}>{item.kicker}</Kicker>
            <div style={{ fontFamily:T.display, fontSize:22, color:item.color, letterSpacing:'-0.02em', lineHeight:1.05, marginBottom:4 }}>{item.value}</div>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.body }}>{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── This Week (top of Overview - actionable) ────────────────────────────────

function ThisWeek({ state, latest, setCompose, setTab }: {
  state: State; latest: FitnessReading;
  setCompose: (b: boolean) => void; setTab: (t: string) => void;
}) {
  const overdue = state.weighInStatus === 'overdue';
  const targetDelta = state.thisWeekTarget - latest.weight;

  const verdict = state.direction === 'gaining'
    ? { title: 'Stop the gain', sub: 'Break the upward trend.', color: T.rose }
    : state.direction === 'stable'
    ? { title: 'Hold steady', sub: 'Initiate moderate deficit.', color: T.gold }
    : state.direction === 'losing-slow'
    ? { title: 'On track', sub: 'Stay the course.', color: T.green }
    : { title: 'Slow down', sub: 'Protect muscle mass.', color: T.blue };

  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.line}`,
      padding: '20px 24px', marginBottom: 32,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:24, flexWrap:'wrap', marginBottom:16 }}>
        <div>
          <Kicker style={{ marginBottom:6 }}>This Week · {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' })}</Kicker>
          <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:22, color: verdict.color, letterSpacing:'-0.01em', lineHeight:1.1, margin:'0 0 4px' }}>
            <em>{verdict.title}</em>
          </h2>
          <p style={{ fontFamily:T.sans, fontSize:12, fontWeight:300, color:T.body, margin:0, lineHeight:1.5, maxWidth:'40ch' }}>{verdict.sub}</p>
        </div>
        <button onClick={() => setCompose(true)} style={{
          background: overdue ? T.rose : T.ink, color: T.paper, border: 0, cursor:'pointer',
          padding:'10px 20px', fontFamily:T.sans, fontSize:10, fontWeight:500,
          letterSpacing:'0.15em', textTransform:'uppercase', whiteSpace:'nowrap',
        }}>
          {overdue ? 'File overdue reading →' : 'File this week →'}
        </button>
      </div>

      <Rule style={{ margin:'0 0 16px' }} />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:12 }}>
        <div style={{ padding:'14px 16px', border:`0.5px solid ${T.line}`, background:'rgba(255,255,255,0.58)' }}>
          <Kicker style={{ marginBottom:6 }}>Next Monday Goal</Kicker>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ fontFamily:T.display, fontSize:24, color:T.gold, letterSpacing:'-0.01em', lineHeight:1 }}>{state.thisWeekTarget}</span>
            <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>kg</span>
          </div>
          <span style={{ fontFamily:T.sans, fontSize:10, color:T.green, fontWeight:500 }}>
            {targetDelta.toFixed(2)} kg
          </span>
        </div>
        <div style={{ padding:'14px 16px', border:`0.5px solid ${T.line}`, background:'rgba(255,255,255,0.58)' }}>
          <Kicker style={{ marginBottom:6 }}>Last weigh-in</Kicker>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ fontFamily:T.display, fontSize:24, color:T.ink, letterSpacing:'-0.01em', lineHeight:1 }}>{state.daysSinceWeighIn}</span>
            <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>{state.daysSinceWeighIn === 1 ? 'day' : 'days'} ago</span>
          </div>
          <span style={{ fontFamily:T.sans, fontSize:10, fontWeight:500, color: overdue ? T.rose : T.green }}>
            {overdue ? 'OVERDUE' : 'On schedule'}
          </span>
        </div>
        <div style={{ padding:'14px 16px', border:`0.5px solid ${T.line}`, background:'rgba(255,255,255,0.58)' }}>
          <Kicker style={{ marginBottom:6 }}>Today&apos;s priority</Kicker>
          <button onClick={() => setTab('Plan')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, textAlign:'left' }}>
            <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.ink, lineHeight:1.3, marginBottom:2 }}>
              See the plan →
            </div>
            <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted, fontWeight:500, letterSpacing:'0.05em' }}>
              Five non-negotiables
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Journey Story (auto-generated narrative) ────────────────────────────────

function JourneyStory({ sorted, state, showHeader = true }: { sorted: FitnessReading[]; state: State; showHeader?: boolean }) {
  const first = sorted[0];
  const latest = sorted[sorted.length - 1];
  const daysObserved = Math.round((new Date(latest.date).getTime() - new Date(first.date).getTime()) / 86400000);
  const totalWeeks = Math.round(daysObserved / 7);
  const fromBest = latest.weight - state.best.weight;
  const fromPeak = state.peak.weight - latest.weight;

  const events = [
    {
      kicker: `${fmtDate(first.date)}`,
      title: `${first.weight} kg`,
      copy: `Starting line. BMI ${first.bmi}, Fat ${first.bodyFat}%.`,
    },
    {
      kicker: `${fmtDate(state.best.date)}`,
      title: `${state.best.weight} kg · Low`,
      copy: `Achieved lowest weight.`,
    },
    {
      kicker: `${fmtDate(state.peak.date)}`,
      title: `${state.peak.weight} kg · Peak`,
      copy: `${(state.peak.weight - state.best.weight).toFixed(1)} kg above low.`,
    },
    {
      kicker: `${fmtDate(latest.date)} · Today`,
      title: `${latest.weight} kg`,
      copy: `${fromBest > 0 ? `+${fromBest.toFixed(1)}` : fromBest.toFixed(1)} kg from low, ${fromPeak > 0 ? `−${fromPeak.toFixed(1)}` : `+${(-fromPeak).toFixed(1)}`} kg from peak.`,
    },
  ];

  return (
    <div>
      {showHeader && (
        <>
          <Kicker style={{ marginBottom: 8 }}>The Arc</Kicker>
          <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:22, letterSpacing:'-0.01em', lineHeight:1.1, color:T.ink, margin:'0 0 4px' }}>
            {totalWeeks} weeks observed.
          </h2>
          <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:13, color:T.muted, margin:'0 0 0' }}>
            Four key moments.
          </p>
          <Rule style={{ margin: '14px 0 0' }} />
        </>
      )}
      <div style={{ borderBottom: `0.5px solid ${T.line}` }}>
        {events.map((e, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'120px 1fr', gap:24,
            padding:'14px 0', borderBottom: i < events.length - 1 ? `0.5px solid ${T.softLine}` : 'none',
            alignItems:'baseline',
          }}>
            <Kicker color={i === events.length - 1 ? T.gold : T.muted}>{e.kicker}</Kicker>
            <div>
              <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color: i === events.length - 1 ? T.gold : T.ink, marginBottom:4 }}>
                {e.title}
              </div>
              <p style={{ fontFamily:T.sans, fontSize:12, fontWeight:300, color:T.body, lineHeight:1.5, margin:0, maxWidth:'50ch' }}>{e.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Adaptive Plan Opener ────────────────────────────────────────────────────

function PlanOpener({ state, sorted, setTab }: { state: State; sorted: FitnessReading[]; setTab: (t: string) => void }) {
  const latest = sorted[sorted.length - 1];

  const briefs = {
    'gaining': {
      label: 'PRIORITY · BREAK TREND',
      title: 'Stop the gain.',
      copy: `Trend: +${state.trendKgPerWeek.toFixed(2)} kg/wk. Track intake for 7 days.`,
      action: 'Track current intake. No deficit yet.',
      color: T.rose, bg: T.roseSoft,
    },
    'stable': {
      label: 'PRIORITY · BEGIN CUT',
      title: 'Initiate cut.',
      copy: `Trend: ${state.trendKgPerWeek >= 0 ? '+' : ''}${state.trendKgPerWeek.toFixed(2)} kg/wk. Drop intake by 500 kcal.`,
      action: 'Hit five non-negotiables.',
      color: T.gold, bg: T.goldSoft,
    },
    'losing-slow': {
      label: 'PRIORITY · STAY COURSE',
      title: 'Maintain line.',
      copy: `Trend: −${Math.abs(state.trendKgPerWeek).toFixed(2)} kg/wk. Sustainable zone.`,
      action: 'Continue current approach.',
      color: T.green, bg: T.greenSoft,
    },
    'losing-fast': {
      label: 'PRIORITY · SLOW DOWN',
      title: 'Ease deficit.',
      copy: `Trend: −${Math.abs(state.trendKgPerWeek).toFixed(2)} kg/wk. High risk of muscle loss.`,
      action: 'Raise intake by 200 kcal/day.',
      color: T.blue, bg: T.blueSoft,
    },
  } as const;

  const b = briefs[state.direction];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ background: b.bg, borderLeft: `2px solid ${b.color}`, padding: '20px 24px' }}>
        <Kicker color={b.color} style={{ marginBottom: 8 }}>{b.label}</Kicker>
        <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:22, letterSpacing:'-0.01em', lineHeight:1.1, color:T.ink, margin:'0 0 8px' }}>
          {b.title}
        </h2>
        <p style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.5, margin:'0 0 14px', maxWidth:'50ch' }}>
          {b.copy}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:10, borderTop:`0.5px solid ${b.color}33` }}>
          <Kicker color={b.color}>Action:</Kicker>
          <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.ink }}>{b.action}</span>
        </div>
      </div>

      <div style={{ display:'flex', gap:16, marginTop:12, flexWrap:'wrap' }}>
        <button onClick={() => setTab('Projections')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:9, fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:2 }}>
            Phase plan →
        </button>
        <button onClick={() => setTab('Health')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:9, fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:2 }}>
            Health panel →
        </button>
        <button onClick={() => setTab('Overview')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:9, fontWeight:500, letterSpacing:'0.2em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:2 }}>
            Overview →
        </button>
      </div>
    </div>
  );
}

// ─── Auto-detected phases from the data ─────────────────────────────────────

interface PhaseBand {
  start: string; end: string; name: string; color: string; soft: string;
}

function detectPhases(sorted: FitnessReading[]): PhaseBand[] {
  if (sorted.length < 4) return [];
  // Manual but data-anchored phases for the imported history
  const bands: PhaseBand[] = [
    { start: '2023-08-13', end: '2023-12-01', name: 'LEAN PHASE',     color: T.green, soft: T.greenSoft },
    { start: '2023-12-02', end: '2024-10-31', name: 'MAINTENANCE',     color: T.blue,  soft: T.blueSoft  },
    { start: '2025-03-30', end: sorted[sorted.length-1].date,
      name: 'DRIFT',          color: T.gold,  soft: T.goldSoft },
  ];
  return bands.filter(b => new Date(b.start) <= new Date(sorted[sorted.length-1].date));
}

// ─── SVG smooth-path helper (Catmull-Rom → Bezier) ────────────────────────────

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// ─── Phase-Banded Chart (the centrepiece) ────────────────────────────────────

function PhaseChart({ sorted, goal, range = 'all' }: {
  sorted: FitnessReading[]; goal: number; range?: 'all' | '5y' | '2y' | '1y' | '6m';
}) {
  if (sorted.length < 2) return null;

  const lastMs = new Date(sorted[sorted.length-1].date).getTime();
  const cutoffMap: Record<string, number> = {
    '5y':  5 * 365, '2y': 2 * 365, '1y': 365, '6m': 180,
  };
  const cutoffDays = cutoffMap[range];
  const filtered = cutoffDays
    ? sorted.filter(r => (lastMs - new Date(r.date).getTime()) / 86400000 <= cutoffDays)
    : sorted;
  if (filtered.length < 2) return null;

  const W = 980, H = 380;
  const PAD = { top: 50, right: 80, bottom: 56, left: 56 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const t0 = new Date(filtered[0].date).getTime();
  const tEnd = lastMs;
  const span = tEnd - t0 || 1;

  const xS = (ms: number) => PAD.left + ((ms - t0) / span) * iW;
  const ys = filtered.map(r => r.weight);
  const yMin = Math.floor(Math.min(...ys, goal) - 2);
  const yMax = Math.ceil(Math.max(...ys) + 3);
  const yS = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * iH;

  // Smoothed trend (45-day rolling avg)
  const smoothed = filtered.map((r, i) => {
    const targetMs = new Date(r.date).getTime();
    const windowMs = 22.5 * 86400000;
    const inWin = filtered.filter(x => {
      const xm = new Date(x.date).getTime();
      return xm >= targetMs - windowMs && xm <= targetMs + windowMs;
    });
    const avg = inWin.reduce((s, x) => s + x.weight, 0) / inWin.length;
    return { date: r.date, weight: avg };
  });

  const pts = filtered.map(r => [xS(new Date(r.date).getTime()), yS(r.weight)] as [number,number]);
  const smoothPts = smoothed.map(r => [xS(new Date(r.date).getTime()), yS(r.weight)] as [number,number]);
  const rawPath = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const smoothD = smoothPath(smoothPts);

  // Phase bands
  const phases = detectPhases(filtered).filter(p => {
    const startMs = new Date(p.start).getTime();
    const endMs = new Date(p.end).getTime();
    return endMs >= t0 && startMs <= tEnd;
  });

  // Pinned events
  const minR = [...filtered].sort((a,b)=>a.weight-b.weight)[0];
  const maxR = [...filtered].sort((a,b)=>b.weight-a.weight)[0];
  const today = filtered[filtered.length-1];
  const pins = [
    { r: maxR,   label: 'Peak weight',  show: maxR !== today },
    { r: minR,   label: 'Leanest point', show: minR !== today },
    { r: today,  label: 'Today',        show: true },
  ].filter(p => p.show);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block' }}>
        {/* Phase bands */}
        {phases.map((p, i) => {
          const sx = Math.max(PAD.left, xS(Math.max(new Date(p.start).getTime(), t0)));
          const ex = Math.min(PAD.left+iW, xS(Math.min(new Date(p.end).getTime(), tEnd)));
          if (ex - sx < 4) return null;
          return (
            <g key={i}>
              <rect x={sx} y={PAD.top} width={ex-sx} height={iH} fill={p.soft} opacity="0.5" />
              <text x={sx+8} y={PAD.top+16} fontFamily={T.sans} fontSize="9" fontWeight="600" letterSpacing="0.22em" fill={p.color}>
                {p.name}
              </text>
            </g>
          );
        })}

        {/* Goal zone */}
        <rect x={PAD.left} y={yS(goal)} width={iW} height={PAD.top+iH-yS(goal)} fill={T.goldSoft} opacity="0.35" />

        {/* Y-axis ticks */}
        {[yMin, Math.round((yMin+yMax)/2), yMax].map((v,i)=>(
          <g key={i}>
            <line x1={PAD.left} y1={yS(v)} x2={PAD.left+iW} y2={yS(v)} stroke={T.softLine} strokeWidth="0.5" strokeDasharray="2,3" />
            <text x={PAD.left-6} y={yS(v)+4} textAnchor="end" fontFamily={T.sans} fontSize="10" fill={T.muted}>{v.toFixed(1)}</text>
          </g>
        ))}

        {/* Goal line */}
        <line x1={PAD.left} y1={yS(goal)} x2={PAD.left+iW} y2={yS(goal)} stroke={T.gold} strokeWidth="1" strokeDasharray="6,4" />
        <text x={PAD.left+iW+4} y={yS(goal)+4} fontFamily={T.sans} fontSize="10" fill={T.gold} fontWeight="500">GOAL {goal}</text>

        {/* Raw readings (faint) */}
        <path d={rawPath} fill="none" stroke={T.ink} strokeWidth="0.5" opacity="0.25" strokeDasharray="2,2" />

        {/* Smoothed trend (the main line) */}
        <path d={smoothD} fill="none" stroke={T.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Pinned events */}
        {pins.map((p, i) => {
          const x = xS(new Date(p.r.date).getTime());
          const y = yS(p.r.weight);
          const isToday = p.label === 'Today';
          const color = isToday ? T.gold : T.muted;
          return (
            <g key={i}>
              <line x1={x} y1={PAD.top} x2={x} y2={PAD.top+iH} stroke={color} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.6" />
              <circle cx={x} cy={y} r="4" fill={color} stroke={T.paper} strokeWidth="1.5" />
              <text x={x} y={PAD.top-22} textAnchor={x > W-150 ? 'end' : 'middle'} fontFamily={T.display} fontStyle="italic" fontSize="12" fill={T.ink}>
                {p.label}
              </text>
              <text x={x} y={PAD.top-8} textAnchor={x > W-150 ? 'end' : 'middle'} fontFamily={T.sans} fontSize="9.5" fill={T.muted} letterSpacing="0.05em">
                {p.r.weight.toFixed(1)}kg
              </text>
            </g>
          );
        })}

        {/* X-axis label (range) */}
        <text x={PAD.left} y={H-12} fontFamily={T.sans} fontSize="10" fill={T.muted}>
          {new Date(filtered[0].date).toLocaleDateString('en-GB', { month:'short', year:'numeric' })}
        </text>
        <text x={PAD.left+iW} y={H-12} textAnchor="end" fontFamily={T.sans} fontSize="10" fill={T.muted}>
          {new Date(filtered[filtered.length-1].date).toLocaleDateString('en-GB', { month:'short', year:'numeric' })}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display:'flex', gap:24, fontFamily:T.sans, fontSize:10, color:T.muted, letterSpacing:'0.04em', marginTop:8, flexWrap:'wrap' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          <span style={{ display:'inline-block', width:18, borderTop:`1px dashed ${T.ink}`, opacity:0.4 }} />
          Daily readings
        </span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
          <span style={{ display:'inline-block', width:18, borderTop:`2px solid ${T.gold}` }} />
          45-day trend
        </span>
        {detectPhases(sorted).map(p => (
          <span key={p.name} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <span style={{ display:'inline-block', width:14, height:10, background:p.soft }} />
            {p.name.toLowerCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Top Stat Strip (6 cells with deltas) ────────────────────────────────────

function TopStatStrip({ sorted, state }: { sorted: FitnessReading[]; state: State }) {
  const latest = sorted[sorted.length-1];
  // 30 days ago for delta calc
  const targetMs = new Date(latest.date).getTime() - 30 * 86400000;
  const monthAgo = sorted.reduce((best, r) => {
    const diff = Math.abs(new Date(r.date).getTime() - targetMs);
    const bestDiff = Math.abs(new Date(best.date).getTime() - targetMs);
    return diff < bestDiff ? r : best;
  }, sorted[0]);

  const dFat = latest.bodyFat - monthAgo.bodyFat;
  const dMuscle = latest.muscleMass - monthAgo.muscleMass;
  const dWater = latest.water - monthAgo.water;

  const { bmr, activeTdee } = nutritionTargets(latest);

  // Discipline score: how many of last 14 days had a reading?
  const last14ms = new Date(latest.date).getTime() - 14 * 86400000;
  const last14 = sorted.filter(r => new Date(r.date).getTime() >= last14ms).length;
  const discipline = Math.min(100, Math.round((last14 / 14) * 100));

  const cells = [
    { kicker:'BODY FAT',    value:`${latest.bodyFat.toFixed(1)}%`, sub:`${dFat>=0?'+':''}${dFat.toFixed(1)} in 30 days`, color: dFat<0?T.green:T.rose },
    { kicker:'MUSCLE MASS', value:`${latest.muscleMass.toFixed(1)}%`, sub:`${dMuscle>=0?'+':''}${dMuscle.toFixed(1)} since last month`, color: dMuscle>0?T.green:T.rose },
    { kicker:'VISCERAL FAT',value:`${latest.visceralFat ?? '—'}`,   sub:'target ≤ 9', color: (latest.visceralFat||0) > 9 ? T.gold : T.green },
    { kicker:'BMR',         value:`${bmr.toLocaleString()}`,        sub:`Active TDEE ${activeTdee.toLocaleString()}`, color: T.body },
    { kicker:'WATER',       value:`${latest.water.toFixed(1)}%`,    sub: latest.water < 45 ? 'Low · drink up' : 'On range', color: latest.water < 45 ? T.gold : T.green },
    { kicker:'DISCIPLINE',  value:`${discipline}/100`,              sub:`${last14}/14 days logged`, color: discipline >= 80 ? T.green : discipline >= 50 ? T.gold : T.rose },
  ];

  return (
    <ScrollRail minWidth={980} style={{ marginBottom:32 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6, minmax(150px, 1fr))', borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}` }}>
        {cells.map((c,i) => (
          <div key={i} style={{ padding:'14px 16px', borderRight: i<5 ? `0.5px solid ${T.softLine}` : 'none' }}>
            <Kicker style={{ marginBottom:7, fontSize:8.5 }}>{c.kicker}</Kicker>
            <div style={{ fontFamily:T.display, fontSize:24, color:T.ink, letterSpacing:'-0.015em', lineHeight:1, marginBottom:5 }}>{c.value}</div>
            <span style={{ fontFamily:T.sans, fontSize:10, color:c.color, fontWeight:500 }}>{c.sub}</span>
          </div>
        ))}
      </div>
    </ScrollRail>
  );
}

// ─── Current Goal Card ───────────────────────────────────────────────────────

function GoalCard({ state, latest, goal }: { state: State; latest: FitnessReading; goal: number }) {
  const weeks = Math.max(0, (latest.weight - goal) / 0.45);
  const projectedGoalDate = new Date(new Date(latest.date).getTime() + weeks * 7 * 86400000);
  const { intake } = nutritionTargets(latest);
  const progressBase = Math.max(state.peak.weight, latest.weight);
  const progress = progressBase <= goal ? 100 : Math.max(0, Math.min(100, ((progressBase - latest.weight) / (progressBase - goal)) * 100));
  const onTrack = state.direction !== 'gaining' && state.weighInStatus !== 'overdue';

  return (
    <div style={{ padding:'16px 18px', border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.96)', boxShadow:CARD_SHADOW }}>
      <div style={{ marginBottom:10, display:'flex', justifyContent:'space-between', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:T.muted, fontWeight:600 }}>
          Current goal
        </span>
        <FitPill color={onTrack ? T.green : T.rose} background={onTrack ? T.greenSoft : T.roseSoft}>
          {onTrack ? 'On track' : 'Needs reset'}
        </FitPill>
      </div>

      <div style={{ fontFamily:T.display, fontSize:30, color:T.ink, letterSpacing:'-0.02em', lineHeight:1, marginBottom:4 }}>
        {goal.toFixed(1)}kg <em style={{ color:T.gold, fontStyle:'italic', fontSize:24 }}>working line</em>
      </div>
      <div style={{ fontFamily:T.sans, fontSize:11.5, color:T.muted, letterSpacing:'0.02em', marginBottom:14 }}>
        Moderate-cut ETA · {projectedGoalDate.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
      </div>

      <div style={{ height:6, background:T.surface, borderRadius:999, overflow:'hidden', marginBottom:8, position:'relative' }}>
        <span style={{
          display:'block',
          width:`${progress}%`,
          height:'100%',
          background:`linear-gradient(90deg, ${T.gold} 0%, ${T.green} 100%)`,
        }} />
        <span style={{ position:'absolute', right:0, top:-2, width:2, height:10, background:T.ink }} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
        {[
          { label:'To goal', value:`${(latest.weight - goal).toFixed(1)}kg` },
          { label:'This week', value:`${state.thisWeekTarget.toFixed(1)}kg` },
          { label:'Intake plan', value:`${intake.toLocaleString()} kcal` },
          { label:'Best low', value:`${state.best.weight.toFixed(1)}kg` },
        ].map((item) => (
          <div key={item.label}>
            <div style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.20em', textTransform:'uppercase', color:T.muted, fontWeight:600, marginBottom:4 }}>
              {item.label}
            </div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12, color:T.ink }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── This Week 7-day Grid ───────────────────────────────────────────────────

function ThisWeekGrid({ sorted, state, showHeader = true }: { sorted: FitnessReading[]; state: State; showHeader?: boolean }) {
  const latest = sorted[sorted.length-1];
  const todayDate = new Date(latest.date);
  // Monday of this week
  const dow = todayDate.getDay();
  const monday = new Date(todayDate);
  monday.setDate(todayDate.getDate() - (dow === 0 ? 6 : dow - 1));

  const days: Array<{ label:string; iso:string; reading: FitnessReading | undefined; delta:number|null; isToday:boolean; isFuture:boolean }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0,10);
    const reading = sorted.find(r => r.date.slice(0,10) === iso);
    const dayLabel = d.toLocaleDateString('en-GB', { weekday:'short' }).toUpperCase();
    const dayNum = d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
    days.push({
      label: dayLabel,
      iso: dayNum,
      reading,
      delta: null, // we calc below
      isToday: iso === latest.date.slice(0,10),
      isFuture: d > todayDate,
    });
  }
  // Compute deltas vs previous day's reading (using sorted array)
  for (let i = 0; i < days.length; i++) {
    if (days[i].reading) {
      const prev = i > 0 ? days[i-1].reading : sorted[sorted.indexOf(days[i].reading!) - 1];
      if (prev) days[i].delta = days[i].reading!.weight - prev.weight;
    }
  }

  return (
    <div>
      {showHeader && (
        <>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
            <Kicker>This week · scale rhythm, deltas and training context</Kicker>
            <Kicker color={T.muted}>Mon {monday.toLocaleDateString('en-GB',{day:'numeric'})} – Sun {days[6].iso}</Kicker>
          </div>
          <ThickRule style={{ marginBottom:0 }} />
        </>
      )}
      <ScrollRail minWidth={840}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(110px, 1fr))', borderTop:showHeader ? 'none' : `1px solid ${T.softLine}`, borderBottom:`0.5px solid ${T.line}` }}>
          {days.map((d, i) => (
            <div key={i} style={{
              padding:'13px 12px',
              borderRight: i<6 ? `1px solid ${T.softLine}` : 'none',
              background: d.isToday ? T.goldSoft : d.reading ? 'transparent' : T.surface,
              opacity: d.isFuture ? 0.45 : d.reading ? 1 : 0.72,
              minHeight:118,
            }}>
              <div style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:T.muted, fontWeight:700, marginBottom:4 }}>
                {d.label}
              </div>
              <div style={{ fontFamily:T.sans, fontSize:11, color:T.body, marginBottom:12 }}>{d.iso}</div>
              {d.reading ? (
                <>
                  <div style={{ fontFamily:T.display, fontSize:24, color:d.isToday ? T.gold : T.ink, lineHeight:1, marginBottom:6 }}>
                    {d.reading.weight.toFixed(1)}<small style={{ fontFamily:T.sans, fontSize:11, color:T.muted, marginLeft:3 }}>kg</small>
                  </div>
                  {d.delta !== null && (
                    <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:10, color: d.delta > 0 ? T.rose : d.delta < 0 ? T.green : T.muted }}>
                      {d.delta > 0 ? '+' : d.delta < 0 ? '−' : ''}{Math.abs(d.delta).toFixed(1)}
                    </div>
                  )}
                  <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:10, color:T.muted, marginTop:6 }}>
                    {d.isToday ? 'today' : 'logged'}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.muted }}>—</div>
                  <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:10, color:T.muted, marginTop:8 }}>{d.isFuture ? 'to come' : 'no log'}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollRail>
    </div>
  );
}

// ─── Phase Log (timeline) ───────────────────────────────────────────────────

function PhaseLog({ sorted, showHeader = true }: { sorted: FitnessReading[]; showHeader?: boolean }) {
  const entries = [
    {
      title: 'The drift',
      sub: 'Mar 2025 – present',
      months: 14,
      startKg: 76.0,
      endKg: sorted[sorted.length-1].weight,
      delta: sorted[sorted.length-1].weight - 76.0,
      color: T.gold,
      current: true,
    },
    {
      title: 'Long maintenance',
      sub: 'Dec 2023 – Oct 2024',
      months: 11,
      startKg: 72.1,
      endKg: 74.4,
      delta: 2.3,
      color: T.blue,
      current: false,
    },
    {
      title: 'The first lean phase',
      sub: 'Aug – Nov 2023',
      months: 4,
      startKg: 77.5,
      endKg: 70.8,
      delta: -6.7,
      color: T.green,
      current: false,
    },
  ];

  return (
    <div>
      {showHeader && (
        <>
          <Kicker style={{ marginBottom:10 }}>Phase log</Kicker>
          <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:24, fontStyle:'italic', color:T.ink, margin:'0 0 6px' }}>
            The story: rise, collapse, rebuild, discipline.
          </h3>
          <ThickRule style={{ margin:'18px 0 0' }} />
        </>
      )}
      <div style={{ borderTop:showHeader ? 'none' : `1px solid ${T.softLine}`, borderBottom:`0.5px solid ${T.line}` }}>
        {entries.map((e, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'8px minmax(190px, 1.4fr) repeat(4, minmax(78px, 0.6fr))',
            borderBottom: i<entries.length-1 ? `1px solid ${T.softLine}` : 'none',
            gap:12, alignItems:'center',
            background: e.current ? T.goldSoft : 'transparent',
            padding:'14px 18px',
            fontSize:12,
            color:T.body,
          }}>
            <div style={{ background:e.color, width:8, height:28, borderRadius:2 }} />
            <div>
              <div style={{ fontFamily:T.display, fontSize:16, color:T.ink, marginBottom:3 }}>
                {e.title}{e.current && <em style={{ color:e.color, fontSize:14, marginLeft:6 }}>— current</em>}
              </div>
              <div style={{ fontFamily:T.sans, color:T.muted, fontSize:11, marginTop:3 }}>{e.sub}</div>
            </div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12, color:T.body }}>{e.months} months</div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12, color:T.body }}>{e.startKg.toFixed(1)}kg start</div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12, color:T.body }}>{e.endKg.toFixed(1)}kg {e.current ? 'now' : 'end'}</div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:12, color: e.delta > 0 ? T.rose : T.green, textAlign:'right' }}>
              {e.delta > 0 ? '+' : ''}{e.delta.toFixed(1)}kg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Command Notes (auto-generated observations) ─────────────────────────────

function CommandNotes({ sorted, state, latest }: { sorted: FitnessReading[]; state: State; latest: FitnessReading }) {
  const notes: string[] = [];
  if (latest.water < 45) notes.push(`Water is the obvious lever today: ${latest.water.toFixed(1)}% reads low against the muscle-mass signal.`);
  if (state.direction === 'gaining') notes.push(`Weight is up over the past month. The drift period is still active — recomposition or a deliberate cut is the next move.`);
  if (state.weighInStatus === 'overdue') notes.push(`Last weigh-in was ${state.daysSinceWeighIn} days ago. The data goes stale fast — file today's reading.`);
  notes.push(`The graph should be read as trend plus context, not emotion from a single morning.`);

  return (
    <div style={{ marginTop:32, padding:'22px 26px', background:T.surface, border:`0.5px solid ${T.line}` }}>
      <Kicker style={{ marginBottom:14 }}>Command notes</Kicker>
      {notes.map((n,i)=>(
        <p key={i} style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, margin: i<notes.length-1 ? '0 0 12px' : 0 }}>
          {n}
        </p>
      ))}
    </div>
  );
}

// ─── Apple Health / Import note ───────────────────────────────────────────────

function ImportNote({ opPw, onImported }: { opPw: string; onImported: () => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    if (!file || state === 'uploading') return
    setState('uploading')
    setMessage('Reading Apple Health export…')

    const result = await apiImportAppleHealth(opPw, file)
    if (!result.ok) {
      setState('err')
      setMessage(result.message)
      return
    }

    await onImported()
    setState('ok')
    setMessage(result.message)
  }

  return (
    <div style={{ marginTop:48, padding:'24px 28px', background:T.surface, border:`0.5px solid ${T.line}` }}>
      <Kicker style={{ marginBottom:12 }}>Data sources · Apple Health</Kicker>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.ink, margin:'0 0 12px' }}>
        Apple Health now has a working import path here.
      </p>
      <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.7, margin:'0 0 12px' }}>
        Safari can&apos;t read HealthKit directly, so the browser-safe route is to export your Apple Health data and import the body measurements into this ledger.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:14, margin:'18px 0 22px' }}>
        <label style={{ display:'block', padding:'16px 18px', border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.78)' }}>
          <Kicker style={{ marginBottom:8 }}>Upload export.xml</Kicker>
          <input
            type="file"
            accept=".xml,text/xml"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setState('idle')
              setMessage('')
            }}
            style={{ display:'block', width:'100%', fontFamily:T.sans, fontSize:12, color:T.body }}
          />
          <p style={{ fontFamily:T.sans, fontSize:11, color:T.muted, lineHeight:1.6, margin:'10px 0 0' }}>
            Use the extracted <code>export.xml</code> file from Apple Health. Zip upload isn&apos;t supported yet.
          </p>
        </label>

        <div style={{ padding:'16px 18px', border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.78)' }}>
          <Kicker style={{ marginBottom:8 }}>Import status</Kicker>
          <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.ink, margin:'0 0 8px' }}>
            {file ? file.name : 'No file selected yet.'}
          </p>
          <button
            type="button"
            onClick={handleImport}
            disabled={!file || state === 'uploading'}
            style={{
              background: !file || state === 'uploading' ? T.muted : T.ink,
              color: T.paper,
              border: 0,
              cursor: !file || state === 'uploading' ? 'not-allowed' : 'pointer',
              padding:'12px 16px',
              fontFamily:T.sans,
              fontSize:10,
              fontWeight:600,
              letterSpacing:'0.16em',
              textTransform:'uppercase',
              opacity: !file || state === 'uploading' ? 0.7 : 1,
            }}
          >
            {state === 'uploading' ? 'Importing…' : 'Import Apple Health'}
          </button>
          {message && (
            <p style={{ fontFamily:T.sans, fontSize:11, color: state === 'err' ? T.rose : state === 'ok' ? T.green : T.body, lineHeight:1.6, margin:'10px 0 0' }}>
              {message}
            </p>
          )}
        </div>
      </div>

      <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
        <li style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, paddingLeft:20, position:'relative' }}>
          <span style={{ position:'absolute', left:0, color:T.gold, fontFamily:T.display, fontStyle:'italic' }}>i.</span>
          <strong style={{ color:T.ink, fontWeight:500 }}>Apple Health export.</strong> In the Health app, open your profile and choose <em>Export All Health Data</em>. This importer reads body weight, BMI, body fat, lean mass, body water mass, and bone mass when those samples exist, then derives the dashboard-friendly fields it can.
        </li>
        <li style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, paddingLeft:20, position:'relative' }}>
          <span style={{ position:'absolute', left:0, color:T.gold, fontFamily:T.display, fontStyle:'italic' }}>ii.</span>
          <strong style={{ color:T.ink, fontWeight:500 }}>Automatic sync is now ready.</strong> Your site can now accept push updates at <code>/api/operator/fitness/auto-sync</code>. It supports both the simple JSON payload I showed earlier and Health Auto Export&apos;s native REST API JSON structure.
        </li>
        <li style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, paddingLeft:20, position:'relative' }}>
          <span style={{ position:'absolute', left:0, color:T.gold, fontFamily:T.display, fontStyle:'italic' }}>iii.</span>
          <strong style={{ color:T.ink, fontWeight:500 }}>What to send.</strong> Send JSON with <code>date</code>, <code>weight</code>, and any of <code>bmi</code>, <code>bodyFat</code>, <code>water</code>, <code>waterMassKg</code>, <code>leanMassKg</code>, or <code>boneMassKg</code>. The route updates the existing day if it already exists, so repeated syncs don&apos;t create duplicate rows.
        </li>
      </ul>
      <div style={{ marginTop:18, padding:'16px 18px', border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.72)' }}>
        <Kicker style={{ marginBottom:8 }}>Shortcut payload example</Kicker>
        <pre style={{ margin:0, whiteSpace:'pre-wrap', fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:11, lineHeight:1.7, color:T.ink }}>
{`POST /api/operator/fitness/auto-sync
x-operator-pw: your operator password

{
  "date": "2026-05-17",
  "weight": 88.2,
  "bodyFat": 0.47,
  "leanMassKg": 49.8,
  "waterMassKg": 33.4,
  "boneMassKg": 3.2
}`}
        </pre>
      </div>
    </div>
  );
}

function FitPill({
  children,
  color = T.muted,
  background = 'rgba(255,255,255,0.72)',
}: {
  children: React.ReactNode;
  color?: string;
  background?: string;
}) {
  return (
    <span style={{
      display:'inline-flex',
      alignItems:'center',
      gap:6,
      padding:'5px 10px',
      border:`1px solid ${color}28`,
      background,
      color,
      fontFamily:T.sans,
      fontSize:9,
      fontWeight:600,
      letterSpacing:'0.16em',
      textTransform:'uppercase',
      whiteSpace:'nowrap',
    }}>
      {children}
    </span>
  );
}

function FitPanel({
  title,
  subtitle,
  actions,
  children,
  style,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{
      background:'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(251,248,243,0.98) 100%)',
      border:`1px solid ${T.line}`,
      boxShadow:CARD_SHADOW,
      overflow:'hidden',
      ...style,
    }}>
      <div style={{ padding:'16px 18px 14px', borderBottom:`1px solid ${T.softLine}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, flexWrap:'wrap' }}>
          <div>
            <h3 style={{ fontFamily:T.display, fontSize:22, fontWeight:400, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.05, margin:'0 0 6px' }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.6, margin:0, maxWidth:'62ch' }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>
      </div>
      <div style={{ padding:'18px' }}>
        {children}
      </div>
    </section>
  );
}

function TodayGlanceStrip({
  latest,
  goal,
  state,
  reg,
  cloudOk,
  syncing,
  setCompose,
  setTab,
}: {
  latest: FitnessReading;
  goal: number;
  state: State;
  reg: Reg | null;
  cloudOk: boolean | null;
  syncing: boolean;
  setCompose: (open: boolean) => void;
  setTab: (tab: string) => void;
}) {
  const remaining = Math.max(0, latest.weight - goal);
  const focus = state.weighInStatus === 'overdue'
    ? {
        title:'Reading overdue',
        copy:`${state.daysSinceWeighIn} days since the last weigh-in. File the number before you interpret anything else.`,
        tone:T.rose,
        bg:T.roseSoft,
      }
    : state.direction === 'gaining'
    ? {
        title:'Break the climb',
        copy:`The last four readings are up ${state.trendKgPerWeek.toFixed(2)} kg per week. Your job this week is to stop the rise.`,
        tone:T.rose,
        bg:T.roseSoft,
      }
    : state.direction === 'stable'
    ? {
        title:'Plateau window',
        copy:'The line is flat enough to intervene cleanly. Use the plan and restart the moderate deficit this week.',
        tone:T.gold,
        bg:T.goldSoft,
      }
    : {
        title:'Momentum back',
        copy:'The line is finally moving the right way. Protect consistency and keep the week boring.',
        tone:T.green,
        bg:T.greenSoft,
      };

  const syncLabel = cloudOk === null ? 'Local first' : cloudOk ? syncing ? 'Syncing now' : 'Cloud active' : 'Local backup';
  const cards = [
    { label:'Next target', value:`${state.thisWeekTarget.toFixed(1)} kg`, sub:'this week', color:T.gold },
    { label:'To goal', value:`${remaining.toFixed(1)} kg`, sub:'remaining', color:remaining === 0 ? T.green : T.ink },
    { label:'Body fat', value:`${latest.bodyFat.toFixed(1)}%`, sub:latest.bodyFat < 33 ? 'healthy' : latest.bodyFat < 39 ? 'high' : 'very high', color:latest.bodyFat < 33 ? T.green : latest.bodyFat < 39 ? T.gold : T.rose },
    { label:'BMI', value:latest.bmi.toFixed(1), sub:latest.bmi < 25 ? 'healthy' : latest.bmi < 30 ? 'high' : 'obese', color:latest.bmi < 25 ? T.green : latest.bmi < 30 ? T.gold : T.rose },
    { label:'Trend', value:`${state.trendKgPerWeek >= 0 ? '+' : ''}${state.trendKgPerWeek.toFixed(2)} kg/wk`, sub:'4-week line', color:state.trendKgPerWeek < -0.1 ? T.green : state.trendKgPerWeek > 0.1 ? T.rose : T.gold },
    { label:'Sync', value:syncLabel, sub:reg ? `R² ${Math.round(reg.r2 * 100)}%` : 'need data', color:cloudOk ? T.green : cloudOk === false ? T.gold : T.muted },
  ];

  return (
    <section style={{ marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:12, flexWrap:'wrap' }}>
        <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:T.body }}>
          Today at a glance
        </span>
        <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>
          {fmtDate(latest.date, { long:true })}
        </span>
      </div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'stretch' }}>
        <div style={{
          flex:'1 1 360px',
          minWidth:320,
          background:'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(251,248,243,0.98) 100%)',
          border:`1px solid ${T.line}`,
          borderRadius:8,
          padding:'18px 20px',
          boxShadow:CARD_SHADOW,
        }}>
          <div style={{ display:'flex', gap:0, alignItems:'stretch', flexWrap:'wrap' }}>
            <div style={{ flex:'1 1 190px', paddingRight:16 }}>
              <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:T.muted, marginBottom:4 }}>
                Current focus
              </div>
              <div style={{ fontFamily:T.display, fontSize:28, color:focus.tone, letterSpacing:'-0.02em', lineHeight:1, marginBottom:6 }}>
                {focus.title}
              </div>
              <p style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.6, margin:'0 0 12px', maxWidth:'32ch' }}>
                {focus.copy}
              </p>
              <button onClick={() => state.weighInStatus === 'overdue' ? setCompose(true) : setTab('Plan')} style={{
                background:T.ink,
                color:T.paper,
                border:0,
                cursor:'pointer',
                padding:'10px 14px',
                fontFamily:T.sans,
                fontSize:10,
                fontWeight:600,
                letterSpacing:'0.14em',
                textTransform:'uppercase',
              }}>
                {state.weighInStatus === 'overdue' ? 'File reading' : 'Open plan'}
              </button>
            </div>
            <div style={{ width:1, background:T.softLine, marginRight:16, alignSelf:'stretch' }} />
            <div style={{ flex:'1 1 120px', minWidth:120 }}>
              <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:T.muted, marginBottom:6 }}>
                Today
              </div>
              <div style={{ fontFamily:T.display, fontSize:34, color:T.ink, lineHeight:0.95, letterSpacing:'-0.03em', marginBottom:4 }}>
                {latest.weight.toFixed(1)}
              </div>
              <div style={{ fontFamily:T.sans, fontSize:10, color:T.muted, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:6 }}>
                kg on scale
              </div>
              <div style={{ fontFamily:T.sans, fontSize:10, color:focus.tone, fontWeight:600, letterSpacing:'0.08em', marginBottom:4 }}>
                {state.daysSinceWeighIn === 0 ? 'Logged today' : `${state.daysSinceWeighIn}d since last log`}
              </div>
              <div style={{ fontFamily:T.sans, fontSize:10, color:T.body }}>
                Goal {goal.toFixed(1)} kg
              </div>
            </div>
          </div>
        </div>

        {cards.map((card) => (
          <div key={card.label} style={{
            flex:'1 1 110px',
            minWidth:110,
            background:T.surface,
            border:`1px solid ${T.softLine}`,
            borderRadius:8,
            padding:'14px 16px',
            display:'flex',
            flexDirection:'column',
            gap:4,
          }}>
            <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:T.muted }}>
              {card.label}
            </div>
            <div style={{ fontFamily:T.display, fontSize:22, color:card.color, lineHeight:1, letterSpacing:'-0.02em' }}>
              {card.value}
            </div>
            <div style={{ fontFamily:T.sans, fontSize:10, color:T.body }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardHero({
  latest,
  previous,
  sorted,
  state,
  goal,
  cloudOk,
  syncing,
}: {
  latest: FitnessReading;
  previous: FitnessReading;
  sorted: FitnessReading[];
  state: State;
  goal: number;
  cloudOk: boolean | null;
  syncing: boolean;
}) {
  const latestIsToday = isoDay(latest.date) === localIsoDate();
  const weightLabel = latestIsToday ? 'Today' : 'Latest';
  const delta = latest.weight - previous.weight;
  const remaining = Math.max(0, latest.weight - goal);
  const syncLabel = cloudOk === null ? 'Local first' : cloudOk ? syncing ? 'Cloud syncing' : 'Cloud active' : 'Local backup';
  const syncColor = cloudOk ? T.green : cloudOk === false ? T.gold : T.muted;
  const phaseCount = detectPhases(sorted).length;
  const sevenDayTarget = new Date(new Date(latest.date).getTime() - 7 * 86400000).getTime();
  const weekAnchor = sorted.length > 1
    ? sorted.reduce((best, reading) => {
        if (reading.id === latest.id) return best;
        const diff = Math.abs(new Date(reading.date).getTime() - sevenDayTarget);
        const bestDiff = Math.abs(new Date(best.date).getTime() - sevenDayTarget);
        return diff < bestDiff ? reading : best;
      }, sorted[0])
    : latest;
  const sevenDayDelta = latest.weight - weekAnchor.weight;
  const statCells = [
    {
      label:'Weight',
      value:`${latest.weight.toFixed(1)} kg`,
      meta:`today`,
      color:T.ink,
    },
    {
      label:'To goal',
      value:`${remaining.toFixed(1)} kg`,
      meta:'remaining',
      color:remaining === 0 ? T.green : T.gold,
    },
    {
      label:'Body fat',
      value:`${latest.bodyFat.toFixed(1)}%`,
      meta:latest.bodyFat < 33 ? 'healthy lane' : latest.bodyFat < 39 ? 'high' : 'very high',
      color:latest.bodyFat < 33 ? T.green : latest.bodyFat < 39 ? T.gold : T.rose,
    },
    {
      label:'BMI',
      value:latest.bmi.toFixed(1),
      meta:latest.bmi < 25 ? 'healthy' : latest.bmi < 30 ? 'overweight' : 'obese',
      color:latest.bmi < 25 ? T.green : latest.bmi < 30 ? T.gold : T.rose,
    },
    {
      label:'Water',
      value:`${latest.water.toFixed(1)}%`,
      meta:latest.water >= 45 ? 'healthy' : 'low',
      color:latest.water >= 45 ? T.green : T.gold,
    },
    {
      label:'Sync',
      value:syncLabel,
      meta:state.daysSinceWeighIn === 0 ? 'logged today' : `${state.daysSinceWeighIn}d since log`,
      color:syncColor,
    },
  ];

  return (
    <section style={{
      background:'rgba(255,255,255,0.96)',
      border:`1px solid ${T.line}`,
      boxShadow:CARD_SHADOW,
      overflow:'hidden',
      marginBottom:20,
    }}>
      <div style={{ padding:'24px clamp(18px, 4vw, 28px) 18px' }}>
        <div style={{ display:'flex', gap:24, alignItems:'flex-end', flexWrap:'wrap' }}>
          <div style={{ flex:'1 1 560px', minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:12 }}>
              <span style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:T.muted, fontWeight:600 }}>Fitness</span>
              <span style={{ color:T.muted, opacity:0.45 }}>/</span>
              <FitPill color={T.gold} background={`${T.gold}12`}>{state.phaseName} live</FitPill>
              <FitPill color={syncColor} background={`${syncColor}12`}>{state.daysSinceWeighIn === 0 ? 'Logged today' : `Logged ${state.daysSinceWeighIn}d ago`}</FitPill>
            </div>
            <h1 style={{ fontFamily:T.display, fontSize:'clamp(34px, 4.8vw, 52px)', fontWeight:400, letterSpacing:'-0.02em', lineHeight:0.96, color:T.ink, margin:'0 0 10px', maxWidth:'11ch' }}>
              Body composition <em style={{ color:T.gold, fontStyle:'italic' }}>timeline</em>
            </h1>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', fontFamily:T.sans, fontSize:13, color:T.body }}>
              <span>{fmtDate(sorted[0].date, { long:true })} start</span>
              <span style={{ width:4, height:4, borderRadius:'50%', background:T.muted }} />
              <span>{sorted.length} readings logged</span>
              <span style={{ width:4, height:4, borderRadius:'50%', background:T.muted }} />
              <span>{phaseCount} phases logged</span>
              <span style={{ width:4, height:4, borderRadius:'50%', background:T.muted }} />
              <span style={{ color:T.muted }}>{cloudOk ? 'Cloud sync active' : cloudOk === false ? 'Local fallback only' : 'Local first mode'}</span>
            </div>
          </div>

          <div style={{
            flex:'1 1 280px',
            textAlign:'right',
            minWidth:200,
          }}>
            <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.muted, marginBottom:8 }}>
              {weightLabel} · {fmtDate(latest.date)}
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:T.display, fontSize:56, color:T.ink, letterSpacing:'-0.03em', lineHeight:0.92 }}>{latest.weight.toFixed(1)}</span>
              <span style={{ fontFamily:T.sans, fontSize:22, color:T.muted }}>kg</span>
            </div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:11, letterSpacing:'0.04em', color:sevenDayDelta <= 0 ? T.green : T.rose, marginTop:6 }}>
              {sevenDayDelta > 0 ? '+' : ''}{sevenDayDelta.toFixed(1)} · 7-day marker
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(6, minmax(0, 1fr))',
        gap:0,
        background:T.surface,
        borderTop:`1px solid ${T.softLine}`,
      }}>
        {statCells.map((cell, index) => (
          <div key={cell.label} style={{
            padding:'14px 16px',
            borderRight:index < statCells.length - 1 ? `1px solid ${T.softLine}` : 'none',
          }}>
            <div style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.20em', textTransform:'uppercase', color:T.muted, marginBottom:6 }}>
              {cell.label}
            </div>
            <div style={{ fontFamily:T.display, fontSize:20, color:T.ink, letterSpacing:'-0.01em', lineHeight:1.02 }}>
              {cell.value}
            </div>
            <div style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize:11, color:cell.color, marginTop:6, letterSpacing:'0.04em' }}>
              {cell.meta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OverviewTabView({
  latest,
  sorted,
  goal,
  state,
  setCompose,
  setTab,
}: {
  latest: FitnessReading;
  sorted: FitnessReading[];
  goal: number;
  state: State;
  setCompose: (open: boolean) => void;
  setTab: (tab: string) => void;
}) {
  const [weightLabel, weightColor] = weightStatus(latest.weight, goal);
  const [bmiLabel, bmiColor] = bmiStatus(latest.bmi);
  const [fatLabel, fatColor] = fatStatus(latest.bodyFat);
  const [waterLabel, waterColor] = waterStatus(latest.water);
  const [muscleLabel, muscleColor] = muscleStatus(latest.muscleMass);
  const [boneLabel, boneColor] = boneStatus(latest.boneMass);

  const notes = [
    state.weighInStatus === 'overdue'
      ? `Log the next weigh-in before trusting the story. ${state.daysSinceWeighIn} days is too long for a clean read.`
      : `The weigh-in rhythm is intact. That makes the next adjustment easier to evaluate.`,
    state.direction === 'gaining'
      ? `The trend is still up, so the next win is breaking the rise, not chasing a perfect month in one go.`
      : state.direction === 'stable'
      ? 'You are in a flat patch. That is useful because small changes should show up cleanly.'
      : 'The line is moving the right way again. Protect consistency more than intensity.',
    `Health now holds the charts. Overview stays lighter so you can answer “what next?” without opening six visual panels.`,
  ];

  const scanCards = [
    { label:'Weight', value:`${latest.weight.toFixed(1)} kg`, status:weightLabel, color:weightColor },
    { label:'BMI', value:latest.bmi.toFixed(1), status:bmiLabel, color:bmiColor },
    { label:'Body fat', value:`${latest.bodyFat.toFixed(1)}%`, status:fatLabel, color:fatColor },
    { label:'Water', value:`${latest.water.toFixed(1)}%`, status:waterLabel, color:waterColor },
    { label:'Muscle', value:`${latest.muscleMass.toFixed(1)}%`, status:muscleLabel, color:muscleColor },
    { label:'Bone', value:`${latest.boneMass.toFixed(2)}%`, status:boneLabel, color:boneColor },
  ];

  return (
    <div style={{ display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
      <div style={{ flex:'1 1 680px', display:'flex', flexDirection:'column', gap:20, minWidth:0 }}>
        <FitPanel
          title={<>This <em style={{ color:T.gold }}>week</em></>}
          subtitle="Scale rhythm, weekly deltas and the immediate pattern without sending you into the full chart view."
        >
          <ThisWeekGrid sorted={sorted} state={state} showHeader={false} />
        </FitPanel>

        <FitPanel
          title={<>Phase <em style={{ color:T.gold }}>log</em></>}
          subtitle="The story: rise, collapse, rebuild, discipline."
        >
          <PhaseLog sorted={sorted} showHeader={false} />
        </FitPanel>

        <FitPanel
          title={<>The <em style={{ color:T.gold }}>arc</em></>}
          subtitle="Four anchor moments so one awkward week never becomes the whole story."
        >
          <JourneyStory sorted={sorted} state={state} showHeader={false} />
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:16 }}>
            {[
              { label:'Open health', action:() => setTab('Health') },
              { label:'Open plan', action:() => setTab('Plan') },
              { label:'Open ledger', action:() => setTab('Ledger') },
              { label:'File reading', action:() => setCompose(true) },
            ].map((item) => (
              <button key={item.label} onClick={item.action} style={{
                background:'transparent',
                border:`1px solid ${T.line}`,
                color:T.ink,
                cursor:'pointer',
                padding:'10px 12px',
                fontFamily:T.sans,
                fontSize:10,
                fontWeight:600,
                letterSpacing:'0.14em',
                textTransform:'uppercase',
              }}>
                {item.label}
              </button>
            ))}
          </div>
        </FitPanel>
      </div>

      <aside style={{ flex:'1 1 300px', display:'flex', flexDirection:'column', gap:20, minWidth:'min(100%, 300px)' }}>
        <GoalCard state={state} latest={latest} goal={goal} />

        <FitPanel title={<>Today <em style={{ color:T.gold }}>scan</em></>}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:10 }}>
            {scanCards.map((card) => (
              <div key={card.label} style={{
                border:`1px solid ${T.softLine}`,
                background:T.surface,
                padding:'12px 12px 10px',
                minHeight:92,
              }}>
                <div style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.muted, marginBottom:10 }}>
                  {card.label}
                </div>
                <div style={{ fontFamily:T.display, fontSize:24, color:T.ink, letterSpacing:'-0.02em', lineHeight:1, marginBottom:6 }}>
                  {card.value}
                </div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:card.color, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                  {card.status}
                </div>
              </div>
            ))}
          </div>
        </FitPanel>

        <FitPanel title={<>Command <em style={{ color:T.gold }}>notes</em></>}>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {notes.map((note, index) => (
              <p key={index} style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.65, margin:0 }}>
                {note}
              </p>
            ))}
          </div>
        </FitPanel>
      </aside>
    </div>
  );
}

// ─── Lock screen ──────────────────────────────────────────────────────────────

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/operator/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ ts: Date.now(), pw }));
        onUnlock();
      } else {
        setErr(true);
        setTimeout(() => setErr(false), 1400);
      }
    } catch {
      setErr(true);
      setTimeout(() => setErr(false), 1400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(145deg, ${T.paper} 0%, ${T.surface} 60%, ${T.goldSoft} 100%)`, padding:24 }}>
      <form onSubmit={submit} style={{ width:'100%', maxWidth:400, textAlign:'center', padding:'32px 28px 36px', border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.82)', boxShadow:CARD_SHADOW, backdropFilter:'blur(8px)' }}>
        <Kicker style={{ marginBottom:20 }}>Vol. 01 · Restricted Access</Kicker>
        <h1 style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize: 24, color:T.ink, margin:'0 0 8px', letterSpacing:'-0.02em' }}>
          Operator.
        </h1>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color:T.muted, margin:'0 0 40px' }}>a private weighing log.</p>
        <ThickRule style={{ marginBottom:32 }} />
        <div style={{ borderBottom:`0.5px solid ${err ? T.rose : T.line}`, marginBottom:24, transition:'border-color 0.2s' }}>
          <input
            ref={ref}
            type="password"
            placeholder="enter password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{
              width:'100%', background:'transparent', border:'none', outline:'none',
              fontFamily:T.display, fontStyle:'italic', fontSize:20, color:T.ink,
              padding:'4px 0 10px', textAlign:'center',
            }}
          />
        </div>
        {err && <p style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.2em', color:T.rose, marginBottom:12 }}>INCORRECT PASSWORD</p>}
        <button type="submit" disabled={loading} style={{
          background:T.ink, color:T.paper, border:0, cursor:'pointer',
          padding:'14px 36px', fontFamily:T.sans, fontSize:10, fontWeight:500,
          letterSpacing:'0.24em', textTransform:'uppercase', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Verifying…' : 'Enter →'}
        </button>
      </form>
    </div>
  );
}

// ─── Hero reading ─────────────────────────────────────────────────────────────

function HeroReading({ latest, previous, sorted }: { latest:FitnessReading; previous:FitnessReading; sorted:FitnessReading[] }) {
  const dw = latest.weight - previous.weight;
  const last4 = sorted.slice(-4);
  const sparkW=280, sparkH=60, sp=6;
  const sYs = last4.map(r=>r.weight);
  const sMin = Math.min(...sYs)-0.4, sMax = Math.max(...sYs)+0.4;
  const sXs = last4.map((_,i)=> sp + (i/(last4.length-1))*(sparkW-sp*2));
  const sYp = last4.map(r=> sp + (1-(r.weight-sMin)/(sMax-sMin))*(sparkH-sp*2));
  const sPath = sXs.map((x,i)=>(i===0?'M':'L')+x.toFixed(1)+','+sYp[i].toFixed(1)).join(' ');

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:28, alignItems:'end', paddingBottom:48, borderBottom:`2px solid ${T.ink}`, marginBottom:48 }}>
      <div>
        <Kicker style={{ marginBottom:14 }}>This Week&apos;s Figure · {fmtDate(latest.date, { long:true })}</Kicker>
        <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:12 }}>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize: 32, letterSpacing:'-0.04em', lineHeight:0.85, color:T.ink }}>
            {latest.weight.toFixed(1)}
          </span>
          <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:28, color:T.muted }}>kg</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <span style={{
            fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.2em',
            color: dw >= 0 ? T.rose : T.green,
            padding:'4px 10px', background: dw >= 0 ? T.roseSoft : T.greenSoft,
          }}>
            {dw >= 0 ? '▲' : '▼'} {Math.abs(dw).toFixed(1)} KG SINCE LAST
          </span>
          <Kicker>
            {dw >= 0 ? 'Moving away from goal' : 'Moving toward goal'}
          </Kicker>
        </div>
      </div>
      <div>
        <Kicker style={{ marginBottom:10 }}>Last 4 Readings · Weight</Kicker>
        <svg viewBox={`0 0 ${sparkW} ${sparkH}`} style={{ width:'100%', height:60, display:'block', marginBottom:8 }}>
          <path d={sPath} fill="none" stroke={T.ink} strokeWidth="1" />
          {sXs.map((x,i) => (
            <circle key={i} cx={x} cy={sYp[i]} r="2.5" fill={i===last4.length-1 ? T.rose : T.muted} />
          ))}
        </svg>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Kicker>{sYs[0].toFixed(1)}</Kicker>
          <Kicker color={T.rose}>{sYs[sYs.length-1].toFixed(1)}</Kicker>
        </div>
      </div>
    </div>
  );
}

function DetailLaunchpad({ setCompose, setTab }: { setCompose: (open: boolean) => void; setTab: (tab: string) => void }) {
  const actions = [
    { label:'Open plan', sub:'Weekly rules and nutrition targets', action:() => setTab('Plan') },
    { label:'Health panel', sub:'Body composition and health markers', action:() => setTab('Health') },
    { label:'Projections', sub:'Where the current line is heading', action:() => setTab('Projections') },
    { label:'Open ledger', sub:'Every weigh-in in one place', action:() => setTab('Ledger') },
    { label:'File reading', sub:'Add the next weigh-in now', action:() => setCompose(true) },
  ];

  return (
    <div style={{ marginTop:48 }}>
      <Kicker style={{ marginBottom:10 }}>Need detail, not noise</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:20, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 8px' }}>
        Use the right tab for the <em>next question</em>.
      </h2>
      <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, margin:'0 0 18px', maxWidth:'48ch' }}>
        The overview should stay short. When you want detail, jump directly into the specific view instead of scrolling through everything.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12 }}>
        {actions.map((item) => (
          <button key={item.label} onClick={item.action} style={{
            border:`1px solid ${T.line}`,
            background:'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(251,248,243,0.96) 100%)',
            padding:'16px 16px 14px',
            textAlign:'left',
            cursor:'pointer',
          }}>
            <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.ink, marginBottom:6 }}>{item.label}</div>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.body, lineHeight:1.5 }}>{item.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Stat panel ───────────────────────────────────────────────────────────────

function StatItem({ label, value, unit, status, statusColor, last }: {
  label:string; value:string; unit:string; status:string; statusColor:string; last?:boolean;
}) {
  return (
    <div style={{ flex:1, padding:'22px 22px', borderRight: last ? 'none' : `0.5px solid ${T.line}` }}>
      <Kicker style={{ marginBottom:12 }}>{label}</Kicker>
      <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:10 }}>
        <span style={{ fontFamily:T.display, fontWeight:400, fontSize: 24, lineHeight:1, color:T.ink, letterSpacing:'-0.015em' }}>{value}</span>
        {unit && <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>{unit}</span>}
      </div>
      <span style={{
        fontFamily:T.sans, fontSize:9.5, fontWeight:500, letterSpacing:'0.22em',
        textTransform:'uppercase', color:statusColor,
        padding:'3px 8px', background:statusColor+'18', display:'inline-block',
      }}>{status}</span>
    </div>
  );
}

// ─── Trend chart ──────────────────────────────────────────────────────────────

function TrendChart({ sorted, reg, goal }: { sorted:FitnessReading[]; reg:Reg|null; goal:number }) {
  const W=1000, H=340;
  const PAD = { top:36, right:90, bottom:50, left:56 };
  const iW = W-PAD.left-PAD.right, iH = H-PAD.top-PAD.bottom;
  if (sorted.length < 2 || !reg) return null;

  const lastDay = daysFrom(reg, new Date(sorted[sorted.length-1].date));
  const predDays = 90;
  const xMax = lastDay + predDays;

  const predY = project(reg, xMax);
  const allYs = sorted.map(r=>r.weight).concat([goal, predY]);
  const yMin = Math.floor(Math.min(...allYs)-2), yMax = Math.ceil(Math.max(...allYs)+2);

  const xS = (d:number) => PAD.left + (d/xMax)*iW;
  const yS = (v:number) => PAD.top + (1-(v-yMin)/(yMax-yMin))*iH;

  const pts = sorted.map(r => [xS(daysFrom(reg, new Date(r.date))), yS(r.weight)] as [number,number]);
  const lineD = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const areaD = lineD + ` L ${pts[pts.length-1][0].toFixed(1)},${(H-PAD.bottom)} L ${pts[0][0].toFixed(1)},${(H-PAD.bottom)} Z`;

  const predPt = [xS(xMax), yS(predY)] as [number,number];
  const predLineD = `M ${pts[pts.length-1][0].toFixed(1)},${pts[pts.length-1][1].toFixed(1)} L ${predPt[0].toFixed(1)},${predPt[1].toFixed(1)}`;

  const goalY = yS(goal);
  const yTicks = [yMin, Math.round(yMin+(yMax-yMin)*0.33), Math.round(yMin+(yMax-yMin)*0.67), yMax];

  // month label for each reading + prediction end
  const mLabel = (iso:string) => new Date(iso).toLocaleDateString('en-GB',{month:'short'});

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block', margin:'24px 0 8px' }}>
      {/* area */}
      <path d={areaD} fill={T.ink} opacity="0.03" />
      {/* goal zone */}
      <rect x={PAD.left} y={goalY} width={iW} height={H-PAD.bottom-goalY} fill={T.goldSoft} opacity="0.4" />
      {/* y ticks */}
      {yTicks.map((t,i) => (
        <g key={i}>
          <line x1={PAD.left} y1={yS(t)} x2={PAD.left+iW} y2={yS(t)} stroke={T.softLine} strokeWidth="0.5" />
          <text x={PAD.left-8} y={yS(t)+4} textAnchor="end" fontFamily={T.sans} fontSize="11" fill={T.muted}>{t}</text>
        </g>
      ))}
      {/* goal line */}
      <line x1={PAD.left} y1={goalY} x2={PAD.left+iW} y2={goalY} stroke={T.gold} strokeWidth="1" strokeDasharray="6,4" />
      <text x={PAD.left+iW+6} y={goalY+4} fontFamily={T.sans} fontSize="10" fill={T.gold} fontWeight="500" letterSpacing="0.1em">GOAL</text>
      {/* prediction line */}
      <path d={predLineD} fill="none" stroke={T.blue} strokeWidth="1" strokeDasharray="5,4" opacity="0.7" />
      <circle cx={predPt[0]} cy={predPt[1]} r="3" fill={T.blue} opacity="0.5" />
      <text x={predPt[0]+7} y={predPt[1]+4} fontFamily={T.display} fontStyle="italic" fontSize="12" fill={T.blue} opacity="0.8">
        {predY.toFixed(1)} kg
      </text>
      {/* observed line */}
      <path d={lineD} fill="none" stroke={T.ink} strokeWidth="1.2" />
      {pts.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={T.ink} />
      ))}
      {/* x labels */}
      {sorted.map((r,i) => (
        <text key={i} x={pts[i][0]} y={H-10} textAnchor="middle" fontFamily={T.sans} fontSize="11" fill={T.muted}>{mLabel(r.date)}</text>
      ))}
      <text x={predPt[0]} y={H-10} textAnchor="middle" fontFamily={T.sans} fontSize="11" fill={T.blue} opacity="0.6">
        {mLabel(new Date(reg.t0 + xMax*86400000).toISOString())}
      </text>
      {/* axes */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H-PAD.bottom} stroke={T.line} strokeWidth="0.5" />
      <line x1={PAD.left} y1={H-PAD.bottom} x2={PAD.left+iW} y2={H-PAD.bottom} stroke={T.line} strokeWidth="0.5" />
    </svg>
  );
}

// ─── Composition chart ────────────────────────────────────────────────────────

function CompositionChart({ sorted }: { sorted:FitnessReading[] }) {
  const W=320, H=100, PAD=14;
  const iW=W-PAD*2, iH=H-PAD*2;
  const metrics = [
    { key:'bodyFat',    label:'Body Fat',    color:T.rose,  unit:'%', soft:T.roseSoft },
    { key:'muscleMass', label:'Muscle Mass', color:T.green, unit:'%', soft:T.greenSoft },
    { key:'water',      label:'Body Water',  color:T.blue,  unit:'%', soft:T.blueSoft },
  ] as const;

  return (
    <ScrollRail minWidth={760} style={{ marginTop:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(220px, 1fr))', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
        {metrics.map((m, idx) => {
          const ys = sorted.map(r => r[m.key as keyof FitnessReading] as number);
          const yMin=Math.min(...ys)-0.5, yMax=Math.max(...ys)+0.5;
          const xs = sorted.map((_,i)=>PAD+(i/(sorted.length-1))*iW);
          const yPos = sorted.map(r => PAD+(1-((r[m.key as keyof FitnessReading] as number)-yMin)/(yMax-yMin))*iH);
          const path = xs.map((x,i)=>(i===0?'M':'L')+x.toFixed(1)+','+yPos[i].toFixed(1)).join(' ');
          const last=ys[ys.length-1], delta=last-ys[0];
          return (
            <div key={m.key} style={{ padding:'20px 22px', borderRight: idx<2 ? `0.5px solid ${T.line}` : 'none' }}>
              <Kicker style={{ marginBottom:10 }}>{m.label}</Kicker>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:56, display:'block', marginBottom:10 }}>
                <path d={path+` L ${xs[xs.length-1].toFixed(1)},${H-PAD} L ${xs[0].toFixed(1)},${H-PAD} Z`} fill={m.color} opacity="0.07" />
                <path d={path} fill="none" stroke={m.color} strokeWidth="1.2" />
                {xs.map((x,i)=><circle key={i} cx={x} cy={yPos[i]} r="2.5" fill={m.color} />)}
              </svg>
              <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                <span style={{ fontFamily:T.display, fontSize: 20, color:T.ink, letterSpacing:'-0.01em' }}>{last.toFixed(1)}</span>
                <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>{m.unit}</span>
              </div>
              <span style={{
                fontFamily:T.sans, fontSize:9.5, fontWeight:500, letterSpacing:'0.2em',
                color: delta>0 ? T.rose : T.green,
              }}>
                {delta>0?'▲':'▼'} {Math.abs(delta).toFixed(1)} since Nov
              </span>
            </div>
          );
        })}
      </div>
    </ScrollRail>
  );
}

// ─── BMI chart ────────────────────────────────────────────────────────────────

function BMIChart({ sorted }: { sorted:FitnessReading[] }) {
  const W=1000, H=220;
  const PAD = { top:20, right:72, bottom:38, left:50 };
  const iW=W-PAD.left-PAD.right, iH=H-PAD.top-PAD.bottom;
  const ys=sorted.map(r=>r.bmi);
  const yMin=Math.floor(Math.min(...ys,25)-1), yMax=Math.ceil(Math.max(...ys,30)+1);
  const xs=sorted.map((_,i)=>PAD.left+(i/(sorted.length-1))*iW);
  const yP=sorted.map(r=>PAD.top+(1-(r.bmi-yMin)/(yMax-yMin))*iH);
  const path=xs.map((x,i)=>(i===0?'M':'L')+x.toFixed(1)+','+yP[i].toFixed(1)).join(' ');
  const yH=(v:number)=>PAD.top+(1-(v-yMin)/(yMax-yMin))*iH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block', margin:'16px 0 8px' }}>
      {/* zones */}
      <rect x={PAD.left} y={yH(30)} width={iW} height={H-PAD.bottom-yH(30)} fill={T.rose} opacity="0.05" />
      <rect x={PAD.left} y={yH(25)} width={iW} height={yH(30)-yH(25)} fill={T.gold} opacity="0.05" />
      <rect x={PAD.left} y={yH(18.5)} width={iW} height={yH(25)-yH(18.5)} fill={T.green} opacity="0.05" />
      {/* zone labels */}
      {[{v:32,l:'OBESE',c:T.rose},{v:27,l:'OVERWEIGHT',c:T.gold},{v:21.5,l:'HEALTHY',c:T.green}].map(z=>(
        <text key={z.l} x={PAD.left+iW+5} y={yH(z.v)+4} fontFamily={T.sans} fontSize="9.5" fill={z.c} letterSpacing="0.12em">{z.l}</text>
      ))}
      {/* hairlines */}
      {[18.5,25,30].map(v=>(
        <line key={v} x1={PAD.left} y1={yH(v)} x2={PAD.left+iW} y2={yH(v)} stroke={T.line} strokeWidth="0.5" strokeDasharray="4,3" />
      ))}
      {/* path */}
      <path d={path} fill="none" stroke={T.ink} strokeWidth="1" />
      {xs.map((x,i)=><circle key={i} cx={x} cy={yP[i]} r="3" fill={T.ink} />)}
      {/* month labels */}
      {sorted.map((r,i)=>(
        <text key={i} x={xs[i]} y={H-8} textAnchor="middle" fontFamily={T.sans} fontSize="11" fill={T.muted}>
          {new Date(r.date).toLocaleDateString('en-GB',{month:'short'})}
        </text>
      ))}
      {/* y axis */}
      {[yMin,25,30,yMax].map(v=>(
        <text key={v} x={PAD.left-6} y={yH(v)+4} textAnchor="end" fontFamily={T.sans} fontSize="10" fill={T.muted}>{v}</text>
      ))}
    </svg>
  );
}

// ─── Milestones ───────────────────────────────────────────────────────────────

function Milestones({ sorted, reg, goal }: { sorted:FitnessReading[]; reg:Reg|null; goal:number }) {
  const latest = sorted[sorted.length-1];
  const steps = [85, 80, 75, 70, 65, goal].filter(m => m < latest.weight);

  return (
    <div style={{ marginTop:64 }}>
      <Kicker style={{ marginBottom:10 }}>Section III · Milestones</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize: 20, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        Waypoints <em>on the route home</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        {reg && reg.slope < 0 ? 'Estimated at your current rate of loss.' : 'Requires a trend reversal — current direction is away from goal.'}
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />
      <ScrollRail minWidth={640}>
        <div style={{ borderBottom:`0.5px solid ${T.line}` }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'10px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
            <Kicker>Milestone</Kicker>
            <Kicker style={{ textAlign:'right' }}>Weight</Kicker>
            <Kicker style={{ textAlign:'right' }}>Estimated date</Kicker>
          </div>
          {steps.map((kg,i) => {
            const isGoal = kg === goal;
            const d = reg && reg.slope < 0 ? goalDate({ ...reg, intercept: reg.intercept, slope: reg.slope } as Reg, kg) : null;
            // project goal for this milestone weight
            let projDate: Date | null = null;
            if (reg && reg.slope < 0) {
              const days = (kg - reg.intercept) / reg.slope;
              projDate = new Date(reg.t0 + days * 86400000);
            }
            return (
              <div key={kg} style={{
                display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                padding:'18px 0', borderBottom: i < steps.length-1 ? `0.5px solid ${T.softLine}` : 'none',
                alignItems:'baseline',
              }}>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:20, color: isGoal ? T.gold : T.ink }}>
                  {isGoal ? 'Goal ★' : `−${(latest.weight-kg).toFixed(1)} kg waypoint`}
                </div>
                <div style={{ fontFamily:T.display, fontSize:26, color: isGoal ? T.gold : T.ink, textAlign:'right', letterSpacing:'-0.01em' }}>
                  {kg.toFixed(1)} <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  {projDate ? (
                    <span style={{ fontFamily:T.sans, fontSize:12, color: isGoal ? T.gold : T.body }}>{fmtDateObj(projDate)}</span>
                  ) : (
                    <span style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.15em', color:T.muted }}>REVERSE TREND FIRST</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollRail>
    </div>
  );
}

// ─── Cut Strategies ───────────────────────────────────────────────────────────

function CutStrategies({ sorted, goal }: { sorted:FitnessReading[]; goal:number }) {
  const latest = sorted[sorted.length-1];
  const toGo   = latest.weight - goal;

  const { bmr, activeTdee } = nutritionTargets(latest);
  const tdee = { sedentary: Math.round(bmr*1.2), light: Math.round(bmr*1.375), moderate: Math.round(bmr*1.55) };

  const KcalPerKg = 7700;

  const strategies = [
    {
      name:'Slow & Steady', deficit:300,
      note:'Easiest to maintain for months. Minimal hunger. Best for preserving the muscle mass you have.',
      pro:'High adherence, near-zero muscle loss, no food obsession',
      con:'Longest timeline — requires patience',
    },
    {
      name:'Moderate Cut', deficit:500, recommended:true,
      note:'The evidence-backed sweet spot. Clinically recommended as the primary approach for sustainable fat loss.',
      pro:'Sustainable for 6–12 months, protects muscle when paired with resistance training',
      con:'Requires consistent tracking of intake',
    },
    {
      name:'Aggressive Cut', deficit:750,
      note:'Faster results, but harder to sustain beyond 3 months without diet breaks.',
      pro:'Meaningful progress within 2–3 months',
      con:'Elevated hunger, fatigue, some muscle loss risk',
    },
    {
      name:'Maximum Safe', deficit:1000,
      note:'Upper clinical limit. Appropriate only short-term or under medical supervision.',
      pro:'Fastest route to the goal',
      con:'Nutrient deficiency risk, energy crash, significant muscle loss without careful protein intake',
    },
  ];

  const nowMs = new Date(latest.date).getTime();

  const goalDateForDeficit = (deficit:number) => {
    const kgPerWeek = deficit / KcalPerKg * 7;
    const weeksNeeded = toGo / kgPerWeek;
    return new Date(nowMs + weeksNeeded * 7 * 86400000);
  };

  const thisWeekTarget = (deficit:number) => {
    const kgPerDay = deficit / KcalPerKg;
    return Math.max(0, latest.weight - kgPerDay * 7).toFixed(1);
  };

  // Verdict logic
  const verdict = latest.bmi >= 30 && latest.bodyFat > 33;
  const verdictText = verdict
    ? `Yes — cut. BMI ${latest.bmi.toFixed(1)} (obese class ${latest.bmi >= 35 ? 'II' : 'I'}) and body fat ${latest.bodyFat.toFixed(1)}% both indicate a calorie deficit is clinically appropriate. The moderate cut is the recommended starting point.`
    : `Moderate deficit recommended. Your metrics suggest fat loss would improve health markers significantly.`;

  return (
    <div style={{ marginTop:80 }}>
      <Kicker style={{ marginBottom:10 }}>Section VI · The Cut</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize: 20, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        Should you cut? <em>Yes. Here is how.</em>
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        Four strategies, their trade-offs, and what each means for your goal date.
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />

      {/* Verdict */}
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:32, padding:'28px 0', borderBottom:`0.5px solid ${T.line}`, alignItems:'start' }}>
        <div>
          <Kicker style={{ marginBottom:10 }}>The Verdict</Kicker>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize: 28, color:T.gold, letterSpacing:'-0.02em', lineHeight:1 }}>Cut.</span>
        </div>
        <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:'28px 0 0', maxWidth:'52ch' }}>
          {verdictText}
        </p>
      </div>

      {/* TDEE estimate */}
      <div style={{ padding:'24px 0', borderBottom:`0.5px solid ${T.line}` }}>
        <Kicker style={{ marginBottom:14 }}>Estimated Daily Energy Expenditure · Mifflin-St Jeor (female, 30)</Kicker>
        <p style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.6, margin:'0 0 14px', maxWidth:'50ch' }}>
          The dashboard now assumes an exercising week by default, so the working maintenance baseline is <strong style={{ color:T.ink, fontWeight:500 }}>{activeTdee.toLocaleString()} kcal/day</strong>.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:0 }}>
          {[
            { label:'Sedentary', mult:'×1.2', kcal:tdee.sedentary, note:'Desk job, little exercise' },
            { label:'Lightly Active', mult:'×1.375', kcal:tdee.light, note:'Light exercise 1–3 days/wk' },
            { label:'Moderately Active', mult:'×1.55', kcal:tdee.moderate, note:'Exercise 3–5 days/wk' },
          ].map((row,i) => (
            <div key={i} style={{ padding:'16px 20px', borderRight: i<2?`0.5px solid ${T.line}`:'none' }}>
              <Kicker style={{ marginBottom:8 }}>{row.label} {row.mult}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:5 }}>
                <span style={{ fontFamily:T.display, fontSize: 20, color:T.ink, letterSpacing:'-0.02em' }}>{row.kcal.toLocaleString()}</span>
                <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kcal/day</span>
              </div>
              <Kicker color={T.muted}>{row.note}</Kicker>
            </div>
          ))}
        </div>
        <p style={{ fontFamily:T.sans, fontSize:11, color:T.muted, fontWeight:300, margin:'12px 20px 0', fontStyle:'italic' }}>
          Estimate only. Verify with a full TDEE calculator using your actual age and activity level.
        </p>
      </div>

      {/* Strategy comparison */}
      <div style={{ marginTop:0 }}>
        <ScrollRail minWidth={900}>
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 1.2fr', padding:'12px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
            {['Strategy','Deficit','Intake (training week)','Loss rate','Goal date'].map((h,i)=>(
              <Kicker key={i} style={{ textAlign:i>0?'right':'left' }}>{h}</Kicker>
            ))}
          </div>
          {strategies.map((s, i) => {
            const kgPerWeek = (s.deficit/KcalPerKg*7);
            const intake = activeTdee - s.deficit;
            const gDate = goalDateForDeficit(s.deficit);
            const isRec = s.recommended;
            return (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 1.2fr',
                padding:'20px 0', borderBottom:`0.5px solid ${T.softLine}`,
                alignItems:'baseline',
                background: isRec ? T.goldSoft : 'transparent',
                margin: isRec ? '0 -20px' : 0,
              }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color: isRec?T.gold:T.ink }}>{s.name}</span>
                    {isRec && <span style={{ fontFamily:T.sans, fontSize:8, fontWeight:600, letterSpacing:'0.2em', color:T.gold, padding:'2px 7px', border:`0.5px solid ${T.gold}` }}>RECOMMENDED</span>}
                  </div>
                  <p style={{ fontFamily:T.sans, fontSize:12, fontWeight:300, color:T.body, margin:'6px 0 0', lineHeight:1.5, maxWidth:'28ch' }}>{s.note}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontFamily:T.display, fontSize:24, color:T.ink }}>−{s.deficit}</span>
                  <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}> kcal</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontFamily:T.display, fontSize:24, color:T.ink }}>{intake.toLocaleString()}</span>
                  <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}> kcal</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontFamily:T.display, fontSize:22, color:T.green }}>−{kgPerWeek.toFixed(2)}</span>
                  <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}> kg/wk</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color: isRec?T.gold:T.body }}>
                    {fmtDateObj(gDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </ScrollRail>
      </div>

      {/* Pro/Con detail */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginTop:48 }}>
        {strategies.map((s,i) => (
          <div key={i} style={{ padding:'22px 24px', borderRight: i%2===0?`0.5px solid ${T.line}`:'none', borderBottom: i<2?`0.5px solid ${T.line}`:'none' }}>
            <Kicker style={{ marginBottom:8 }}>{s.name} · −{s.deficit} kcal/day</Kicker>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.green, marginBottom:5, fontWeight:300 }}>
              <strong style={{ fontWeight:600 }}>↑ </strong>{s.pro}
            </div>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.rose, fontWeight:300 }}>
              <strong style={{ fontWeight:600 }}>↓ </strong>{s.con}
            </div>
          </div>
        ))}
      </div>

      {/* This week's targets */}
      <div style={{ marginTop:56 }}>
        <Kicker style={{ marginBottom:10 }}>This Week · Specific Targets</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:28, letterSpacing:'-0.01em', lineHeight:1.05, color:T.ink, margin:'0 0 4px' }}>
          Starting from <em>{latest.weight.toFixed(1)} kg</em>, where should you be in 7 days?
        </h3>
        <ThickRule style={{ margin:'16px 0 0' }} />
        <ScrollRail minWidth={760}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(180px, 1fr))', borderBottom:`0.5px solid ${T.line}` }}>
            {strategies.map((s,i) => {
              const target = parseFloat(thisWeekTarget(s.deficit));
              const change = target - latest.weight;
              const isRec = s.recommended;
              return (
                <div key={i} style={{ padding:'20px 18px', borderRight: i<3?`0.5px solid ${T.line}`:'none', background: isRec?T.goldSoft:'transparent' }}>
                  <Kicker style={{ marginBottom:10 }} color={isRec?T.gold:undefined}>{s.name}</Kicker>
                  <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                    <span style={{ fontFamily:T.display, fontSize: 20, color:isRec?T.gold:T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{target.toFixed(1)}</span>
                    <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
                  </div>
                  <div style={{ fontFamily:T.sans, fontSize:11, color:T.green, fontWeight:500 }}>
                    {change.toFixed(2)} kg this week
                  </div>
                  <div style={{ fontFamily:T.sans, fontSize:10, color:T.muted, marginTop:4, letterSpacing:'0.05em' }}>
                    {(activeTdee - s.deficit).toLocaleString()} kcal/day
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollRail>
      </div>

      {/* Muscle preservation note */}
      <div style={{ marginTop:40, padding:'24px', background:T.greenSoft, borderLeft:`2px solid ${T.green}` }}>
        <Kicker color={T.green} style={{ marginBottom:10 }}>Muscle Mass · {latest.muscleMass.toFixed(1)}% · Your strongest metric</Kicker>
        <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:0 }}>
          Muscle at {latest.muscleMass.toFixed(1)}% is your best number. Aggressive cuts risk eroding it.{' '}
          <strong style={{ color:T.ink, fontWeight:500 }}>Recommendation:</strong> start with the moderate cut (−500 kcal/day) and pair it with 2–3 resistance sessions per week.
          Ensure protein intake is at least <strong style={{ color:T.ink, fontWeight:500 }}>{Math.round(latest.weight * 1.6)}–{Math.round(latest.weight * 2.0)} g/day</strong> ({(latest.weight*1.6).toFixed(0)}–{(latest.weight*2.0).toFixed(0)} g at current weight) to protect lean mass during the cut.
        </p>
      </div>
    </div>
  );
}

// ─── Periodisation Phases ─────────────────────────────────────────────────────

function projectedBF(targetWeight: number, r: FitnessReading): number {
  // 80% of weight lost = fat, 20% = lean mass (realistic for a calorie deficit + resistance training)
  const fatKg  = r.weight * (r.bodyFat / 100);
  const leanKg = r.weight - fatKg;
  const lost   = r.weight - targetWeight;
  const newFat = Math.max(0, fatKg - lost * 0.8);
  const newLean = leanKg - lost * 0.2;
  return (newFat / targetWeight) * 100;
}

function weeksToWeight(latest: FitnessReading, target: number, deficitKcal: number): number {
  const kgPerWeek = deficitKcal / 7700 * 7;
  return Math.max(0, (latest.weight - target) / kgPerWeek);
}

function addWeeks(fromDate: string, weeks: number): Date {
  return new Date(new Date(fromDate).getTime() + weeks * 7 * 86400000);
}

interface Phase {
  id: number;
  type: 'cut' | 'break' | 'recomp' | 'maintain' | 'bulk';
  name: string;
  tagline: string;
  startWeight: number;
  endWeight: number;
  startBF: number;
  endBF: number;
  durationWeeks: number;
  deficit: number | null;   // kcal/day — null = maintenance
  actions: string[];
  trigger: string;          // what unlocks the next phase
  current?: boolean;
}

function Phases({ sorted, goal, reg }: { sorted: FitnessReading[]; goal: number; reg: Reg | null }) {
  const latest  = sorted[sorted.length - 1];
  const deficit = MODERATE_DEFICIT_KCAL;
  const currentNutrition = nutritionTargets(latest);
  const phase78Nutrition = nutritionTargets({ ...latest, weight: 78 });
  const phase70Nutrition = nutritionTargets({ ...latest, weight: 70 });
  const phase65Nutrition = nutritionTargets({ ...latest, weight: 65 });
  const goalNutrition = nutritionTargets({ ...latest, weight: goal });

  // Project body fat at key weight checkpoints
  const bf78 = projectedBF(78, latest);
  const bf70 = projectedBF(70, latest);
  const bf65 = projectedBF(65, latest);
  const bfGoal = projectedBF(goal, latest);

  const w1 = weeksToWeight(latest, 78, deficit);
  const w2 = weeksToWeight(latest, 70, deficit);
  const w3 = weeksToWeight(latest, 65, deficit);
  const w4 = weeksToWeight(latest, goal, deficit);

  // Running calendar date for each phase
  const date0 = latest.date;
  const date1end = addWeeks(date0, w1);
  const date2end = new Date(date1end.getTime() + 3 * 7 * 86400000); // 3-week break
  const date3end = addWeeks(date2end.toISOString().slice(0, 10), w2 - w1);
  const date4end = new Date(date3end.getTime() + 3 * 7 * 86400000);
  const date5end = addWeeks(date4end.toISOString().slice(0, 10), w3 - w2);
  const date6end = addWeeks(date5end.toISOString().slice(0, 10), w4 - w3);

  const phases: Phase[] = [
    {
      id: 1, type: 'cut', current: true,
      name: 'Phase 1 — The Cut',
      tagline: 'Primary fat loss. No bulk until body fat is below 33%.',
      startWeight: latest.weight, endWeight: 78,
      startBF: latest.bodyFat, endBF: bf78,
      durationWeeks: Math.round(w1),
      deficit: 500,
      actions: [
        `Eat at about ${currentNutrition.intake.toLocaleString()} kcal/day on average (training-week maintenance − 500)`,
        `Protein: ${currentNutrition.protein} g/day minimum to protect muscle`,
        'Resistance training 3× per week — this is non-negotiable',
        'Weigh in weekly at the same time. Log every reading.',
        'Target: −0.5 kg per week. Slower is fine; faster is risky.',
      ],
      trigger: `Scale reads 78 kg and body fat estimated below ${bf78.toFixed(0)}%`,
    },
    {
      id: 2, type: 'break',
      name: 'Phase 2 — Diet Break',
      tagline: 'Metabolic reset. Eat at maintenance for 3 weeks.',
      startWeight: 78, endWeight: 78,
      startBF: bf78, endBF: bf78,
      durationWeeks: 3,
      deficit: null,
      actions: [
        `Eat at maintenance (~${phase78Nutrition.maintenance.toLocaleString()} kcal/day with training)`,
        'Continue resistance training — do not stop lifting',
        'This is intentional, not falling off the plan',
        'Restores leptin, cortisol, and training performance',
        'Weight may fluctuate 0.5–1.5 kg — expect this, ignore it',
      ],
      trigger: '3 weeks completed at maintenance',
    },
    {
      id: 3, type: 'cut',
      name: 'Phase 3 — Cut (Continued)',
      tagline: 'Second extended cut. Body fat should now be trending below 40%.',
      startWeight: 78, endWeight: 70,
      startBF: bf78, endBF: bf70,
      durationWeeks: Math.round(w2 - w1),
      deficit: 500,
      actions: [
        'Resume −500 kcal/day deficit',
        `Protein: ${phase78Nutrition.protein} g/day (recalculated for new weight)`,
        'Increase training intensity if energy allows',
        'Body fat is dropping — muscle definition will start to appear',
        'Consider a DEXA scan here to get accurate BF reading',
      ],
      trigger: 'Scale reads 70 kg or 8 weeks completed — whichever comes first',
    },
    {
      id: 4, type: 'break',
      name: 'Phase 4 — Diet Break #2',
      tagline: 'Second metabolic reset before the final push.',
      startWeight: 70, endWeight: 70,
      startBF: bf70, endBF: bf70,
      durationWeeks: 3,
      deficit: null,
      actions: [
        `Eat at maintenance again (~${phase70Nutrition.maintenance.toLocaleString()} kcal/day at 70 kg)`,
        'Focus on progressive overload in the gym',
        'Reassess goal weight here — at this body composition, 60 kg may feel different',
        'Blood markers worth checking: iron, B12, thyroid',
      ],
      trigger: '3 weeks completed',
    },
    {
      id: 5, type: 'recomp',
      name: 'Phase 5 — Recomposition',
      tagline: 'Eat at maintenance. Let training shift the last fat to muscle.',
      startWeight: 70, endWeight: 65,
      startBF: bf70, endBF: bf65,
      durationWeeks: Math.round(w3 - w2),
      deficit: null,
      actions: [
        `Maintenance calories (~${phase70Nutrition.maintenance.toLocaleString()}/day) — not a deficit`,
        'Heavy compound lifts: squat, deadlift, press',
        'Body recomposition is slow — 0.25–0.5 kg fat lost per month, muscle gained simultaneously',
        'Scale weight may barely move — this is intentional',
        'Progress measured in mirror and performance, not scale',
      ],
      trigger: `Body fat below ${bf65.toFixed(0)}% or scale below 65 kg`,
    },
    {
      id: 6, type: 'cut',
      name: 'Phase 6 — Final Cut to Goal',
      tagline: 'One last deficit to cross the finish line.',
      startWeight: 65, endWeight: goal,
      startBF: bf65, endBF: bfGoal,
      durationWeeks: Math.round(w4 - w3),
      deficit: 400,
      actions: [
        `Mild deficit: about ${(phase65Nutrition.maintenance - 400).toLocaleString()} kcal/day (roughly 400 below maintenance)`,
        'Protein stays high — muscle is hard-earned now',
        `Goal weight: ${goal} kg at roughly ${bfGoal.toFixed(0)}% body fat`,
        'Cardio can be added here for the final push',
      ],
      trigger: `Scale reads ${goal} kg for two consecutive weeks`,
    },
    {
      id: 7, type: 'maintain',
      name: 'Phase 7 — Maintenance',
      tagline: 'Hold the goal. Build the habit of staying here.',
      startWeight: goal, endWeight: goal,
      startBF: bfGoal, endBF: bfGoal,
      durationWeeks: 0,
      deficit: null,
      actions: [
        `Eat at maintenance for your new weight (~${goalNutrition.maintenance.toLocaleString()} kcal/day if training stays in place)`,
        'Weigh weekly — intervene early if trending up',
        'Continue resistance training for general health',
        `At ~${bfGoal.toFixed(0)}% body fat you can now consider a lean bulk if you want more muscle`,
        'A lean bulk at this body fat: +200 kcal/day surplus for slow muscle gain',
      ],
      trigger: '12 weeks at stable goal weight',
    },
  ];

  const typeStyles: Record<Phase['type'], { color: string; bg: string; label: string }> = {
    cut:      { color: T.rose,  bg: T.roseSoft,  label: 'CUT'    },
    break:    { color: T.gold,  bg: T.goldSoft,  label: 'BREAK'  },
    recomp:   { color: T.blue,  bg: T.blueSoft,  label: 'RECOMP' },
    maintain: { color: T.green, bg: T.greenSoft, label: 'MAINTAIN'},
    bulk:     { color: T.green, bg: T.greenSoft, label: 'BULK'   },
  };

  const phaseDates = [
    date1end, date2end, date3end, date4end, date5end, date6end,
  ];

  return (
    <div style={{ marginTop: 80 }}>
      <Kicker style={{ marginBottom:10 }}>Section VII · Periodisation</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize: 20, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        When to cut, when to rest, <em>when to build</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        Seven phases from today to goal and beyond — triggered by body fat, not just scale weight.
      </p>

      {/* Key rule */}
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'start', padding:'24px 0', margin:'18px 0 0', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
        <div>
          <Kicker style={{ marginBottom:8 }}>The Rule</Kicker>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize: 24, letterSpacing:'-0.02em', lineHeight:1, color:T.rose }}>
            No bulk
          </span>
        </div>
        <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:'20px 0 0' }}>
          At <strong style={{ color:T.ink }}>{latest.bodyFat.toFixed(1)}% body fat</strong>, a calorie surplus would primarily add fat, not muscle — your body fat stores are already high and insulin sensitivity is reduced. The rule is simple: <em style={{ fontFamily:T.display }}>cut first, build later.</em> A lean bulk only makes sense once body fat is below ~25%. That comes in Phase 7 at the earliest.
        </p>
      </div>

      {/* Phase list */}
      <div style={{ marginTop:40 }}>
        {phases.map((ph, i) => {
          const ts = typeStyles[ph.type];
          const endDate = phaseDates[i];
          return (
            <div key={ph.id} style={{
              display:'grid', gridTemplateColumns:'160px 1fr',
              gap:0, borderBottom:`0.5px solid ${ph.current ? T.ink : T.softLine}`,
              background: ph.current ? T.goldSoft : 'transparent',
              margin: ph.current ? '0 -20px' : 0,
              padding: ph.current ? '0 20px' : 0,
            }}>
              {/* Left: phase marker */}
              <div style={{ padding:'28px 24px 28px 0', borderRight:`0.5px solid ${ph.current ? T.gold : T.line}`, display:'flex', flexDirection:'column', gap:10 }}>
                <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.22em', padding:'3px 8px', background:ts.bg, color:ts.color, display:'inline-block', width:'fit-content' }}>
                  {ts.label}
                </span>
                <div style={{ fontFamily:T.display, fontWeight:400, fontSize:13, color:T.muted, lineHeight:1.4 }}>
                  {ph.startWeight.toFixed(0)}→{ph.endWeight.toFixed(0)} kg
                </div>
                {ph.durationWeeks > 0 && (
                  <Kicker color={T.muted}>{ph.durationWeeks} weeks</Kicker>
                )}
                {endDate && ph.durationWeeks > 0 && (
                  <Kicker color={ph.current ? T.gold : T.muted} style={{ fontSize:9 }}>
                    ~{endDate.toLocaleDateString('en-GB', { month:'short', year:'numeric' })}
                  </Kicker>
                )}
                {ph.current && (
                  <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:700, letterSpacing:'0.2em', color:T.gold }}>← YOU ARE HERE</span>
                )}
              </div>

              {/* Right: phase detail */}
              <div style={{ padding:'28px 0 28px 28px' }}>
                <div style={{ marginBottom:8 }}>
                  <span style={{ fontFamily:T.display, fontWeight:400, fontSize:20, color: ph.current ? T.gold : T.ink }}>
                    {ph.name}
                  </span>
                </div>
                <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.body, margin:'0 0 16px', lineHeight:1.5 }}>
                  {ph.tagline}
                </p>

                {/* BF projection */}
                <div style={{ display:'inline-flex', gap:24, marginBottom:16, padding:'10px 14px', background: ph.current ? 'rgba(255,255,255,0.5)' : T.surface }}>
                  <div>
                    <Kicker style={{ marginBottom:3 }}>Start BF</Kicker>
                    <span style={{ fontFamily:T.display, fontSize:20, color:T.rose }}>{ph.startBF.toFixed(1)}%</span>
                  </div>
                  <div style={{ borderLeft:`0.5px solid ${T.line}`, paddingLeft:24 }}>
                    <Kicker style={{ marginBottom:3 }}>End BF (est.)</Kicker>
                    <span style={{ fontFamily:T.display, fontSize:20, color:T.green }}>{ph.endBF.toFixed(1)}%</span>
                  </div>
                  {ph.deficit !== null && (
                    <div style={{ borderLeft:`0.5px solid ${T.line}`, paddingLeft:24 }}>
                      <Kicker style={{ marginBottom:3 }}>Daily deficit</Kicker>
                      <span style={{ fontFamily:T.display, fontSize:20, color:T.ink }}>−{ph.deficit} kcal</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 14px', display:'flex', flexDirection:'column', gap:5 }}>
                  {ph.actions.map((a,j) => (
                    <li key={j} style={{ fontFamily:T.sans, fontSize:13, fontWeight:300, color:T.body, lineHeight:1.5, paddingLeft:16, position:'relative' }}>
                      <span style={{ position:'absolute', left:0, color:T.muted }}>—</span>
                      {a}
                    </li>
                  ))}
                </ul>

                {/* Trigger */}
                <div style={{ padding:'8px 12px', borderLeft:`2px solid ${ts.color}`, background:ts.bg }}>
                  <Kicker color={ts.color} style={{ marginBottom:3 }}>Next phase unlocks when</Kicker>
                  <p style={{ fontFamily:T.sans, fontSize:12, color:T.body, margin:0, fontWeight:300 }}>{ph.trigger}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary timeline strip */}
      <div style={{ marginTop:48 }}>
        <Kicker style={{ marginBottom:14 }}>Full Timeline at −500 kcal/day Moderate Cut</Kicker>
        <div style={{ display:'flex', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
          {phases.filter(ph => ph.durationWeeks > 0 || ph.id === 7).map((ph,i) => {
            const ts  = typeStyles[ph.type];
            const flex = Math.max(ph.durationWeeks, 3);
            return (
              <div key={ph.id} style={{ flex, padding:'14px 10px', borderRight:`0.5px solid ${T.line}`, background: ph.current ? T.goldSoft : 'transparent', minWidth:0 }}>
                <span style={{ display:'block', fontFamily:T.sans, fontSize:8, fontWeight:700, letterSpacing:'0.2em', color:ts.color, marginBottom:5 }}>{ts.label}</span>
                <span style={{ display:'block', fontFamily:T.display, fontStyle:'italic', fontSize:11, color:T.ink, lineHeight:1.2, marginBottom:4 }}>
                  {ph.endWeight === ph.startWeight ? `${ph.startWeight.toFixed(0)} kg` : `${ph.startWeight.toFixed(0)}→${ph.endWeight.toFixed(0)} kg`}
                </span>
                {ph.durationWeeks > 0 && <Kicker style={{ fontSize:8 }}>{ph.durationWeeks}wk</Kicker>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Practical Insights ───────────────────────────────────────────────────────

function Insights({ sorted, reg, goal }: { sorted:FitnessReading[]; reg:Reg|null; goal:number }) {
  const latest = sorted[sorted.length-1];
  const slopePerWeek = reg ? reg.slope * 7 : 0;
  const toGo = latest.weight - goal;
  // Calories: 1 kg fat ≈ 7700 kcal
  const defFor05kgWk = Math.round(7700 * 0.5 / 7);
  const defFor1kgWk  = Math.round(7700 * 1.0 / 7);

  const items = [
    {
      kicker: 'What it takes · Calorie deficit needed',
      value: `${defFor05kgWk} – ${defFor1kgWk}`,
      unit: 'kcal / day',
      note: `A deficit of ${defFor05kgWk} kcal/day produces roughly 0.5 kg loss per week. ${defFor1kgWk} kcal/day delivers 1 kg/week — the upper safe limit. At 0.5 kg/week it would take about ${Math.ceil(toGo/(0.5*52)*12)} months to reach goal.`,
      color: T.blue,
    },
    {
      kicker: 'The current picture · Body fat',
      value: latest.bodyFat.toFixed(1),
      unit: '%',
      note: `Healthy body fat for women is 21–33%. Yours at ${latest.bodyFat.toFixed(1)}% is above that range. Each kilogram lost through diet and exercise should shift mostly fat, not muscle — which remains strong at ${latest.muscleMass.toFixed(1)}%.`,
      color: T.rose,
    },
    {
      kicker: 'The positive · Muscle mass',
      value: latest.muscleMass.toFixed(1),
      unit: '%',
      note: `Muscle mass above 45% is considered strong. Yours is ${latest.muscleMass.toFixed(1)}% — a genuine asset. Prioritise resistance training alongside any calorie reduction so that muscle is preserved as weight falls.`,
      color: T.green,
    },
    {
      kicker: 'Hydration · Body water',
      value: latest.water.toFixed(1),
      unit: '%',
      note: `Healthy body water for women is typically 45–60%. At ${latest.water.toFixed(1)}% you are below range. Aim for 2–3 litres of water per day; hydration also directly affects the accuracy of bioelectrical impedance readings from your scale.`,
      color: T.gold,
    },
  ];

  return (
    <div style={{ marginTop:64 }}>
      <Kicker style={{ marginBottom:10 }}>Section VIII · Insights</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize: 20, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        What the numbers <em>are saying</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        Practical context behind each figure.
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />
      <div style={{ borderBottom:`0.5px solid ${T.line}` }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'1fr 1.6fr',
            padding:'28px 0', borderBottom: i<items.length-1 ? `0.5px solid ${T.softLine}` : 'none',
            gap:40, alignItems:'start',
          }}>
            <div>
              <Kicker style={{ marginBottom:12 }}>{item.kicker}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:T.display, fontWeight:400, fontSize: 24, color:item.color, letterSpacing:'-0.02em', lineHeight:1 }}>{item.value}</span>
                <span style={{ fontFamily:T.sans, fontSize:12, color:T.muted }}>{item.unit}</span>
              </div>
            </div>
            <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:'28px 0 0' }}>
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Monthly Bar Chart ────────────────────────────────────────────────────────

interface MonthBar { ym: string; label: string; change: number; weight: number; readings: number; }

function monthlyDeltas(sorted: FitnessReading[]): MonthBar[] {
  const buckets: Record<string, FitnessReading[]> = {};
  for (const r of sorted) {
    const ym = r.date.slice(0, 7);
    (buckets[ym] = buckets[ym] || []).push(r);
  }
  const keys = Object.keys(buckets).sort();
  const out: MonthBar[] = [];
  let prev: number | null = null;
  for (const k of keys) {
    const rs = buckets[k];
    const last = rs[rs.length - 1];
    const change = prev === null ? 0 : last.weight - prev;
    const [y, m] = k.split('-');
    const dt = new Date(parseInt(y), parseInt(m) - 1, 1);
    out.push({
      ym: k,
      label: dt.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      change,
      weight: last.weight,
      readings: rs.length,
    });
    prev = last.weight;
  }
  return out.slice(1); // drop first (no delta)
}

function MonthlyBarChart({ sorted }: { sorted: FitnessReading[] }) {
  const data = monthlyDeltas(sorted);
  if (data.length === 0) return null;
  const W = 1000, H = 280;
  const PAD = { top: 24, right: 24, bottom: 60, left: 50 };
  const iW = W - PAD.left - PAD.right, iH = H - PAD.top - PAD.bottom;
  const maxAbs = Math.max(...data.map(d => Math.abs(d.change)), 1);
  const yMid = PAD.top + iH / 2;
  const yS = (v: number) => yMid - (v / maxAbs) * (iH / 2);
  const barW = iW / data.length * 0.78;
  const barGap = iW / data.length;

  const totalLost = data.filter(d => d.change < 0).reduce((a, d) => a + d.change, 0);
  const totalGained = data.filter(d => d.change > 0).reduce((a, d) => a + d.change, 0);
  const netChange = data.reduce((a, d) => a + d.change, 0);

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:14 }}>
        {[
          { l:'Total Lost',   v:`${totalLost.toFixed(1)} kg`,    c:T.green },
          { l:'Total Gained', v:`+${totalGained.toFixed(1)} kg`, c:T.rose  },
          { l:'Net Change',   v:`${netChange>0?'+':''}${netChange.toFixed(1)} kg`, c: netChange > 0 ? T.rose : T.green },
        ].map((m,i)=>(
          <div key={i} style={{ padding:'18px 20px', borderRight: i<2 ? `0.5px solid ${T.line}` : 'none' }}>
            <Kicker style={{ marginBottom:8 }}>{m.l}</Kicker>
            <span style={{ fontFamily:T.display, fontSize: 20, color:m.c, letterSpacing:'-0.02em' }}>{m.v}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block' }}>
        {/* zero line */}
        <line x1={PAD.left} y1={yMid} x2={PAD.left+iW} y2={yMid} stroke={T.ink} strokeWidth="1" />
        {/* y ticks */}
        {[-maxAbs, -maxAbs/2, 0, maxAbs/2, maxAbs].map((v,i)=>(
          <g key={i}>
            <line x1={PAD.left} y1={yS(v)} x2={PAD.left+iW} y2={yS(v)} stroke={T.softLine} strokeWidth="0.5" />
            <text x={PAD.left-6} y={yS(v)+3} textAnchor="end" fontFamily={T.sans} fontSize="10" fill={T.muted}>{v.toFixed(1)}</text>
          </g>
        ))}
        {/* bars */}
        {data.map((d,i) => {
          const x = PAD.left + i*barGap + (barGap-barW)/2;
          const y = d.change >= 0 ? yS(d.change) : yMid;
          const h = Math.abs(yS(d.change) - yMid);
          const color = d.change > 0 ? T.rose : d.change < 0 ? T.green : T.muted;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill={color} opacity="0.9" />
              {Math.abs(d.change) >= 0.5 && (
                <text
                  x={x + barW/2}
                  y={d.change >= 0 ? y - 4 : y + h + 12}
                  textAnchor="middle"
                  fontFamily={T.display} fontSize="10" fontStyle="italic"
                  fill={color}
                >
                  {d.change > 0 ? '+' : ''}{d.change.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
        {/* x labels - every 3rd */}
        {data.map((d,i) => (
          (i % 3 === 0 || i === data.length-1) && (
            <text key={i} x={PAD.left + i*barGap + barGap/2} y={H-22} textAnchor="middle" fontFamily={T.sans} fontSize="10" fill={T.muted}>
              {d.label}
            </text>
          )
        ))}
        {/* axis labels */}
        <text x={PAD.left} y={H-4} fontFamily={T.sans} fontSize="9" fill={T.muted} letterSpacing="0.18em">LOSS ↓ / GAIN ↑ PER MONTH</text>
      </svg>
    </div>
  );
}

// ─── Composition Pie Chart ────────────────────────────────────────────────────

interface Slice { label: string; pct: number; kg: number; color: string }

function donutSlices(slices: Slice[], cx: number, cy: number, rOuter: number, rInner: number) {
  let cum = 0;
  return slices.map((s, i) => {
    const start = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    cum += s.pct;
    const end = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    const large = s.pct > 50 ? 1 : 0;
    const x1o = cx + rOuter * Math.cos(start), y1o = cy + rOuter * Math.sin(start);
    const x2o = cx + rOuter * Math.cos(end),   y2o = cy + rOuter * Math.sin(end);
    const x1i = cx + rInner * Math.cos(end),   y1i = cy + rInner * Math.sin(end);
    const x2i = cx + rInner * Math.cos(start), y2i = cy + rInner * Math.sin(start);
    const d = [
      `M ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
      `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)}`,
      `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
      `A ${rInner} ${rInner} 0 ${large} 0 ${x2i.toFixed(2)} ${y2i.toFixed(2)}`,
      'Z',
    ].join(' ');
    const midAngle = (start + end) / 2;
    const labelR = (rOuter + rInner) / 2;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    return { ...s, d, lx, ly, key: i };
  });
}

function PieComposition({ latest, goal, weightLabel }: { latest: FitnessReading; goal: number; weightLabel: string }) {
  // Current
  const fatKg     = +(latest.weight * latest.bodyFat / 100).toFixed(1);
  const muscleKg  = +(latest.weight * latest.muscleMass / 100).toFixed(1);
  const boneKg    = +(latest.weight * latest.boneMass / 100).toFixed(1);
  const currentSlices: Slice[] = [
    { label:'Fat',    pct:latest.bodyFat,    kg:fatKg,    color:T.rose  },
    { label:'Muscle', pct:latest.muscleMass, kg:muscleKg, color:T.green },
    { label:'Bone',   pct:latest.boneMass,   kg:boneKg,   color:T.gold  },
  ];
  // Goal composition (target 25% body fat, preserve muscle mass kg)
  const goalFatPct = 25;
  const goalFatKg  = +(goal * goalFatPct / 100).toFixed(1);
  const goalMuscleKg = muscleKg; // assume preserved
  const goalMusclePct = +(goalMuscleKg / goal * 100).toFixed(1);
  const goalBoneKg = boneKg;
  const goalBonePct = +(goalBoneKg / goal * 100).toFixed(1);
  const goalSlices: Slice[] = [
    { label:'Fat',    pct:goalFatPct,    kg:goalFatKg,    color:T.rose  },
    { label:'Muscle', pct:goalMusclePct, kg:goalMuscleKg, color:T.green },
    { label:'Bone',   pct:goalBonePct,   kg:goalBoneKg,   color:T.gold  },
  ];

  const W = 244, H = 244;
  const cx = W/2, cy = H/2;
  const rO = 96, rI = 54;

  const renderPie = (slices: Slice[], heading: string, totalKg: number, sub: string) => {
    const wedges = donutSlices(slices, cx, cy, rO, rI);
    return (
      <div style={{ padding:'20px 28px', textAlign:'center' }}>
        <Kicker style={{ marginBottom:10 }}>{heading}</Kicker>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', maxWidth:244, height:'auto' }}>
          {wedges.map(w => <path key={w.key} d={w.d} fill={w.color} opacity="0.85" />)}
          <text x={cx} y={cy-6} textAnchor="middle" fontFamily={T.display} fontSize="28" fill={T.ink} letterSpacing="-0.02em">
            {totalKg.toFixed(1)}
          </text>
          <text x={cx} y={cy+17} textAnchor="middle" fontFamily={T.sans} fontSize="10" fill={T.muted} letterSpacing="0.18em">KG TOTAL</text>
        </svg>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:13, color:T.muted, margin:'8px 0 0' }}>{sub}</p>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, gap:0 }}>
        <div style={{ borderRight:`0.5px solid ${T.line}` }}>
          {renderPie(currentSlices, `${weightLabel} · the current composition`, latest.weight, `at ${latest.weight} kg`)}
        </div>
        <div>
          {renderPie(goalSlices, `At ${goal} kg · the target composition`, goal, 'estimated at 25% body fat')}
        </div>
      </div>

      {/* Legend with kg/% breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px, 1fr))', marginTop:24, borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}` }}>
        {currentSlices.map((s, i) => {
          const gs = goalSlices[i];
          const delta = gs.kg - s.kg;
          return (
            <div key={s.label} style={{ padding:'18px 22px', borderRight: i<2 ? `0.5px solid ${T.line}` : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ display:'inline-block', width:10, height:10, background:s.color }} />
                <Kicker>{s.label}</Kicker>
              </div>
              <div style={{ fontFamily:T.display, fontSize:24, color:T.ink, marginBottom:4 }}>{s.kg} → {gs.kg} kg</div>
              <div style={{ fontFamily:T.sans, fontSize:12, color: delta < 0 ? T.green : T.gold, fontWeight:500 }}>
                {delta > 0 ? '+' : ''}{delta.toFixed(1)} kg shift
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Health Tab ───────────────────────────────────────────────────────────────

function HealthTab({ sorted, goal, reg }: { sorted: FitnessReading[]; goal: number; reg: Reg | null }) {
  const [range, setRange] = useState<'all' | '2y' | '1y' | '6m'>('all');
  const latest = sorted[sorted.length - 1];
  const weightLabel = isoDay(latest.date) === localIsoDate() ? 'Today' : 'Latest';
  const first  = sorted[0];
  const startMs = new Date(first.date).getTime();
  const lastMs  = new Date(latest.date).getTime();
  const daysObserved = Math.round((lastMs - startMs) / 86400000);

  // Visceral fat trend (filter readings with VF > 0)
  const vfReadings = sorted.filter(r => r.visceralFat && r.visceralFat > 0);
  const latestVF = vfReadings[vfReadings.length - 1]?.visceralFat ?? 0;
  const firstVF  = vfReadings[0]?.visceralFat ?? 0;

  // Weight extremes
  const minWeight = Math.min(...sorted.map(r => r.weight));
  const maxWeight = Math.max(...sorted.map(r => r.weight));
  const minDate = sorted.find(r => r.weight === minWeight)!.date;
  const maxDate = sorted.find(r => r.weight === maxWeight)!.date;

  // Slope last 8 weeks
  const last8 = sorted.slice(-8);
  const r8 = regress(last8);
  const recentSlope = r8 ? r8.slope * 7 : 0;

  // Health flag heuristics
  const healthFlags = [
    {
      label: 'Visceral Fat',
      value: `${latestVF}`,
      status: latestVF <= 9 ? ['HEALTHY', T.green] : latestVF <= 14 ? ['HIGH', T.gold] : ['VERY HIGH', T.rose],
      note: 'Visceral fat over 9 is associated with elevated cardiovascular risk. Aim for ≤9.',
      change: latestVF - firstVF,
    },
    {
      label: 'BMI',
      value: latest.bmi.toFixed(1),
      status: latest.bmi < 25 ? ['HEALTHY', T.green] : latest.bmi < 30 ? ['HIGH', T.gold] : ['OBESE', T.rose],
      note: 'Healthy BMI range is 18.5–24.9. You crossed into obesity (≥30) around late 2024.',
      change: latest.bmi - first.bmi,
    },
    {
      label: 'Body Fat %',
      value: `${latest.bodyFat.toFixed(1)}%`,
      status: latest.bodyFat < 33 ? ['HEALTHY', T.green] : latest.bodyFat < 39 ? ['HIGH', T.gold] : ['VERY HIGH', T.rose],
      note: 'Healthy body fat for women is 21–33%. Reducing this is the primary goal.',
      change: latest.bodyFat - first.bodyFat,
    },
    {
      label: 'Body Water %',
      value: `${latest.water.toFixed(1)}%`,
      status: latest.water >= 45 ? ['HEALTHY', T.green] : ['LOW', T.gold],
      note: 'Water % naturally drops as body fat % rises. Stays low until fat decreases.',
      change: latest.water - first.water,
    },
  ];

  const strip = [
    {
      label:'Weight',
      value:`${latest.weight.toFixed(1)} kg`,
      meta:`${(latest.weight - first.weight) >= 0 ? '+' : ''}${(latest.weight - first.weight).toFixed(1)} since start`,
      color:latest.weight <= goal ? T.green : T.gold,
    },
    {
      label:'Body fat',
      value:`${latest.bodyFat.toFixed(1)}%`,
      meta:`${(latest.bodyFat - first.bodyFat) >= 0 ? '+' : ''}${(latest.bodyFat - first.bodyFat).toFixed(1)} pts`,
      color:latest.bodyFat < 33 ? T.green : latest.bodyFat < 39 ? T.gold : T.rose,
    },
    {
      label:'BMI',
      value:latest.bmi.toFixed(1),
      meta:latest.bmi < 25 ? 'Healthy band' : latest.bmi < 30 ? 'Above range' : 'Obese band',
      color:latest.bmi < 25 ? T.green : latest.bmi < 30 ? T.gold : T.rose,
    },
    {
      label:'Water',
      value:`${latest.water.toFixed(1)}%`,
      meta:latest.water >= 45 ? 'In range' : 'Low reading',
      color:latest.water >= 45 ? T.green : T.gold,
    },
    {
      label:'Muscle',
      value:`${latest.muscleMass.toFixed(1)}%`,
      meta:`${latest.muscleMass >= 45 ? 'Strong' : latest.muscleMass >= 38 ? 'Average' : 'Low'} signal`,
      color:latest.muscleMass >= 45 ? T.green : latest.muscleMass >= 38 ? T.gold : T.rose,
    },
    {
      label:'Bone',
      value:`${latest.boneMass.toFixed(2)}%`,
      meta:latest.boneMass >= 3 ? 'Healthy floor' : 'Watch trend',
      color:latest.boneMass >= 3 ? T.green : T.gold,
    },
  ];

  const notes = [
    'All graphs now live here, so Overview can stay focused on the next decision instead of repeating the same visuals.',
    'Read the long-term line before reacting to a single morning. The monthly change bars and the phase-banded chart matter more than one awkward weigh-in.',
    latest.water < 45
      ? 'Water is still reading low, which often tracks with higher body fat on these scale models. Use it as context, not panic.'
      : 'Water is holding up better here, which makes the body-composition readout a bit easier to trust.',
  ];

  return (
    <div>
      <section style={{
        background:'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(251,248,243,0.98) 100%)',
        border:`1px solid ${T.line}`,
        boxShadow:CARD_SHADOW,
        overflow:'hidden',
        marginBottom:24,
      }}>
        <div style={{ padding:'22px 24px 18px' }}>
          <div style={{ display:'flex', gap:24, alignItems:'flex-end', flexWrap:'wrap' }}>
            <div style={{ flex:'1 1 560px', minWidth:0 }}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                <FitPill color={T.body}>Health section</FitPill>
                <FitPill color={T.gold} background={`${T.gold}12`}>All graphs live here</FitPill>
              </div>
              <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:36, letterSpacing:'-0.03em', lineHeight:0.94, color:T.ink, margin:'0 0 10px', maxWidth:'12ch' }}>
                Health, trend and <em style={{ color:T.gold, fontStyle:'italic' }}>composition</em>.
              </h2>
              <p style={{ fontFamily:T.sans, fontSize:14, color:T.body, fontWeight:300, lineHeight:1.75, margin:'0 0 12px', maxWidth:'60ch' }}>
                This section now keeps the visual story in one place: the weight timeline, the longer-term line, the monthly pattern, and the composition changes that explain what the scale is doing.
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', fontFamily:T.sans, fontSize:11, color:T.muted }}>
                <span>{sorted.length} readings</span>
                <span style={{ width:4, height:4, borderRadius:'50%', background:T.muted }} />
                <span>{daysObserved} days observed</span>
                <span style={{ width:4, height:4, borderRadius:'50%', background:T.muted }} />
                <span>{fmtDate(first.date)} → {fmtDate(latest.date)}</span>
              </div>
            </div>

            <div style={{ flex:'1 1 260px', padding:'16px 18px', border:`1px solid ${T.line}`, background:'rgba(255,255,255,0.76)' }}>
              <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.muted, marginBottom:8 }}>
                Current body fat
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:8 }}>
                <span style={{ fontFamily:T.display, fontSize:52, color:T.ink, letterSpacing:'-0.04em', lineHeight:0.92 }}>
                  {latest.bodyFat.toFixed(1)}
                </span>
                <span style={{ fontFamily:T.sans, fontSize:16, color:T.muted }}>%</span>
              </div>
              <div style={{ fontFamily:T.sans, fontSize:11, fontWeight:600, color:(latest.bodyFat - first.bodyFat) <= 0 ? T.green : T.rose, marginBottom:8 }}>
                {(latest.bodyFat - first.bodyFat) <= 0 ? 'Down' : 'Up'} {Math.abs(latest.bodyFat - first.bodyFat).toFixed(1)} points since the first reading
              </div>
              <p style={{ fontFamily:T.sans, fontSize:11, color:T.body, fontWeight:300, lineHeight:1.6, margin:0 }}>
                Body fat is the clearest partner metric for interpreting the scale alongside water, muscle and visceral fat.
              </p>
            </div>
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',
          background:'rgba(250,248,243,0.92)',
          borderTop:`1px solid ${T.softLine}`,
        }}>
          {strip.map((item, index) => (
            <div key={item.label} style={{ padding:'14px 16px', borderRight:index < strip.length - 1 ? `1px solid ${T.softLine}` : 'none' }}>
              <div style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:T.muted, marginBottom:7 }}>
                {item.label}
              </div>
              <div style={{ fontFamily:T.display, fontSize:22, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.02, marginBottom:5 }}>
                {item.value}
              </div>
              <div style={{ fontFamily:T.sans, fontSize:11, color:item.color, fontWeight:500, lineHeight:1.45 }}>
                {item.meta}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 680px', display:'flex', flexDirection:'column', gap:20, minWidth:0 }}>
          <FitPanel
            title={<>Weight <em style={{ color:T.gold }}>timeline</em></>}
            subtitle="Raw readings, a smoothed line, and phase bands in the calmer reference layout."
            actions={
              <div style={{ display:'inline-flex', border:`1px solid ${T.line}`, borderRadius:999, overflow:'hidden', background:'rgba(255,255,255,0.88)' }}>
                {([
                  { key:'all', label:'All' },
                  { key:'2y', label:'2Y' },
                  { key:'1y', label:'1Y' },
                  { key:'6m', label:'6M' },
                ] as const).map((option, index, arr) => {
                  const active = range === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setRange(option.key)}
                      style={{
                        padding:'5px 10px',
                        border:0,
                        borderRight:index < arr.length - 1 ? `1px solid ${T.softLine}` : 'none',
                        background:active ? T.ink : 'transparent',
                        color:active ? T.paper : T.muted,
                        fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace',
                        fontSize:10,
                        cursor:'pointer',
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            }
          >
            <PhaseChart sorted={sorted} goal={goal} range={range} />
          </FitPanel>

          {reg && (
            <FitPanel
              title={<>Current <em style={{ color:T.gold }}>trajectory</em></>}
              subtitle="Observed weight plus the ninety-day projection, kept here so forecasts stay beside the rest of the visual story."
            >
              <div style={{ marginTop:-12 }}>
                <TrendChart sorted={sorted} reg={reg} goal={goal} />
              </div>
            </FitPanel>
          )}

          <FitPanel
            title={<>Monthly change <em style={{ color:T.gold }}>pattern</em></>}
            subtitle="The short loss streaks and the longer gain streaks are much easier to read month by month."
          >
            <MonthlyBarChart sorted={sorted} />
          </FitPanel>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20 }}>
            <FitPanel
              title={<>Composition <em style={{ color:T.gold }}>trend</em></>}
              subtitle="Body fat, muscle and water moving together."
            >
              <CompositionChart sorted={sorted} />
            </FitPanel>

            <FitPanel
              title={<>BMI <em style={{ color:T.gold }}>zones</em></>}
              subtitle="The long view of where the weight line has sat relative to healthy bands."
            >
              <div style={{ marginTop:-12 }}>
                <BMIChart sorted={sorted} />
              </div>
            </FitPanel>
          </div>

          <FitPanel
            title={<>Current vs goal <em style={{ color:T.gold }}>composition</em></>}
            subtitle="Where the kilograms sit now, and what has to move if muscle is preserved on the way to goal."
          >
            <PieComposition latest={latest} goal={goal} weightLabel={weightLabel} />
          </FitPanel>
        </div>

        <aside style={{ flex:'1 1 300px', display:'flex', flexDirection:'column', gap:20, minWidth:'min(100%, 300px)' }}>
          <FitPanel
            title={<>Marker <em style={{ color:T.gold }}>guide</em></>}
            subtitle="The numbers worth checking alongside weight."
          >
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {healthFlags.map((flag) => {
                const [statusText, statusColor] = flag.status;
                return (
                  <div key={flag.label} style={{ border:`1px solid ${T.softLine}`, background:T.surface, padding:'12px 12px 10px' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:8 }}>
                      <Kicker>{flag.label}</Kicker>
                      <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:statusColor }}>
                        {statusText}
                      </span>
                    </div>
                    <div style={{ fontFamily:T.display, fontSize:24, color:T.ink, letterSpacing:'-0.02em', lineHeight:1, marginBottom:6 }}>
                      {flag.value}
                    </div>
                    <div style={{ fontFamily:T.sans, fontSize:10, color:flag.change > 0 ? T.rose : flag.change < 0 ? T.green : T.muted, fontWeight:600, letterSpacing:'0.08em', marginBottom:8 }}>
                      {flag.change > 0 ? 'Up' : flag.change < 0 ? 'Down' : 'Flat'} {Math.abs(flag.change).toFixed(1)} since start
                    </div>
                    <p style={{ fontFamily:T.sans, fontSize:11, color:T.body, fontWeight:300, lineHeight:1.6, margin:0 }}>
                      {flag.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </FitPanel>

          <FitPanel
            title={<>Journey <em style={{ color:T.gold }}>landmarks</em></>}
            subtitle="The outer limits and the recent line in one glance."
          >
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Lightest', value:`${minWeight} kg`, meta:fmtDate(minDate), color:T.green },
                { label:'Heaviest', value:`${maxWeight} kg`, meta:fmtDate(maxDate), color:T.rose },
                { label:'Range', value:`${(maxWeight - minWeight).toFixed(1)} kg`, meta:'peak to trough', color:T.gold },
                { label:'Last 8 weeks', value:`${recentSlope >= 0 ? '+' : ''}${recentSlope.toFixed(2)} kg/wk`, meta:'recent slope', color:recentSlope >= 0 ? T.rose : T.green },
              ].map((item) => (
                <div key={item.label} style={{ border:`1px solid ${T.softLine}`, background:T.surface, padding:'12px 12px 10px' }}>
                  <Kicker style={{ marginBottom:8 }}>{item.label}</Kicker>
                  <div style={{ fontFamily:T.display, fontSize:22, color:item.color, letterSpacing:'-0.02em', lineHeight:1, marginBottom:6 }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily:T.sans, fontSize:11, color:T.body, fontWeight:300, lineHeight:1.5 }}>
                    {item.meta}
                  </div>
                </div>
              ))}
            </div>
          </FitPanel>

          <FitPanel
            title={<>Read it <em style={{ color:T.gold }}>calmly</em></>}
            subtitle="What matters most when the charts feel loud."
          >
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {notes.map((note, index) => (
                <p key={index} style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.65, margin:0 }}>
                  {note}
                </p>
              ))}
            </div>
          </FitPanel>
        </aside>
      </div>
    </div>
  );
}

// ─── The Plan ────────────────────────────────────────────────────────────────

function PlanTab({ sorted, goal, state, setTab }: { sorted: FitnessReading[]; goal: number; state: State; setTab: (t: string) => void }) {
  const latest = sorted[sorted.length - 1];
  const { activeTdee, intake, protein } = nutritionTargets(latest);
  const goalDate = new Date(new Date(latest.date).getTime() + ((latest.weight - goal) / 0.45 * 7) * 86400000);

  const sectionGap = { marginTop: 64 };

  return (
    <div>
      <PlanOpener state={state} sorted={sorted} setTab={setTab} />

      <Kicker style={{ marginBottom:10 }}>Section · The Solid Plan</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize: 24, letterSpacing:'-0.025em', lineHeight:0.98, color:T.ink, margin:'0 0 12px' }}>
        A plan you can <em>actually follow</em>.
      </h2>
      <p style={{ fontFamily:T.sans, fontSize:14, color:T.body, fontWeight:300, margin:'0 0 36px', maxWidth:'56ch', lineHeight:1.7 }}>
        The essentials stay visible. The more detailed examples and troubleshooting live in expandable sections so the page feels usable instead of endless.
      </p>

      {/* The Mission */}
      <div style={{ background:T.surface, border:`0.5px solid ${T.line}`, padding:'32px 36px', marginBottom:48 }}>
        <Kicker style={{ marginBottom:14 }}>The Mission</Kicker>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:24, alignItems:'baseline' }}>
          <div>
            <div style={{ fontFamily:T.display, fontSize: 24, color:T.rose, letterSpacing:'-0.02em', lineHeight:1 }}>{latest.weight}</div>
            <Kicker color={T.muted} style={{ marginTop:6 }}>FROM (kg)</Kicker>
          </div>
          <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.muted, textAlign:'center' }}>→</div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:T.display, fontSize: 24, color:T.gold, letterSpacing:'-0.02em', lineHeight:1 }}>{goal.toFixed(0)}</div>
            <Kicker color={T.muted} style={{ marginTop:6 }}>TO (kg)</Kicker>
          </div>
        </div>
        <Rule style={{ margin:'24px 0' }} />
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:20, color:T.ink, margin:0, lineHeight:1.5 }}>
          {(latest.weight-goal).toFixed(1)} kilograms in roughly{' '}
          <em style={{ color:T.gold }}>{goalDate.toLocaleDateString('en-GB',{month:'long', year:'numeric'})}</em>.
          Sustainable rate. No crash diets.
        </p>
      </div>

      {/* Non-negotiables */}
      <div>
        <Kicker style={{ marginBottom:10 }}>I · The Five Non-Negotiables</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize: 20, letterSpacing:'-0.015em', lineHeight:1.06, color:T.ink, margin:'0 0 24px' }}>
          Rules that don&apos;t bend, <em>ever</em>.
        </h3>
        <ThickRule />
        {[
          {n:'01', r:'Weigh in every Monday morning',                                        d:'Same time, same clothing (or none). One number per week — that is the data point. Ignore daily fluctuation.'},
          {n:'02', r:`Eat around ${intake.toLocaleString()} kcal per day on average`,        d:`This assumes you are training. It uses an exercising-week TDEE of about ${activeTdee.toLocaleString()} kcal and applies a 500-kcal moderate deficit.`},
          {n:'03', r:`Hit ${protein}g of protein every day`,                                 d:'1.8g per kg of bodyweight. This protects muscle during the deficit. Non-negotiable on training days especially.'},
          {n:'04', r:'Lift three times per week, minimum',                                   d:'45-60 minute sessions. Compound movements. Progressive overload. Walks do not count as resistance training.'},
          {n:'05', r:'Log every reading, every meal, every session',                         d:'Even the bad weeks. Especially the bad weeks. Data with gaps cannot be analysed.'},
        ].map(rule => (
          <div key={rule.n} style={{ display:'grid', gridTemplateColumns:'56px 1fr', padding:'22px 0', borderBottom:`0.5px solid ${T.softLine}`, alignItems:'baseline', gap:16 }}>
            <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize: 20, color:T.gold, lineHeight:1 }}>{rule.n}</span>
            <div>
              <p style={{ fontFamily:T.display, fontSize:19, color:T.ink, margin:'0 0 4px', fontWeight:400, lineHeight:1.4 }}>{rule.r}</p>
              <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, margin:0 }}>{rule.d}</p>
            </div>
          </div>
        ))}
      </div>

      <AccordionPanel
        kicker="II · A Day of Eating"
        title="See an example day."
        summary={`Open this for one concrete example of roughly ${intake.toLocaleString()} kcal and ${protein}g of protein.`}
        style={sectionGap}
      >
        <ScrollRail minWidth={760}>
          <div style={{ borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
            {[
              { t:'07:30', m:'Breakfast', f:'3 eggs scrambled + 80g smoked salmon + 1 slice rye + black coffee', kcal:420, p:34 },
              { t:'12:30', m:'Lunch',     f:'150g chicken breast, 60g (dry) basmati rice, large mixed salad, 1 tbsp olive oil', kcal:540, p:45 },
              { t:'15:30', m:'Snack',     f:'200g 0% Greek yoghurt + 30g blueberries + 10g almonds', kcal:180, p:22 },
              { t:'18:30', m:'Dinner',    f:'150g cod or salmon, 200g roasted vegetables, 150g sweet potato', kcal:420, p:38 },
              { t:'20:30', m:'Evening',   f:'1 scoop whey protein in water (optional) + herbal tea', kcal:120, p:25 },
            ].map((meal,i,arr)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 100px 1fr 80px 80px', padding:'18px 0', borderBottom: i<arr.length-1?`0.5px solid ${T.softLine}`:'none', alignItems:'baseline', gap:16 }}>
                <Kicker color={T.gold}>{meal.t}</Kicker>
                <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:17, color:T.ink }}>{meal.m}</span>
                <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.5, margin:0 }}>{meal.f}</p>
                <span style={{ fontFamily:T.display, fontSize:18, color:T.ink, textAlign:'right' }}>{meal.kcal} <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>kcal</span></span>
                <span style={{ fontFamily:T.display, fontSize:18, color:T.green, textAlign:'right' }}>{meal.p}g <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>P</span></span>
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'60px 100px 1fr 80px 80px', alignItems:'baseline', gap:16, background:T.goldSoft, margin:'0 -16px', padding:'20px 16px' }}>
              <Kicker color={T.gold}>TOTAL</Kicker>
              <span />
              <span />
              <span style={{ fontFamily:T.display, fontSize:24, color:T.gold, textAlign:'right' }}>1,680 <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>kcal</span></span>
              <span style={{ fontFamily:T.display, fontSize:24, color:T.gold, textAlign:'right' }}>164g <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>P</span></span>
            </div>
          </div>
        </ScrollRail>
      </AccordionPanel>

      <AccordionPanel
        kicker="III · The Training Split"
        title="See the three-session week."
        summary="Open this for the weekly gym structure and the key movements for each day."
        style={sectionGap}
      >
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
          {[
            { day:'Monday',    focus:'Lower body',      exs:['Goblet squat 3×10','Romanian deadlift 3×10','Glute bridge 3×12','Leg press 3×12','Plank 3×30s'] },
            { day:'Wednesday', focus:'Upper push',      exs:['DB bench press 3×10','Shoulder press 3×10','Tricep dips 3×8','Lateral raises 3×12','Press-ups 3×AMRAP'] },
            { day:'Friday',    focus:'Upper pull + abs',exs:['Lat pulldown 3×10','Seated row 3×10','Bicep curl 3×12','Face pulls 3×15','Hanging knee raise 3×10'] },
          ].map((d,i)=>(
            <div key={i} style={{ padding:'22px 22px', borderRight: i<2?`0.5px solid ${T.line}`:'none' }}>
              <Kicker color={T.gold} style={{ marginBottom:8 }}>{d.day}</Kicker>
              <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.ink, margin:'0 0 14px' }}>{d.focus}</p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
                {d.exs.map((e,j)=>(
                  <li key={j} style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, padding:'6px 0', borderBottom:`0.5px solid ${T.softLine}` }}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ fontFamily:T.sans, fontSize:12, color:T.muted, fontWeight:300, margin:'14px 0 0', fontStyle:'italic' }}>
          Add a 30-minute walk on rest days. Aim for 8,000 steps daily. Movement is the multiplier.
        </p>
      </AccordionPanel>

      <AccordionPanel
        kicker="IV · Weekly Check-in"
        title="Open the Monday reset."
        summary="Use this when it is time to review the week in a few minutes and decide the next adjustment."
        style={sectionGap}
      >
        <ol style={{ counterReset:'step', listStyle:'none', padding:0, margin:0, borderTop:`2px solid ${T.ink}` }}>
          {[
            'Step on the scale at the same time, in the same state (fasted, after bathroom, before clothes).',
            'Log the reading in this dashboard. Always. Even if it&apos;s ugly.',
            'Calculate this week&apos;s average vs last week&apos;s average. The single reading is noise; the trend is signal.',
            'Look at this week&apos;s training log. Did you hit three sessions? Did you progress load?',
            'Look at your food log. Did you hit calories within ±100 kcal? Did you hit protein?',
            'Write one sentence answering: what worked, what didn&apos;t, what to change.',
          ].map((s,i)=>(
            <li key={i} style={{ display:'grid', gridTemplateColumns:'40px 1fr', padding:'16px 0', borderBottom:`0.5px solid ${T.softLine}`, gap:12 }}>
              <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.gold }}>{(i+1).toString().padStart(2,'0')}</span>
              <p style={{ fontFamily:T.sans, fontSize:14, color:T.body, fontWeight:300, lineHeight:1.6, margin:0 }} dangerouslySetInnerHTML={{ __html: s }} />
            </li>
          ))}
        </ol>
      </AccordionPanel>

      <AccordionPanel
        kicker="V · Troubleshooting"
        title="Open the problem-solving notes."
        summary="Most weeks go off-track in predictable ways. Open this for the common issues and the calmer response to each one."
        style={sectionGap}
      >
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
          {[
            { p:'Weight hasn&apos;t moved in 2 weeks',                d:`Check calories actually consumed (use a fresh 3-day log). Likely intake has crept up ${100}-${200} kcal/day. Tighten the count, do not cut further.` },
            { p:'Lost control on a single day — ate 3,000+ kcal', d:'It is one day. One day cannot undo a week of deficit. Resume normal eating tomorrow. Do not try to compensate by under-eating.' },
            { p:'Constant hunger making it impossible to comply',  d:'Increase protein and fibrous vegetables. Both increase satiety significantly. Consider switching to a 300-kcal deficit instead — slower but sustainable beats faster but failed.' },
            { p:'Scale up significantly week-on-week',             d:'It is almost certainly water from sodium, training soreness, or hormonal cycle. Trust the 4-week moving average, not the weekly number. Do nothing for one more week and look again.' },
            { p:'Lost the streak — skipped 2 weeks',               d:'Resume on the next Monday. Do not "make up" anything. The plan starts again from this week&apos;s weight. Continuity matters less than restarting cleanly.' },
            { p:'Friends/family ask why you&apos;re being strange about food', d:'Brief answer: "I&apos;m working on something." You owe nobody a long explanation. Track quietly.' },
          ].map((t, i) => (
            <div key={i} style={{ padding:'20px 22px', borderRight: i%2===0?`0.5px solid ${T.line}`:'none', borderBottom: i<4?`0.5px solid ${T.line}`:'none' }}>
              <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color:T.rose, margin:'0 0 8px', lineHeight:1.4 }} dangerouslySetInnerHTML={{ __html: t.p }} />
              <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, margin:0 }} dangerouslySetInnerHTML={{ __html: t.d }} />
            </div>
          ))}
        </div>
      </AccordionPanel>

      <div style={{ ...sectionGap, padding:'28px 30px', background:T.goldSoft, borderLeft:`3px solid ${T.gold}` }}>
        <Kicker color={T.gold} style={{ marginBottom:12 }}>The Closing Thought</Kicker>
        <p style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize:22, color:T.ink, lineHeight:1.4, margin:'0 0 10px' }}>
          {sorted.length} readings show that you can lose weight; you have done it before, from {Math.max(...sorted.map(r=>r.weight))} kg down to {Math.min(...sorted.map(r=>r.weight))} kg.
        </p>
        <p style={{ fontFamily:T.sans, fontSize:14, color:T.body, fontWeight:300, lineHeight:1.7, margin:0, maxWidth:'62ch' }}>
          The work this time is different. It is not about losing — it is about <strong style={{ color:T.ink, fontWeight:500 }}>staying lost</strong>. Follow the five rules. File the weekly reading. Add it to the ledger. Trust the line.
        </p>
      </div>
    </div>
  );
}

// ─── Compose modal ────────────────────────────────────────────────────────────

function Compose({ open, onClose, onSubmit }: {
  open:boolean; onClose:()=>void; onSubmit:(r:FitnessReading)=>void;
}) {
  const [form, setForm] = useState({ date:localIsoDate(), weight:'', bmi:'', bodyFat:'', water:'', muscleMass:'', boneMass:'' });
  useEffect(() => { if (!open) setForm(f=>({...f,weight:'',bmi:'',bodyFat:'',water:'',muscleMass:'',boneMass:''})); }, [open]);
  if (!open) return null;
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement>) => setForm({...form,[k]:e.target.value});

  const submit = (e:FormEvent) => {
    e.preventDefault();
    const w = parseFloat(form.weight);
    if (!w) return;
    const bmi = parseFloat(form.bmi) || +(w/(HEIGHT_M*HEIGHT_M)).toFixed(1);
    onSubmit({
      id: Date.now().toString(), date: form.date, weight:w, bmi,
      bodyFat: parseFloat(form.bodyFat)||0, water: parseFloat(form.water)||0,
      muscleMass: parseFloat(form.muscleMass)||0, boneMass: parseFloat(form.boneMass)||0,
    });
    onClose();
  };

  const field = (label:string, key:string, unit:string, step='0.1') => (
    <label style={{ display:'block', marginBottom:22 }}>
      <Kicker style={{ marginBottom:8 }}>{label}</Kicker>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, borderBottom:`0.5px solid ${T.line}`, paddingBottom:8 }}>
        <input
          type={key==='date'?'date':'number'} step={step}
          value={form[key as keyof typeof form]}
          onChange={set(key)}
          required={key==='weight'}
          style={{ flex:1, background:'transparent', border:'none', outline:'none', fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.ink, padding:'4px 0' }}
        />
        {unit && <span style={{ fontFamily:T.sans, fontSize:12, color:T.muted }}>{unit}</span>}
      </div>
    </label>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(26,24,21,0.56)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:T.paper, maxWidth:520, width:'100%', padding:'32px clamp(20px, 4vw, 40px) 40px', maxHeight:'90vh', overflowY:'auto', border:`1px solid ${T.line}`, boxShadow:CARD_SHADOW }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:28 }}>
          <div>
            <Kicker style={{ marginBottom:8 }}>Compose new reading</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize:28, color:T.ink, margin:0 }}>File a weigh-in.</h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:10, letterSpacing:'0.2em', color:T.muted }}>CLOSE</button>
        </div>
        <ThickRule style={{ marginBottom:28 }} />
        <form onSubmit={submit}>
          {field('Date', 'date', '')}
          {field('Weight', 'weight', 'kg')}
          {field('BMI', 'bmi', '(auto-calc if blank)')}
          {field('Body Fat', 'bodyFat', '%')}
          {field('Body Water', 'water', '%')}
          {field('Muscle Mass', 'muscleMass', '%')}
          {field('Bone Mass', 'boneMass', '%', '0.01')}
          <button type="submit" style={{
            background:T.ink, color:T.paper, border:0, cursor:'pointer', width:'100%',
            padding:'16px', fontFamily:T.sans, fontSize:10, fontWeight:500,
            letterSpacing:'0.24em', textTransform:'uppercase', marginTop:8,
          }}>Save to Ledger →</button>
        </form>
      </div>
    </div>
  );
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiAuthH(pw:string) { return { 'x-operator-pw':pw }; }
function apiH(pw:string) { return { 'Content-Type':'application/json', 'x-operator-pw':pw }; }
async function apiLoad(pw:string) {
  try {
    const res = await fetch('/api/operator/fitness', { headers:apiH(pw) });
    if (!res.ok) return null;
    const j = await res.json();
    return j.setup_required ? null : (j.readings as FitnessReading[]);
  } catch { return null; }
}
async function apiSave(pw:string, r:FitnessReading) {
  try {
    const res = await fetch('/api/operator/fitness', { method:'POST', headers:apiH(pw), body:JSON.stringify(r) });
    if (!res.ok) return null;
    return ((await res.json()).reading?.id ?? null) as string|null;
  } catch { return null; }
}
async function apiDel(pw:string, id:string) {
  try { await fetch(`/api/operator/fitness?id=${encodeURIComponent(id)}`, { method:'DELETE', headers:apiH(pw) }); } catch {}
}
async function apiImportAppleHealth(pw:string, file: File) {
  try {
    const form = new FormData();
    form.set('file', file);
    const res = await fetch('/api/operator/fitness/import', {
      method:'POST',
      headers:apiAuthH(pw),
      body:form,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok:false,
        message:(data?.error as string | undefined) ?? 'Apple Health import failed.',
      };
    }
    return {
      ok:true,
      message:`Imported ${data.importedCount ?? 0} readings. Added ${data.insertedCount ?? 0}, updated ${data.updatedCount ?? 0}.`,
    };
  } catch {
    return { ok:false, message:'Apple Health import failed.' };
  }
}

type ReferenceMetricTone = 'good' | 'warn' | 'brass' | 'neutral';

interface ReferenceMetric {
  label: string;
  value: string;
  status: string;
  tone: ReferenceMetricTone;
}

interface ReferencePhaseMarker {
  id: string;
  label: string;
  start: string;
  end: string;
}

interface ReferencePhaseRow {
  id: string;
  swatch: 'lean' | 'bulk' | 'cut' | 'recomp';
  name: string;
  emphasis: string;
  when: string;
  duration: string;
  start: string;
  end: string;
  delta: string;
  deltaClass: 'up' | 'down' | 'flat';
  current?: boolean;
}

interface ReferenceWeekRow {
  day: string;
  date: string;
  weight: number | null;
  delta: string;
  detail: string;
  isToday: boolean;
}

const REFERENCE_DAY = 24 * 60 * 60 * 1000;

function referenceMetric(
  label: string,
  value: string,
  status: string,
  tone: ReferenceMetricTone = 'neutral',
): ReferenceMetric {
  return { label, value, status, tone };
}

function formatReferenceDate(iso: string) {
  return parseLocalDateInput(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatReferenceMonth(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
}

function formatWeightDelta(value: number) {
  if (!Number.isFinite(value) || Math.abs(value) < 0.05) return '+/-0.0kg';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}kg`;
}

function nearestReadingByDays(sorted: FitnessReading[], entry: FitnessReading, days: number) {
  const target = new Date(entry.date).getTime() - days * REFERENCE_DAY;
  return sorted.reduce((best, row) => {
    const diff = Math.abs(new Date(row.date).getTime() - target);
    const bestDiff = Math.abs(new Date(best.date).getTime() - target);
    return diff < bestDiff ? row : best;
  }, sorted[0]);
}

function loggingCadence(sorted: FitnessReading[], windowDays = 14) {
  const latest = sorted[sorted.length - 1];
  const latestMs = new Date(latest.date).getTime();
  const cutoff = latestMs - windowDays * REFERENCE_DAY;
  const uniqueDays = new Set(
    sorted
      .filter((row) => new Date(row.date).getTime() >= cutoff)
      .map((row) => row.date.slice(0, 10)),
  ).size;
  return {
    count: uniqueDays,
    score: Math.min(100, Math.round((uniqueDays / windowDays) * 100)),
  };
}

function buildWeightSeries(sorted: FitnessReading[]) {
  return sorted.map((row) => ({ date: row.date, value: row.weight }));
}

// Derive phases from the actual weight line, not from index buckets.
//
// 1. Bin readings into 28-day windows and average the weight in each.
// 2. Convert consecutive-bin deltas into kg-per-week rates.
// 3. Classify each rate: strong down → cut, mild down → lean,
//    flat ± 0.05 kg/wk → recomp, anything else → bulk.
// 4. Merge adjacent windows with the same classification.
// 5. Absorb any single-window noise into the longer neighbour.
function buildReferencePhaseMarkers(sorted: FitnessReading[]): ReferencePhaseMarker[] {
  if (sorted.length < 4) return [];

  const BUCKET_DAYS = 28;
  const BUCKET_MS = BUCKET_DAYS * REFERENCE_DAY;
  const firstMs = new Date(sorted[0].date).getTime();
  const lastMs = new Date(sorted[sorted.length - 1].date).getTime();

  type Bin = { start: string; end: string; weight: number; startMs: number; endMs: number };
  const bins: Bin[] = [];
  for (let cursor = firstMs; cursor <= lastMs; cursor += BUCKET_MS) {
    const windowEnd = cursor + BUCKET_MS;
    const inWindow = sorted.filter((row) => {
      const t = new Date(row.date).getTime();
      return t >= cursor && t < windowEnd;
    });
    if (inWindow.length === 0) continue;
    const avg = inWindow.reduce((sum, row) => sum + row.weight, 0) / inWindow.length;
    bins.push({
      start: inWindow[0].date,
      end: inWindow[inWindow.length - 1].date,
      weight: avg,
      startMs: cursor,
      endMs: Math.min(windowEnd, lastMs),
    });
  }
  if (bins.length < 2) return [];

  type Phase = 'cut' | 'lean' | 'recomp' | 'bulk';
  const classify = (kgPerWeek: number): Phase => {
    if (kgPerWeek < -0.3) return 'cut';
    if (kgPerWeek < -0.05) return 'lean';
    if (kgPerWeek <= 0.05) return 'recomp';
    return 'bulk';
  };
  const labelOf: Record<Phase, ReferencePhaseMarker['label']> = {
    cut: 'fat loss push',
    lean: 'lean phase',
    recomp: 'recomposition',
    bulk: 'bulk phase',
  };

  type Run = { phase: Phase; start: string; end: string; binCount: number };
  const runs: Run[] = [];
  for (let i = 1; i < bins.length; i += 1) {
    const delta = bins[i].weight - bins[i - 1].weight;
    const ratePerWeek = delta / 4;
    const phase = classify(ratePerWeek);
    const last = runs[runs.length - 1];
    if (last && last.phase === phase) {
      last.end = bins[i].end;
      last.binCount += 1;
    } else {
      runs.push({ phase, start: bins[i - 1].start, end: bins[i].end, binCount: 1 });
    }
  }

  // Single-bin runs are noisy. Fold them into whichever neighbour is longer.
  for (let i = 0; i < runs.length; i += 1) {
    if (runs[i].binCount > 1) continue;
    const prev = runs[i - 1];
    const next = runs[i + 1];
    if (!prev && !next) continue;
    const target = !prev ? next : !next ? prev : prev.binCount >= next.binCount ? prev : next;
    if (target === prev) {
      prev.end = runs[i].end;
      prev.binCount += 1;
      runs.splice(i, 1);
      i -= 1;
    } else if (target === next) {
      next.start = runs[i].start;
      next.binCount += 1;
      runs.splice(i, 1);
      i -= 1;
    }
  }

  // Coalesce again — merging may have created new adjacencies.
  const collapsed: Run[] = [];
  for (const run of runs) {
    const last = collapsed[collapsed.length - 1];
    if (last && last.phase === run.phase) {
      last.end = run.end;
      last.binCount += run.binCount;
    } else {
      collapsed.push({ ...run });
    }
  }

  return collapsed.map((run, index) => ({
    id: `p${index + 1}`,
    label: labelOf[run.phase],
    start: run.start,
    end: run.end,
  }));
}

function formatPhaseDuration(startIso: string, endIso: string) {
  const months = Math.max(
    1,
    Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / (REFERENCE_DAY * 30)),
  );
  if (months >= 24) return `${Math.round(months / 12)} years`;
  if (months >= 12) return `${Math.round(months / 12)} year`;
  return `${months} months`;
}

function buildReferencePhaseRows(sorted: FitnessReading[]) {
  const phases = buildReferencePhaseMarkers(sorted);
  return phases
    .map((phase, index): ReferencePhaseRow => {
      const startReading = sorted.find((row) => row.date === phase.start) ?? sorted[0];
      const endReading = sorted.find((row) => row.date === phase.end) ?? sorted[sorted.length - 1];
      const delta = endReading.weight - startReading.weight;
      const current = index === phases.length - 1;
      const descriptors: Record<string, { name: string; emphasis: string; swatch: ReferencePhaseRow['swatch'] }> = {
        'lean phase': { name: 'Lean', emphasis: 'phase', swatch: 'lean' },
        'bulk phase': { name: 'Bulk', emphasis: 'phase', swatch: 'bulk' },
        'fat loss push': { name: 'Fat loss', emphasis: 'push', swatch: 'cut' },
        'recomposition': { name: 'Recomposition', emphasis: current ? '- live' : 'phase', swatch: 'recomp' },
      };
      const descriptor = descriptors[phase.label] ?? descriptors.recomposition;

      return {
        id: phase.id,
        swatch: descriptor.swatch,
        name: descriptor.name,
        emphasis: descriptor.emphasis,
        when: current ? `${formatReferenceMonth(phase.start)} - present` : `${formatReferenceMonth(phase.start)} - ${formatReferenceMonth(phase.end)}`,
        duration: formatPhaseDuration(phase.start, phase.end),
        start: `${startReading.weight.toFixed(1)}kg start`,
        end: current ? `${endReading.weight.toFixed(1)}kg now` : `${endReading.weight.toFixed(1)}kg end`,
        delta: `${delta > 0 ? '+' : ''}${delta.toFixed(1)}kg`,
        deltaClass: delta > 0.05 ? 'up' : delta < -0.05 ? 'down' : 'flat',
        current,
      };
    })
    .reverse();
}

function buildPhotoMilestones(sorted: FitnessReading[]): FitnessPhotoMilestone[] {
  const picks = [
    sorted[0],
    sorted[Math.floor((sorted.length - 1) * 0.25)],
    sorted[Math.floor((sorted.length - 1) * 0.5)],
    sorted[Math.floor((sorted.length - 1) * 0.75)],
    sorted[sorted.length - 1],
  ].filter(Boolean) as FitnessReading[];

  const unique = Array.from(new Map(picks.map((row) => [row.date, row])).values());
  return unique.map((row, index) => ({
    id: `pm-${index}-${row.date}`,
    date: row.date,
    label: index === 0 ? 'Start line' : index === unique.length - 1 ? 'Latest scan' : formatReferenceDate(row.date),
    weightKg: Math.round(row.weight * 10) / 10,
    bodyFat: Math.round(row.bodyFat * 10) / 10,
    note: index === 0 ? 'Opening reference point' : index === unique.length - 1 ? 'Current reference point' : 'Archived milestone',
  }));
}

function buildWeekRows(sorted: FitnessReading[], todayIso: string = localIsoDate()): ReferenceWeekRow[] {
  const today = parseLocalDateInput(todayIso);
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return dayLabels.map((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const isoDate = localIsoDate(date);
    const entry = sorted.find((row) => isoDay(row.date) === isoDate);
    const previousDate = new Date(date);
    previousDate.setDate(date.getDate() - 1);
    const previousEntry = sorted.find((row) => isoDay(row.date) === localIsoDate(previousDate));
    const weight = entry?.weight ?? null;
    const delta = weight !== null && previousEntry
      ? formatWeightDelta(weight - previousEntry.weight)
      : weight !== null
      ? '+/-0.0kg'
      : 'No log';

    return {
      day,
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      weight,
      delta,
      detail: entry
        ? `BF ${entry.bodyFat.toFixed(1)}% · BMI ${entry.bmi.toFixed(1)}`
        : 'No weigh-in',
      isToday: isoDate === todayIso,
    };
  });
}

function buildHeroMetrics(sorted: FitnessReading[]) {
  const latest = sorted[sorted.length - 1];
  const monthAgo = nearestReadingByDays(sorted, latest, 30);
  const discipline = loggingCadence(sorted);
  const bodyFatDelta = latest.bodyFat - monthAgo.bodyFat;
  const muscleDelta = latest.muscleMass - monthAgo.muscleMass;
  const boneDelta = latest.boneMass - monthAgo.boneMass;
  const bmiLabel = bmiStatus(latest.bmi)[0];
  const waterLabel = waterStatus(latest.water)[0];

  // Surface the four metrics worth scanning at a glance — body fat / muscle
  // get the 30-day delta, BMI shows status, discipline rolls up logging.
  // Water + bone live in the deeper Health section.
  void waterLabel; void boneDelta;
  return [
    referenceMetric('Body fat', `${latest.bodyFat.toFixed(1)}%`, `${bodyFatDelta > 0 ? '+' : ''}${bodyFatDelta.toFixed(1)} in 30d`, bodyFatDelta <= 0 ? 'good' : 'warn'),
    referenceMetric('Muscle mass', `${latest.muscleMass.toFixed(1)}%`, `${muscleDelta > 0 ? '+' : ''}${muscleDelta.toFixed(1)} in 30d`, muscleDelta >= 0 ? 'good' : 'warn'),
    referenceMetric('BMI', latest.bmi.toFixed(1), bmiLabel, latest.bmi < 30 ? 'good' : 'warn'),
    referenceMetric('Discipline', `${discipline.score}/100`, `${discipline.count}/14 days logged`, discipline.score >= 80 ? 'brass' : discipline.score >= 60 ? 'neutral' : 'warn'),
  ];
}

function buildSideMetrics(sorted: FitnessReading[], goal: number, reg: Reg | null) {
  const latest = sorted[sorted.length - 1];
  const monthAgo = nearestReadingByDays(sorted, latest, 30);
  const monthlyDelta = latest.weight - monthAgo.weight;
  const weeklyRate = reg ? reg.slope * 7 : 0;

  return [
    referenceMetric('Weight', `${latest.weight.toFixed(1)}kg`, latest.weight <= goal ? 'At goal' : `${(latest.weight - goal).toFixed(1)}kg to goal`, latest.weight <= goal ? 'good' : 'warn'),
    referenceMetric('BMI', latest.bmi.toFixed(1), bmiStatus(latest.bmi)[0], latest.bmi < 30 ? 'good' : 'warn'),
    referenceMetric('Body fat', `${latest.bodyFat.toFixed(1)}%`, fatStatus(latest.bodyFat)[0], latest.bodyFat < 39 ? 'good' : 'warn'),
    referenceMetric('Water', `${latest.water.toFixed(1)}%`, waterStatus(latest.water)[0], latest.water >= 40 ? 'good' : 'warn'),
    referenceMetric('Monthly delta', formatWeightDelta(monthlyDelta), monthlyDelta <= 0 ? 'Moving lower' : 'Moving higher', monthlyDelta <= 0 ? 'good' : 'warn'),
    referenceMetric('Trend rate', reg ? `${weeklyRate > 0 ? '+' : ''}${weeklyRate.toFixed(2)}kg/wk` : 'Need more data', reg ? (weeklyRate < 0 ? 'Regression line down' : 'Regression line up') : 'Awaiting trend', reg ? (weeklyRate < 0 ? 'good' : 'warn') : 'neutral'),
  ];
}

// ─── Today's Read · Next best action · Food breakdown ───────────────────────

interface TodaySnapshot {
  latest: FitnessReading;
  state: State;
  goal: number;
  cadence: { count: number; score: number };
  nutrition: { bmr: number; activeTdee: number; intake: number; maintenance: number; protein: number };
  caloriesInToday: number | null;
  caloriesOutToday: number | null;
  actualDeficitToday: number | null;
  targetDeficit: number;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  waterMl: number | null;
  stepsToday: number | null;
  sevenDayDelta: number;
}

interface NextAction {
  tone: 'primary' | 'support';
  title: string;
  detail: string;
}

function buildNextActions(snap: TodaySnapshot): NextAction[] {
  const actions: NextAction[] = [];

  if (snap.state.weighInStatus === 'overdue' || snap.state.weighInStatus === 'due-soon') {
    actions.push({
      tone: 'primary',
      title: 'File a weigh-in',
      detail: `${snap.state.daysSinceWeighIn} days since the last reading. A fresh number resets the read on everything else.`,
    });
  }

  if (snap.caloriesInToday === null) {
    actions.push({
      tone: actions.length === 0 ? 'primary' : 'support',
      title: `Stay close to ${snap.nutrition.intake.toLocaleString('en-GB')} kcal`,
      detail: 'Once today\'s food log syncs, the deficit picture below fills in automatically.',
    });
  } else {
    const deficitShort = snap.actualDeficitToday !== null && snap.actualDeficitToday < snap.targetDeficit;
    if (deficitShort) {
      const gap = snap.actualDeficitToday !== null ? Math.max(0, snap.targetDeficit - snap.actualDeficitToday) : snap.targetDeficit;
      actions.push({
        tone: actions.length === 0 ? 'primary' : 'support',
        title: 'Add a short walk or protein-led meal',
        detail: `Deficit is about ${gap.toLocaleString('en-GB')} kcal short of plan. A 20-minute walk and a protein-forward dinner usually closes that.`,
      });
    }
  }

  if (snap.proteinG !== null && snap.proteinG < snap.nutrition.protein * 0.85) {
    const remaining = Math.max(0, Math.round(snap.nutrition.protein - snap.proteinG));
    actions.push({
      tone: actions.length === 0 ? 'primary' : 'support',
      title: 'Prioritise protein at the next meal',
      detail: `${remaining} g still to reach today's ${snap.nutrition.protein} g target.`,
    });
  } else if (snap.proteinG === null) {
    actions.push({
      tone: actions.length === 0 ? 'primary' : 'support',
      title: `Aim for ${snap.nutrition.protein} g protein`,
      detail: 'Protein log will start populating once macros sync from your food tracker.',
    });
  }

  if (snap.stepsToday !== null && snap.stepsToday < 8000) {
    actions.push({
      tone: 'support',
      title: 'Walk to 8,000–10,000 steps',
      detail: `${snap.stepsToday.toLocaleString('en-GB')} so far. The cleanest deficit days finish in this band.`,
    });
  }

  if (Math.abs(snap.sevenDayDelta) < 0.5 && snap.sevenDayDelta > 0) {
    actions.push({
      tone: 'support',
      title: 'Hold the line — do not cut calories yet',
      detail: 'Today\'s uptick is inside normal day-to-day variance. Wait for 7 clean tracking days before changing anything.',
    });
  }

  if (actions.length === 0) {
    actions.push({
      tone: 'primary',
      title: 'Keep the day boring',
      detail: 'Targets are in range. Protect consistency, log dinner, walk after the last meal.',
    });
  }

  return actions.slice(0, 3);
}

function NextBestActionCard({ snap, onLog }: { snap: TodaySnapshot; onLog: () => void }) {
  const actions = buildNextActions(snap);
  const [primary, ...rest] = actions;
  const showLogButton = snap.state.weighInStatus === 'overdue' || snap.state.weighInStatus === 'due-soon';
  return (
    <article className="fit-nba">
      <div className="fit-nba-head">
        <div className="fit-nba-eyebrow">Next best action</div>
        <div className="fit-nba-meta">Generated from today's data</div>
      </div>
      <div className="fit-nba-primary">
        <div className="fit-nba-primary-title">{primary.title}</div>
        <p className="fit-nba-primary-detail">{primary.detail}</p>
        {showLogButton && (
          <button type="button" className="fit-nba-cta" onClick={onLog}>
            File reading
          </button>
        )}
      </div>
      {rest.length > 0 && (
        <ul className="fit-nba-support">
          {rest.map((action, index) => (
            <li key={`${action.title}-${index}`}>
              <span className="fit-nba-support-title">{action.title}</span>
              <span className="fit-nba-support-detail">{action.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

interface ReadLine {
  tone: 'good' | 'neutral' | 'warn';
  text: string;
}

function buildTodayRead(snap: TodaySnapshot): { headline: string; lines: ReadLine[] } {
  const lines: ReadLine[] = [];

  // Calorie / deficit read
  if (snap.actualDeficitToday !== null && snap.caloriesInToday !== null) {
    if (snap.actualDeficitToday >= snap.targetDeficit) {
      lines.push({ tone: 'good', text: `Intake is controlled and the deficit is at or above the planned ${snap.targetDeficit.toLocaleString('en-GB')} kcal range.` });
    } else if (snap.actualDeficitToday >= 0) {
      const shortBy = snap.targetDeficit - snap.actualDeficitToday;
      lines.push({ tone: 'neutral', text: `Deficit is roughly ${shortBy.toLocaleString('en-GB')} kcal short of plan. Don't change calories yet — focus on another clean tracking day and steps.` });
    } else {
      lines.push({ tone: 'warn', text: `Today is currently in surplus. A 20-minute walk or lighter dinner will pull it back into deficit.` });
    }
  } else {
    lines.push({ tone: 'neutral', text: 'Food log has not synced yet. The deficit read fills in once today\'s intake lands.' });
  }

  // Weight noise vs. signal
  const absDelta = Math.abs(snap.sevenDayDelta);
  if (absDelta < 0.5) {
    lines.push({ tone: 'good', text: `7-day move is ${formatWeightDelta(snap.sevenDayDelta)} — within normal day-to-day fluctuation, not a signal.` });
  } else if (snap.sevenDayDelta > 0) {
    lines.push({ tone: 'neutral', text: `Weight is up ${snap.sevenDayDelta.toFixed(1)} kg over 7 days. Could be water or food timing — wait for two more readings before reacting.` });
  } else {
    lines.push({ tone: 'good', text: `Weight is down ${Math.abs(snap.sevenDayDelta).toFixed(1)} kg over 7 days. Trend line is moving the right way.` });
  }

  // Logging cadence
  if (snap.cadence.score >= 80) {
    lines.push({ tone: 'good', text: `Logging is consistent — ${snap.cadence.count}/14 days. Adjustments are safe to evaluate when needed.` });
  } else if (snap.cadence.score >= 60) {
    lines.push({ tone: 'neutral', text: `Logging cadence is ${snap.cadence.count}/14 days. A couple more clean days makes the read tighter.` });
  } else {
    lines.push({ tone: 'warn', text: `Logging gap — only ${snap.cadence.count}/14 days. File the next reading before treating any swing as real.` });
  }

  // Headline
  let headline: string;
  if (snap.state.weighInStatus === 'overdue') {
    headline = 'Reading overdue';
  } else if (lines.some((l) => l.tone === 'warn')) {
    headline = 'Slightly off plan';
  } else if (lines.every((l) => l.tone === 'good')) {
    headline = 'On track';
  } else {
    headline = 'Close to target';
  }

  return { headline, lines };
}

function TodayReadCard({ snap }: { snap: TodaySnapshot }) {
  const { headline, lines } = buildTodayRead(snap);
  return (
    <article className="fit-read">
      <div className="fit-read-head">
        <div className="fit-read-eyebrow">Today's read</div>
        <div className="fit-read-headline">{headline}</div>
      </div>
      <ul className="fit-read-list">
        {lines.map((line, index) => (
          <li key={index} className={`fit-read-item ${line.tone}`}>
            <span className="fit-read-dot" aria-hidden="true" />
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

type DashboardTone = 'good' | 'neutral' | 'warn';
type HealthDay = HealthStreamFetch['days'][number];
type DatedRow = { date: string };

interface LineMoveDriver {
  label: string;
  value: string;
  note: string;
  tone: DashboardTone;
}

interface ConsistencyCell {
  tone: 'good' | 'neutral' | 'warn' | 'logged' | 'missing';
  title: string;
}

interface ConsistencyBucket {
  startIso: string;
  endIso: string;
}

function averageNullable(values: Array<number | null | undefined>): number | null {
  const numbers = values.filter((value): value is number => value !== null && value !== undefined && Number.isFinite(value));
  if (numbers.length === 0) return null;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function formatSignedInt(value: number): string {
  const rounded = Math.round(value);
  const abs = Math.abs(rounded).toLocaleString('en-GB');
  if (rounded > 0) return `+${abs}`;
  if (rounded < 0) return `−${abs}`;
  return abs;
}

function formatCompactCount(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) {
    const digits = abs >= 10000 ? 0 : 1;
    return `${(abs / 1000).toFixed(digits)}k`;
  }
  return Math.round(abs).toLocaleString('en-GB');
}

function formatMinutesCompact(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function trajectoryRangeLabel(range: FitnessChartRange): string {
  switch (range) {
    case '7d': return '7 days';
    case '30d': return '30 days';
    case '6m': return '6 months';
    case '1y': return '1 year';
    case '3y': return '3 years';
    default: return 'all synced history';
  }
}

function trajectoryRangeHeadline(range: FitnessChartRange): string {
  switch (range) {
    case '7d': return 'Last 7 days';
    case '30d': return 'Last 30 days';
    case '6m': return 'Last 6 months';
    case '1y': return 'Last year';
    case '3y': return 'Last 3 years';
    default: return 'Synced history';
  }
}

function trajectoryRangeAverageLabel(range: FitnessChartRange): string {
  switch (range) {
    case '7d': return '7-day avg';
    case '30d': return '30-day avg';
    case '6m': return '6-month avg';
    case '1y': return '1-year avg';
    case '3y': return '3-year avg';
    default: return 'Synced avg';
  }
}

function rangeCutoffForIso(anchorIso: string, range: FitnessChartRange): Date {
  const cutoff = parseLocalDateInput(anchorIso);
  if (range === '3y') cutoff.setFullYear(cutoff.getFullYear() - 3);
  else if (range === '1y') cutoff.setMonth(cutoff.getMonth() - 12);
  else if (range === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
  else if (range === '30d') cutoff.setDate(cutoff.getDate() - 30);
  else if (range === '7d') cutoff.setDate(cutoff.getDate() - 7);
  return cutoff;
}

function filterRowsForTrajectoryRange<T extends DatedRow>(
  rows: T[],
  range: FitnessChartRange,
  anchorIso?: string,
): T[] {
  if (rows.length === 0) return [];
  if (range === 'all') return rows;
  const anchor = anchorIso ?? isoDay(rows[rows.length - 1].date);
  const cutoffTime = rangeCutoffForIso(anchor, range).getTime();
  return rows.filter((row) => parseLocalDateInput(isoDay(row.date)).getTime() >= cutoffTime);
}

function previousRowsForTrajectoryRange<T extends DatedRow>(
  rows: T[],
  range: FitnessChartRange,
  anchorIso?: string,
): T[] {
  if (rows.length === 0 || range === 'all') return [];
  const currentRows = filterRowsForTrajectoryRange(rows, range, anchorIso);
  if (currentRows.length === 0) return [];
  const previousWindowEnd = parseLocalDateInput(isoDay(currentRows[0].date));
  previousWindowEnd.setDate(previousWindowEnd.getDate() - 1);
  const previousEndTime = previousWindowEnd.getTime();
  const previousCutoffTime = rangeCutoffForIso(localIsoDate(previousWindowEnd), range).getTime();
  return rows.filter((row) => {
    const time = parseLocalDateInput(isoDay(row.date)).getTime();
    return time >= previousCutoffTime && time <= previousEndTime;
  });
}

function earliestIso(values: Array<string | null | undefined>, fallbackIso: string): string {
  const available = values.filter((value): value is string => Boolean(value)).map((value) => isoDay(value));
  if (available.length === 0) return fallbackIso;
  return [...available].sort()[0];
}

function daysBetweenIso(startIso: string, endIso: string): number {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.round((parseLocalDateInput(endIso).getTime() - parseLocalDateInput(startIso).getTime()) / dayMs) + 1);
}

function buildConsistencyBuckets(startIso: string, endIso: string, range: FitnessChartRange): { buckets: ConsistencyBucket[]; bucketSizeDays: number } {
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = daysBetweenIso(startIso, endIso);
  const bucketSizeDays = range === '7d' || range === '30d'
    ? 1
    : range === '6m'
      ? 7
      : range === '1y'
        ? 14
        : range === '3y'
          ? 30
          : Math.max(30, Math.ceil(totalDays / 24));
  const bucketCount = Math.max(1, Math.ceil(totalDays / bucketSizeDays));
  const startTime = parseLocalDateInput(startIso).getTime();
  const endTime = parseLocalDateInput(endIso).getTime();
  const buckets: ConsistencyBucket[] = [];

  for (let index = 0; index < bucketCount; index += 1) {
    const bucketStartTime = startTime + index * bucketSizeDays * dayMs;
    if (bucketStartTime > endTime) break;
    const bucketEndTime = Math.min(endTime, bucketStartTime + (bucketSizeDays - 1) * dayMs);
    buckets.push({
      startIso: localIsoDate(new Date(bucketStartTime)),
      endIso: localIsoDate(new Date(bucketEndTime)),
    });
  }

  return { buckets, bucketSizeDays };
}

function consistencyBlockLabel(bucketSizeDays: number): string {
  if (bucketSizeDays <= 1) return 'Daily blocks';
  if (bucketSizeDays <= 3) return `${bucketSizeDays}-day blocks`;
  if (bucketSizeDays <= 8) return 'Weekly blocks';
  if (bucketSizeDays <= 16) return 'Two-week blocks';
  if (bucketSizeDays <= 45) return 'Monthly blocks';
  return 'Bi-monthly blocks';
}

function bucketLabel(bucket: ConsistencyBucket): string {
  if (bucket.startIso === bucket.endIso) return fmtDate(bucket.startIso);
  return `${fmtDate(bucket.startIso)} → ${fmtDate(bucket.endIso)}`;
}

function buildLineMoveSummary(readings: FitnessReading[], range: FitnessChartRange): string {
  const windowLabel = range === 'all' ? 'all synced history' : `${trajectoryRangeLabel(range).toLowerCase()} view`;
  if (readings.length < 2) return `Reading the ${windowLabel}. Add more weigh-ins to sharpen what is actually moving the line.`;
  const delta = readings[readings.length - 1].weight - readings[0].weight;
  if (Math.abs(delta) < 0.3) return `The line is broadly flat in the ${windowLabel}. The cards read the same window underneath it.`;
  return `${delta < 0 ? 'Down' : 'Up'} ${Math.abs(delta).toFixed(1)} kg in the ${windowLabel}. The cards below follow that same slice of time.`;
}

function buildLineMoveDrivers(
  currentDays: HealthDay[],
  previousDays: HealthDay[],
  nutrition: TodaySnapshot['nutrition'],
  range: FitnessChartRange,
): LineMoveDriver[] {
  const currentWindowLabel = trajectoryRangeAverageLabel(range);
  const previousWindowLabel = range === 'all' ? 'earlier data' : `previous ${trajectoryRangeLabel(range).toLowerCase()}`;
  const avgIntake = averageNullable(currentDays.map((day) => day.nutrition?.dietaryEnergyKcal ?? null));
  const avgSteps = averageNullable(currentDays.map((day) => day.activity.steps));
  const avgStepsBaseline = averageNullable(previousDays.map((day) => day.activity.steps));
  const avgSleep = averageNullable(currentDays.map((day) => day.sleep.totalMin));
  const avgSleepBaseline = averageNullable(previousDays.map((day) => day.sleep.totalMin));
  const sleepCoverage = currentDays.filter((day) => day.sleep.totalMin !== null).length;

  const food: LineMoveDriver = avgIntake === null
    ? {
        label: 'Food',
        value: 'No food log',
        note: `${currentWindowLabel} intake still missing`,
        tone: 'neutral',
      }
    : (() => {
        const delta = avgIntake - nutrition.intake;
        if (Math.abs(delta) <= 80) {
          return {
            label: 'Food',
            value: 'On target',
            note: `${currentWindowLabel} ${Math.round(avgIntake).toLocaleString('en-GB')} kcal/day`,
            tone: 'good' as const,
          };
        }
        return {
          label: 'Food',
          value: `${formatSignedInt(delta)} kcal/day`,
          note: `vs ${Math.round(nutrition.intake).toLocaleString('en-GB')} target`,
          tone: delta > 0 ? 'warn' as const : 'good' as const,
        };
      })();

  const steps: LineMoveDriver = avgSteps === null
    ? {
        label: 'Steps',
        value: 'No step data',
        note: 'movement context missing',
        tone: 'neutral',
      }
    : (() => {
        if (avgStepsBaseline !== null && Math.abs(avgSteps - avgStepsBaseline) >= 500) {
          return {
            label: 'Steps',
            value: `${avgSteps > avgStepsBaseline ? '+' : '−'}${formatCompactCount(avgSteps - avgStepsBaseline)}/day`,
            note: `vs ${previousWindowLabel}`,
            tone: avgSteps > avgStepsBaseline ? 'good' as const : avgSteps >= 8000 ? 'neutral' as const : 'warn' as const,
          };
        }
        const goalDelta = avgSteps - 10000;
        return {
          label: 'Steps',
          value: `${formatCompactCount(avgSteps)}/day`,
          note: goalDelta >= 0 ? 'above 10k goal' : 'below 10k goal',
          tone: goalDelta >= 0 ? 'good' as const : avgSteps >= 8000 ? 'neutral' as const : 'warn' as const,
        };
      })();

  const sleep: LineMoveDriver = sleepCoverage < 3 || avgSleep === null
    ? {
        label: 'Sleep',
        value: 'No sleep data',
        note: 'harder to explain water noise',
        tone: 'neutral',
      }
    : (() => {
        if (avgSleepBaseline !== null && Math.abs(avgSleep - avgSleepBaseline) >= 20) {
          return {
            label: 'Sleep',
            value: `${avgSleep > avgSleepBaseline ? '+' : '−'}${Math.abs(Math.round(avgSleep - avgSleepBaseline))}m`,
            note: `vs ${previousWindowLabel}`,
            tone: avgSleep > avgSleepBaseline ? 'good' as const : 'warn' as const,
          };
        }
        return {
          label: 'Sleep',
          value: formatMinutesCompact(avgSleep),
          note: avgSleep >= 480 ? 'meeting 8h target' : `${currentWindowLabel} sleep avg`,
          tone: avgSleep >= 450 ? 'good' as const : 'neutral' as const,
        };
      })();

  return [food, steps, sleep];
}

function WhyTheLineMovedStrip({
  range,
  healthDays,
  previousHealthDays,
  readings,
  nutrition,
}: {
  range: FitnessChartRange;
  healthDays: HealthDay[];
  previousHealthDays: HealthDay[];
  readings: FitnessReading[];
  nutrition: TodaySnapshot['nutrition'];
}) {
  const drivers = buildLineMoveDrivers(healthDays, previousHealthDays, nutrition, range);
  const summary = buildLineMoveSummary(readings, range);
  return (
    <section className="fit-line-moved" aria-label="Why the line moved">
      <div className="fit-line-moved-head">
        <div>
          <span className="fit-line-moved-eyebrow">Why the line moved</span>
          <div className="fit-line-moved-copy">{summary}</div>
        </div>
      </div>
      <div className="fit-line-moved-grid">
        {drivers.map((driver) => (
          <article key={driver.label} className={`fit-line-moved-card is-${driver.tone}`}>
            <span className="fit-line-moved-label">{driver.label}</span>
            <strong className="fit-line-moved-value">{driver.value}</strong>
            <span className="fit-line-moved-note">{driver.note}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ConsistencyHeatmapCard({
  anchorIso,
  range,
  healthDays,
  readings,
  calorieTarget,
}: {
  anchorIso: string;
  range: FitnessChartRange;
  healthDays: HealthDay[];
  readings: FitnessReading[];
  calorieTarget: number;
}) {
  const visibleHealthDays = filterRowsForTrajectoryRange(healthDays, range, anchorIso);
  const visibleReadings = filterRowsForTrajectoryRange(readings, range, anchorIso);
  const windowStartIso = earliestIso([visibleHealthDays[0]?.date, visibleReadings[0]?.date], anchorIso);
  const { buckets, bucketSizeDays } = buildConsistencyBuckets(windowStartIso, anchorIso, range);

  const daysForBucket = (bucket: ConsistencyBucket) => visibleHealthDays.filter((day) => {
    const iso = isoDay(day.date);
    return iso >= bucket.startIso && iso <= bucket.endIso;
  });
  const readingsForBucket = (bucket: ConsistencyBucket) => visibleReadings.filter((reading) => {
    const iso = isoDay(reading.date);
    return iso >= bucket.startIso && iso <= bucket.endIso;
  });

  const weighCells: ConsistencyCell[] = buckets.map((bucket) => {
    const bucketReadings = readingsForBucket(bucket);
    const label = bucketLabel(bucket);
    return {
      tone: bucketReadings.length > 0 ? 'logged' : 'missing',
      title: bucketReadings.length > 0 ? `${label}: ${bucketReadings.length} weigh-in${bucketReadings.length === 1 ? '' : 's'} logged` : `${label}: no weigh-ins`,
    };
  });

  const intakeCells: ConsistencyCell[] = buckets.map((bucket) => {
    const intakeDays = daysForBucket(bucket).filter((day) => (day.nutrition?.dietaryEnergyKcal ?? null) !== null);
    const label = bucketLabel(bucket);
    if (intakeDays.length === 0) {
      return { tone: 'missing', title: `${label}: intake missing` };
    }
    const onPlanDays = intakeDays.filter((day) => (day.nutrition?.dietaryEnergyKcal ?? 0) <= calorieTarget + 100).length;
    const closeDays = intakeDays.filter((day) => (day.nutrition?.dietaryEnergyKcal ?? 0) <= calorieTarget + 300).length;
    if (onPlanDays / intakeDays.length >= 0.7) {
      return { tone: 'good', title: `${label}: ${onPlanDays}/${intakeDays.length} days on plan` };
    }
    if (closeDays / intakeDays.length >= 0.5) {
      return { tone: 'neutral', title: `${label}: ${onPlanDays}/${intakeDays.length} days on plan` };
    }
    return { tone: 'warn', title: `${label}: intake ran hot in most logged days` };
  });

  const stepCells: ConsistencyCell[] = buckets.map((bucket) => {
    const bucketDays = daysForBucket(bucket).filter((day) => day.activity.steps !== null);
    const label = bucketLabel(bucket);
    if (bucketDays.length === 0) {
      return { tone: 'missing', title: `${label}: step data missing` };
    }
    const goalDays = bucketDays.filter((day) => (day.activity.steps ?? 0) >= 10000).length;
    const closeDays = bucketDays.filter((day) => (day.activity.steps ?? 0) >= 7000).length;
    if (goalDays / bucketDays.length >= 0.7) {
      return { tone: 'good', title: `${label}: step goal hit ${goalDays}/${bucketDays.length} days` };
    }
    if (closeDays / bucketDays.length >= 0.5) {
      return { tone: 'neutral', title: `${label}: close on ${closeDays}/${bucketDays.length} days` };
    }
    return { tone: 'warn', title: `${label}: step goal missed most days` };
  });

  const weighLogged = weighCells.filter((cell) => cell.tone === 'logged').length;
  const intakeLogged = intakeCells.filter((cell) => cell.tone !== 'missing').length;
  const stepLogged = stepCells.filter((cell) => cell.tone !== 'missing').length;

  const rows = [
    { key: 'weigh', label: 'Weigh-ins', meta: `${weighLogged}/${weighCells.length} active`, cells: weighCells },
    { key: 'intake', label: 'Intake', meta: intakeLogged > 0 ? `${intakeCells.filter((cell) => cell.tone === 'good').length}/${intakeLogged} on plan` : 'No food logs', cells: intakeCells },
    { key: 'steps', label: 'Steps', meta: stepLogged > 0 ? `${stepCells.filter((cell) => cell.tone === 'good').length}/${stepLogged} hit goal` : 'No step sync', cells: stepCells },
  ] as const;

  return (
    <article className="fit-consistency-card">
      <div className="fit-consistency-card-head">
        <div>
          <span className="fit-consistency-card-eyebrow">Consistency</span>
          <div className="fit-consistency-card-title">{trajectoryRangeHeadline(range)}</div>
        </div>
        <span className="fit-consistency-card-meta">{consistencyBlockLabel(bucketSizeDays)} · weigh-in rhythm, intake target, step goal</span>
      </div>

      <div className="fit-consistency-rows">
        {rows.map((row) => (
          <div key={row.key} className="fit-consistency-row">
            <div className="fit-consistency-row-meta">
              <span className="fit-consistency-row-label">{row.label}</span>
              <span className="fit-consistency-row-count">{row.meta}</span>
            </div>
            <div className="fit-consistency-grid" role="presentation" style={{ gridTemplateColumns: `repeat(${row.cells.length}, minmax(0, 1fr))` }}>
              {row.cells.map((cell, index) => (
                <span
                  key={`${row.key}-${index}`}
                  className={`fit-consistency-cell is-${row.key} is-${cell.tone}`}
                  title={cell.title}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fit-consistency-legend">
        <span className="fit-consistency-legend-item"><i className="fit-consistency-dot is-logged" />Weigh-in logged</span>
        <span className="fit-consistency-legend-item"><i className="fit-consistency-dot is-good" />Target hit</span>
        <span className="fit-consistency-legend-item"><i className="fit-consistency-dot is-neutral" />Close</span>
        <span className="fit-consistency-legend-item"><i className="fit-consistency-dot is-warn" />Missed</span>
      </div>
    </article>
  );
}

interface NutritionPieSlice {
  label: string;
  value: number;
  color: string;
}

interface NutritionPieLegendItem {
  label: string;
  value: string;
  color: string;
  meta?: string;
}

function NutritionPieCard({
  label,
  meta,
  slices,
  legend,
  center,
  sub,
  emptyText,
}: {
  label: string;
  meta: string;
  slices: NutritionPieSlice[];
  legend: NutritionPieLegendItem[];
  center: { value: string; unit: string };
  sub?: string;
  emptyText?: string;
}) {
  const total = slices.reduce((sum, slice) => sum + Math.max(0, slice.value), 0);
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <article className="fit-food-card fit-food-pie-card">
      <div className="fit-food-card-head">
        <span className="fit-food-card-label">{label}</span>
        <span className="fit-food-card-meta">{meta}</span>
      </div>

      <div className="fit-food-pie-layout">
        <div className="fit-food-pie-wrap" aria-hidden="true">
          <svg className="fit-food-pie" viewBox="0 0 180 180">
            <circle className="fit-food-pie-track" cx="90" cy="90" r={radius} />
            {total > 0 && slices.map((slice) => {
              const arc = (Math.max(0, slice.value) / total) * circumference;
              const segment = (
                <circle
                  key={slice.label}
                  className="fit-food-pie-segment"
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={slice.color}
                  strokeDasharray={`${arc} ${Math.max(0, circumference - arc)}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += arc;
              return segment;
            })}
          </svg>
          <div className="fit-food-pie-centre">
            <strong>{center.value}</strong>
            <span>{center.unit}</span>
          </div>
        </div>

        <dl className="fit-food-pie-legend">
          {legend.map((item) => (
            <div key={item.label} className="fit-food-pie-legend-row">
              <dt>
                <span style={{ background: item.color }} aria-hidden="true" />
                {item.label}
              </dt>
              <dd>
                <strong>{item.value}</strong>
                {item.meta && <small>{item.meta}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {sub && <div className="fit-food-pie-sub">{sub}</div>}
      {emptyText && <div className="fit-food-empty soft">{emptyText}</div>}
    </article>
  );
}


function CalorieNetSparkline({ values, target }: { values: number[]; target: number }) {
  if (values.length < 2) return null;
  const W = 168;
  const H = 52;
  const padX = 6;
  const padY = 8;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const allValues = [...values, target, 0];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = Math.max(max - min, 1);
  const xs = values.map((_, i) => padX + (i / (values.length - 1)) * innerW);
  const ys = values.map((v) => padY + (1 - (v - min) / range) * innerH);
  const targetY = padY + (1 - (target - min) / range) * innerH;
  const zeroY = padY + (1 - (0 - min) / range) * innerH;
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="op-nutri-spark-svg" aria-hidden="true">
      <line x1={padX} y1={zeroY} x2={W - padX} y2={zeroY} className="op-nutri-spark-zero" />
      <line x1={padX} y1={targetY} x2={W - padX} y2={targetY} className="op-nutri-spark-target" />
      <path d={path} className="op-nutri-spark-line" />
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r={i === values.length - 1 ? 2.8 : 1.6}
          className={i === values.length - 1 ? 'op-nutri-spark-dot is-latest' : 'op-nutri-spark-dot'}
        />
      ))}
    </svg>
  );
}

function TopNutritionCaloriesCard({
  snap,
  healthDays,
  activeKcalToday,
}: {
  snap: TodaySnapshot;
  healthDays: HealthStreamFetch['days'];
  activeKcalToday: number | null;
}) {
  const calorieTarget = Math.round(snap.nutrition.intake);
  const targetDeficit = Math.round(snap.targetDeficit);
  const targetNet = -targetDeficit;
  const caloriesIn = snap.caloriesInToday;
  const caloriesOut = snap.caloriesOutToday;
  const bmr = snap.nutrition.bmr;
  const netToday = caloriesIn !== null && caloriesOut !== null ? caloriesIn - caloriesOut : null;
  const netForDay = (day: HealthStreamFetch['days'][number]): number | null => {
    const intake = day.nutrition?.dietaryEnergyKcal ?? null;
    if (intake === null) return null;
    return intake - (bmr + (day.activity.activeEnergyKcal ?? 0));
  };
  const nets7 = healthDays.slice(-7).map(netForDay).filter((value): value is number => value !== null && Number.isFinite(value));
  const avgNet7 = nets7.length > 0 ? nets7.reduce((sum, value) => sum + value, 0) / nets7.length : null;
  const deficitProgress = netToday !== null
    ? Math.min(100, Math.max(0, (Math.min(0, netToday) / targetNet) * 100))
    : 0;
  const avgTargetCoverage = avgNet7 !== null
    ? Math.max(0, Math.round((Math.min(0, avgNet7) / targetNet) * 100))
    : null;
  const hasNutritionData = healthDays.some((day) => (day.nutrition?.dietaryEnergyKcal ?? null) !== null);
  const fmtInt = (value: number | null) => (
    value === null || !Number.isFinite(value) ? '—' : Math.round(value).toLocaleString('en-GB')
  );
  const fmtSigned = (value: number | null) => {
    if (value === null || !Number.isFinite(value)) return '—';
    const abs = Math.abs(Math.round(value)).toLocaleString('en-GB');
    if (value > 0) return `+${abs}`;
    if (value < 0) return `−${abs}`;
    return abs;
  };
  const netTone = netToday !== null && netToday <= targetNet ? 'good' : netToday !== null && netToday < 0 ? 'neutral' : 'warn';
  const avgTone = avgNet7 !== null && avgNet7 <= targetNet ? 'good' : avgNet7 !== null && avgNet7 < 0 ? 'neutral' : 'warn';
  const netHeadline = netToday === null
    ? 'Waiting on food log'
    : netToday <= targetNet
      ? 'Ahead of target'
      : netToday < 0
        ? 'Close, not there yet'
        : 'Currently in surplus';

  return (
    <article className="op-health-card op-card-wide fit-top-nutrition-card">
      <header className="op-health-card-head op-nutri-head">
        <span className="op-health-card-label">Calorie balance</span>
        <span className="op-nutri-target">Target deficit {targetDeficit.toLocaleString('en-GB')} kcal</span>
      </header>

      {!hasNutritionData ? (
        <div className="op-nutri-empty">
          <p>No food log synced yet today. Calories and macros will appear here after the next Apple Health export.</p>
        </div>
      ) : (
        <div className="op-nutri-editorial">
          <div className="op-nutri-hero">
            <div className="op-nutri-hero-text">
              <span className="op-nutri-hero-eyebrow">Today&apos;s net</span>
              <div className={`op-nutri-hero-num is-${netTone}`}>
                <span className="value">{fmtSigned(netToday)}</span>
                <span className="unit">kcal</span>
              </div>
              <div className={`op-nutri-hero-status is-${netTone}`}>{netHeadline}</div>
            </div>
            {nets7.length >= 2 && (
              <div className="op-nutri-hero-spark">
                <span className="op-nutri-hero-spark-label">Last 7 days · net</span>
                <CalorieNetSparkline values={nets7} target={targetNet} />
                <span className="op-nutri-hero-spark-foot">
                  avg <strong>{fmtSigned(avgNet7)}</strong>
                  {avgTargetCoverage !== null && <em> · {avgTargetCoverage}% of target</em>}
                </span>
              </div>
            )}
          </div>

          {(() => {
            const scale = Math.max(
              Math.abs(netToday ?? 0),
              Math.abs(caloriesOut ?? 0),
              Math.abs(caloriesIn ?? 0),
              Math.abs(avgNet7 ?? 0),
              Math.abs(targetNet),
              1,
            );
            const targetMarkPct = Math.min(100, (Math.abs(targetNet) / scale) * 100);
            const rows = [
              {
                key: 'in',
                label: 'Eaten',
                value: caloriesIn,
                sub: caloriesIn !== null ? `${fmtSigned(caloriesIn - calorieTarget)} vs ${calorieTarget.toLocaleString('en-GB')} target` : `Target ${calorieTarget.toLocaleString('en-GB')}`,
                pct: caloriesIn !== null ? Math.min(100, (caloriesIn / scale) * 100) : 0,
                tone: 'eaten' as const,
                marker: null as number | null,
              },
              {
                key: 'out',
                label: 'Burned',
                value: caloriesOut,
                sub: `BMR ${fmtInt(bmr)} + active ${fmtInt(activeKcalToday)}`,
                pct: caloriesOut !== null ? Math.min(100, (caloriesOut / scale) * 100) : 0,
                tone: 'burned' as const,
                marker: null as number | null,
              },
              {
                key: 'deficit',
                label: 'Deficit today',
                value: netToday,
                sub: `Target ${fmtSigned(targetNet)} kcal`,
                pct: netToday !== null ? Math.min(100, (Math.abs(netToday) / scale) * 100) : 0,
                tone: netTone,
                marker: targetMarkPct,
              },
              {
                key: 'avg',
                label: '7-day average',
                value: avgNet7,
                sub: avgTargetCoverage !== null ? `${avgTargetCoverage}% of deficit target` : 'Need more overlapping days',
                pct: avgNet7 !== null ? Math.min(100, (Math.abs(avgNet7) / scale) * 100) : 0,
                tone: avgTone,
                marker: targetMarkPct,
              },
            ];
            return (
              <ol className="op-nutri-ledger">
                {rows.map((row) => (
                  <li key={row.key} className="op-nutri-row">
                    <span className="op-nutri-row-label">{row.label}</span>
                    <div className="op-nutri-row-bar" aria-hidden="true">
                      <span className={`op-nutri-row-fill is-${row.tone}`} style={{ width: `${row.pct}%` }} />
                      {row.marker !== null && (
                        <span className="op-nutri-row-marker" style={{ left: `${row.marker}%` }} />
                      )}
                    </div>
                    <span className={`op-nutri-row-value is-${row.tone}`}>{row.value !== null ? (row.key === 'deficit' || row.key === 'avg' ? fmtSigned(row.value) : fmtInt(row.value)) : '—'}</span>
                    <span className="op-nutri-row-sub">{row.sub}</span>
                  </li>
                ))}
              </ol>
            );
          })()}
        </div>
      )}
    </article>
  );
}

function FoodBreakdownSection({ snap }: { snap: TodaySnapshot }) {
  const intakeTarget = snap.nutrition.intake;
  const proteinTarget = snap.nutrition.protein;
  // Sensible defaults if data is missing — these are clearly labelled as targets, not actual.
  const carbsTarget = Math.round((intakeTarget * 0.4) / 4);
  const fatTarget = Math.round((intakeTarget * 0.3) / 9);
  const fiberTarget = 30;
  const waterTargetMl = 2000;

  const calIn = snap.caloriesInToday;
  const calRemaining = calIn === null ? null : intakeTarget - calIn;
  const calTargetPct = calIn === null ? 0 : calIn / Math.max(1, intakeTarget);

  const calorieOver = calIn === null ? 0 : Math.max(0, calIn - intakeTarget);
  const caloriePieSlices: NutritionPieSlice[] = calIn === null ? [] : calorieOver > 0
    ? [
        { label: 'Target', value: intakeTarget, color: T.gold },
        { label: 'Over', value: calorieOver, color: T.rose },
      ]
    : [
        { label: 'Logged', value: Math.max(0, calIn), color: T.green },
        { label: 'Remaining', value: Math.max(0, intakeTarget - calIn), color: 'rgba(26, 24, 21, 0.11)' },
      ].filter((slice) => slice.value > 0);
  const calorieLegend: NutritionPieLegendItem[] = [
    {
      label: 'Logged',
      value: calIn === null ? '-' : `${Math.round(calIn).toLocaleString('en-GB')} kcal`,
      color: T.green,
      meta: calIn === null ? 'waiting for food log' : `${Math.round(calTargetPct * 100)}% of target`,
    },
    {
      label: calRemaining === null ? 'Remaining' : calRemaining >= 0 ? 'Remaining' : 'Over',
      value: calRemaining === null
        ? '-'
        : `${Math.abs(Math.round(calRemaining)).toLocaleString('en-GB')} kcal`,
      color: calRemaining !== null && calRemaining < 0 ? T.rose : 'rgba(26, 24, 21, 0.35)',
      meta: calRemaining === null ? 'target shown' : calRemaining >= 0 ? 'left today' : 'above target',
    },
    {
      label: 'Target',
      value: `${intakeTarget.toLocaleString('en-GB')} kcal`,
      color: T.gold,
      meta: `${snap.nutrition.maintenance.toLocaleString('en-GB')} kcal maintenance`,
    },
  ];

  const macroEntries = [
    { label: 'Protein', grams: snap.proteinG, target: proteinTarget, kcalPerGram: 4, color: T.green },
    { label: 'Carbs', grams: snap.carbsG, target: carbsTarget, kcalPerGram: 4, color: T.blue },
    { label: 'Fat', grams: snap.fatG, target: fatTarget, kcalPerGram: 9, color: T.gold },
  ];
  const macroPieSlices: NutritionPieSlice[] = macroEntries
    .filter((macro) => macro.grams !== null && macro.grams > 0)
    .map((macro) => ({
      label: macro.label,
      value: Math.round((macro.grams ?? 0) * macro.kcalPerGram),
      color: macro.color,
    }));
  const macroTotalKcal = macroPieSlices.reduce((sum, slice) => sum + slice.value, 0);
  const macroLegend: NutritionPieLegendItem[] = macroEntries.map((macro) => {
    const kcal = macro.grams === null ? null : Math.round(macro.grams * macro.kcalPerGram);
    const pct = macroTotalKcal > 0 && kcal !== null ? Math.round((kcal / macroTotalKcal) * 100) : null;
    return {
      label: macro.label,
      value: macro.grams === null ? '-' : `${Math.round(macro.grams)}g`,
      color: macro.color,
      meta: kcal === null ? `target ${macro.target}g` : `${kcal.toLocaleString('en-GB')} kcal${pct !== null ? ` / ${pct}%` : ''}`,
    };
  });

  const hasAnyMacros = macroPieSlices.length > 0;
  const waterCups = snap.waterMl !== null ? snap.waterMl / 250 : null;
  const waterTargetCups = waterTargetMl / 250;

  return (
    <section className="fit-food">
      <div className="fit-food-head">
        <div>
          <div className="fit-food-eyebrow">Food breakdown</div>
          <h3 className="fit-food-title">Nutrition <em>picture</em></h3>
          <p className="fit-food-copy">Calories, macros, water and meal balance for today — built from your food log.</p>
        </div>
      </div>

      <div className="fit-food-pies">
        <NutritionPieCard
          label="Calorie balance"
          meta={`${intakeTarget.toLocaleString('en-GB')} kcal target`}
          slices={caloriePieSlices}
          legend={calorieLegend}
          center={{
            value: calIn === null ? '-' : Math.round(calIn).toLocaleString('en-GB'),
            unit: calIn === null ? 'not logged' : 'kcal logged',
          }}
          sub={calRemaining === null ? undefined : calRemaining >= 0
            ? `${Math.round(calRemaining).toLocaleString('en-GB')} kcal left against today's target.`
            : `${Math.abs(Math.round(calRemaining)).toLocaleString('en-GB')} kcal over today's target.`}
          emptyText={calIn === null ? 'No food log synced yet for today. Targets shown so you have a number to aim at.' : undefined}
        />

        <NutritionPieCard
          label="Macronutrients"
          meta={`${snap.nutrition.activeTdee.toLocaleString('en-GB')} kcal active TDEE`}
          slices={macroPieSlices}
          legend={macroLegend}
          center={{
            value: hasAnyMacros ? macroTotalKcal.toLocaleString('en-GB') : '-',
            unit: hasAnyMacros ? 'macro kcal' : 'no macros',
          }}
          sub={hasAnyMacros && snap.fiberG !== null
            ? `Fibre ${Math.round(snap.fiberG)}g of ${fiberTarget}g target.`
            : hasAnyMacros
              ? `Targets: protein ${proteinTarget}g, carbs ${carbsTarget}g, fat ${fatTarget}g.`
              : undefined}
          emptyText={!hasAnyMacros ? 'No macro data yet. Add protein, carbs, and fat to make this section more useful.' : undefined}
        />
      </div>

      <div className="fit-food-support">
        <div className="fit-food-card fit-food-water">
          <div className="fit-food-card-head">
            <span className="fit-food-card-label">Water</span>
            <span className="fit-food-card-meta">{waterTargetMl / 1000}L target</span>
          </div>
          <div className="fit-food-water-num">
            {waterCups !== null ? Math.round(waterCups) : '—'}
            <small>cups</small>
          </div>
          <div className="fit-food-water-bar" aria-hidden="true">
            {Array.from({ length: Math.ceil(waterTargetCups) }).map((_, i) => (
              <span key={i} className={`fit-food-water-cup ${waterCups !== null && i < Math.round(waterCups) ? 'filled' : ''}`} />
            ))}
          </div>
          {waterCups === null && (
            <div className="fit-food-empty soft">No water logged yet. Connect Apple Health or log manually.</div>
          )}
        </div>
      </div>

    </section>
  );
}

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function OperatorDashboardClient() {
  const [authed, setAuthed]   = useState(false);
  const [opPw, setOpPw]       = useState('');
  const [readings, setReadings] = useState<FitnessReading[]>([]);
  const [goal, setGoal]       = useState(60.0);
  const [compose, setCompose] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean|null>(null);
  const [trajectoryRange, setTrajectoryRange] = useState<FitnessChartRange>('3y');

  const saveLocal = useCallback((rs:FitnessReading[]) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(rs)); }, []);

  const loadData = useCallback(async (pw:string) => {
    const localRaw = localStorage.getItem(STORAGE_KEY);
    const local: FitnessReading[] = localRaw ? JSON.parse(localRaw) : [];
    setReadings(local);
    setSyncing(true);
    const cloud = await apiLoad(pw);
    setSyncing(false);
    if (cloud === null) { setCloudOk(false); return; }
    setCloudOk(true);
    // Merge cloud + any local entries cloud doesn't yet have. Protects
    // freshly-logged readings from being wiped if apiSave failed earlier.
    const cloudIds = new Set(cloud.map(r => r.id));
    const localOnly = local.filter(r => !cloudIds.has(r.id));
    const merged = [...cloud, ...localOnly].sort((a, b) => a.date.localeCompare(b.date));
    setReadings(merged); saveLocal(merged);
    for (const r of localOnly) {
      const nid = await apiSave(pw, r);
      if (nid && nid !== r.id) r.id = nid;
    }
  }, [saveLocal]);

  const refreshCloudReadings = useCallback(async () => {
    if (!opPw) return;
    await loadData(opPw);
  }, [loadData, opPw]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const g = localStorage.getItem(GOAL_KEY);
    if (g) setGoal(parseFloat(g));
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const { ts, pw } = JSON.parse(stored) as { ts:number; pw:string };
        if (Date.now()-ts < AUTH_TTL) { setAuthed(true); setOpPw(pw); loadData(pw); }
        else localStorage.removeItem(AUTH_KEY);
      } catch { localStorage.removeItem(AUTH_KEY); }
    }
  }, [loadData]);

  const handleUnlock = useCallback(async () => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const { pw } = JSON.parse(stored) as { pw:string };
      setOpPw(pw); setAuthed(true); await loadData(pw);
    }
  }, [loadData]);

  const handleAdd = useCallback(async (r:FitnessReading) => {
    const next = [...readings, r].sort((a,b)=>a.date.localeCompare(b.date));
    setReadings(next); saveLocal(next);
    if (opPw) { const nid = await apiSave(opPw, r); if (nid&&nid!==r.id) { const u=next.map(x=>x.id===r.id?{...x,id:nid}:x); setReadings(u); saveLocal(u); } }
  }, [readings, opPw, saveLocal]);

  const handleDelete = useCallback(async (id:string) => {
    const next = readings.filter(r=>r.id!==id);
    setReadings(next); saveLocal(next);
    if (opPw) await apiDel(opPw, id);
  }, [readings, opPw, saveLocal]);

  const todayIso = localIsoDate();
  const sorted   = useMemo(() => [...readings].sort((a,b)=>a.date.localeCompare(b.date)), [readings]);
  const dashboardSource = useMemo(
    () => sorted.filter((row) => isPlausibleWeightKg(row.weight)),
    [sorted],
  );
  const derivedSource = dashboardSource.length > 0 ? dashboardSource : SEED;
  const reg      = useMemo(() => regress(derivedSource), [derivedSource]);
  const latest   = dashboardSource[dashboardSource.length - 1];
  const latestIsToday = latest ? isoDay(latest.date) === todayIso : false;
  const weightLabel = latestIsToday ? 'Today' : 'Latest';
  const state    = useMemo(() => (
    dashboardSource.length > 0 ? assessState(dashboardSource, goal, todayIso) : null
  ), [dashboardSource, goal, todayIso]);
  const phaseMarkers = useMemo(() => buildReferencePhaseMarkers(derivedSource), [derivedSource]);
  const phaseRows = useMemo(() => buildReferencePhaseRows(derivedSource), [derivedSource]);
  const photoMilestones = useMemo(() => buildPhotoMilestones(derivedSource), [derivedSource]);
  const heroMetrics = useMemo(() => buildHeroMetrics(derivedSource), [derivedSource]);
  const sideMetrics = useMemo(() => buildSideMetrics(derivedSource, goal, reg), [derivedSource, goal, reg]);
  const weekRows = useMemo(() => buildWeekRows(derivedSource, todayIso), [derivedSource, todayIso]);
  const chartBounds = useMemo(() => {
    const chartSource = dashboardSource.length > 0 ? dashboardSource : derivedSource;
    const weights = chartSource.map((row) => row.weight);
    const observedMin = Math.min(...weights);
    const observedMax = Math.max(...weights);
    const observedSpan = Math.max(2.5, observedMax - observedMin);
    const lowerPad = Math.max(0.9, observedSpan * 0.22);
    const upperPad = Math.max(1.2, observedSpan * 0.3);
    const goalIsCloseEnoughToPlot = goal >= observedMin - Math.max(3.5, observedSpan * 0.38);
    const min = goalIsCloseEnoughToPlot
      ? Math.floor(Math.min(observedMin - lowerPad, goal - 1) * 2) / 2
      : Math.floor((observedMin - lowerPad) * 2) / 2;
    const max = Math.ceil((observedMax + upperPad) * 2) / 2;
    return { min, max };
  }, [dashboardSource, derivedSource, goal]);

  // Lift the Apple Health fetch so multiple slot renders share one network call.
  const healthStream = useHealthStream(authed ? opPw : '');
  const healthDays = healthStream.days;
  const trajectoryAnchorIso = latest ? isoDay(latest.date) : todayIso;
  const visibleTrajectoryReadings = useMemo(
    () => filterRowsForTrajectoryRange(dashboardSource, trajectoryRange, trajectoryAnchorIso),
    [dashboardSource, trajectoryAnchorIso, trajectoryRange],
  );
  const visibleTrajectoryHealthDays = useMemo(
    () => filterRowsForTrajectoryRange(healthDays, trajectoryRange, trajectoryAnchorIso),
    [healthDays, trajectoryAnchorIso, trajectoryRange],
  );
  const previousTrajectoryHealthDays = useMemo(
    () => previousRowsForTrajectoryRange(healthDays, trajectoryRange, trajectoryAnchorIso),
    [healthDays, trajectoryAnchorIso, trajectoryRange],
  );

  if (!authed) {
    return <Lock onUnlock={() => {
      // auth state was set in Lock before calling onUnlock
      handleUnlock();
    }} />;
  }

  if (!latest || !state) {
    const statusLabel = syncing
      ? 'Checking for your latest reading'
      : cloudOk === false
      ? 'Cloud fitness storage needs finishing'
      : 'No fitness readings logged yet';
    const statusCopy = syncing
      ? 'The operator dashboard is checking local and cloud fitness data now.'
      : cloudOk === false
      ? 'The old 17 May 2026 / 88.2kg value was coming from a baked-in demo feed. That fallback is now disabled, so this screen will wait for a real reading instead.'
      : 'If you weighed in this morning on 18 May 2026 and it is not showing here yet, the reading has not been synced into the fitness ledger.';

    return (
      <div className="fitness-reference-shell">
        <main className="wrap fitness-redesign" id="operator-overview">
          <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 0 120px',
          }}>
            <div style={{
              width: 'min(680px, 100%)',
              border: `1px solid ${T.line}`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(251,248,243,0.96) 100%)',
              boxShadow: CARD_SHADOW,
              padding: '32px clamp(22px, 4vw, 40px)',
            }}>
              <Kicker style={{ marginBottom: 10 }}>Operator fitness</Kicker>
              <h1 style={{ fontFamily: T.display, fontWeight: 400, fontSize: 'clamp(30px, 5vw, 44px)', color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.04, margin: '0 0 12px' }}>
                Waiting for a <em>real reading</em>
              </h1>
              <p style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 300, color: T.body, lineHeight: 1.75, margin: '0 0 22px', maxWidth: '52ch' }}>
                {statusCopy}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                marginBottom: 22,
              }}>
                <div style={{ border: `1px solid ${T.line}`, background: 'rgba(255,255,255,0.74)', padding: '14px 16px' }}>
                  <Kicker style={{ marginBottom: 8 }}>Status</Kicker>
                  <div style={{ fontFamily: T.display, fontSize: 22, color: T.ink, lineHeight: 1.05 }}>{statusLabel}</div>
                </div>
                <div style={{ border: `1px solid ${T.line}`, background: 'rgba(255,255,255,0.74)', padding: '14px 16px' }}>
                  <Kicker style={{ marginBottom: 8 }}>Today</Kicker>
                  <div style={{ fontFamily: T.display, fontSize: 22, color: T.ink, lineHeight: 1.05 }}>{fmtDate(todayIso, { long: true })}</div>
                </div>
                <div style={{ border: `1px solid ${T.line}`, background: 'rgba(255,255,255,0.74)', padding: '14px 16px' }}>
                  <Kicker style={{ marginBottom: 8 }}>Cloud sync</Kicker>
                  <div style={{ fontFamily: T.display, fontSize: 22, color: cloudOk === false ? T.rose : cloudOk ? T.green : T.gold, lineHeight: 1.05 }}>
                    {cloudOk === false ? 'Setup required' : cloudOk ? 'Connected' : 'Checking'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setCompose(true)}
                  style={{
                    background: T.ink,
                    color: T.paper,
                    border: `1px solid ${T.ink}`,
                    cursor: 'pointer',
                    padding: '11px 16px',
                    fontFamily: T.sans,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  File reading
                </button>
                <button
                  type="button"
                  onClick={() => { void refreshCloudReadings(); }}
                  style={{
                    background: 'transparent',
                    color: T.ink,
                    border: `1px solid ${T.line}`,
                    cursor: 'pointer',
                    padding: '11px 16px',
                    fontFamily: T.sans,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  Retry sync
                </button>
              </div>
            </div>
          </section>
          <Compose open={compose} onClose={() => setCompose(false)} onSubmit={handleAdd} />
        </main>
      </div>
    );
  }

  const previousWeek = nearestReadingByDays(dashboardSource, latest, 7);
  const cadence = loggingCadence(dashboardSource);
  const nutrition = nutritionTargets(latest);
  const targetDelta = latest.weight - goal;
  const sevenDayDelta = latest.weight - previousWeek.weight;
  const projectedGoal = reg ? goalDate(reg, goal) : null;
  const peakWeight = Math.max(...dashboardSource.map((row) => row.weight));
  const progress = peakWeight <= goal ? 100 : Math.max(0, Math.min(100, ((peakWeight - latest.weight) / (peakWeight - goal)) * 100));
  const syncSummary = cloudOk === null ? 'Local-first mode' : cloudOk ? (syncing ? 'Cloud syncing now' : 'Cloud sync active') : 'Local backup only';
  const latestHealthDay = healthDays[healthDays.length - 1] ?? null;
  const todayHealth = healthDays.find((d) => isoDay(d.date) === todayIso) ?? latestHealthDay;
  const caloriesInToday = todayHealth?.nutrition?.dietaryEnergyKcal ?? null;
  const activeKcalToday = todayHealth?.activity.activeEnergyKcal ?? null;
  const caloriesOutToday = todayHealth ? Math.round(nutrition.bmr + (activeKcalToday ?? 0)) : null;
  const actualDeficitToday = caloriesInToday !== null && caloriesOutToday !== null
    ? Math.round(caloriesOutToday - caloriesInToday)
    : null;
  const targetDeficit = Math.max(0, nutrition.activeTdee - nutrition.intake);
  const deficitLabel = actualDeficitToday !== null && actualDeficitToday < 0 ? 'kcal surplus' : 'kcal deficit';
  const deficitTone = actualDeficitToday === null
    ? 'neutral'
    : actualDeficitToday >= targetDeficit
      ? 'good'
      : actualDeficitToday >= 0
        ? 'neutral'
        : 'warn';
  const deficitSub = actualDeficitToday === null
    ? `Target ${targetDeficit.toLocaleString('en-GB')} kcal`
    : actualDeficitToday >= targetDeficit
      ? `Above ${targetDeficit.toLocaleString('en-GB')} kcal target`
      : actualDeficitToday >= 0
        ? `${(targetDeficit - actualDeficitToday).toLocaleString('en-GB')} kcal short of target`
        : `${Math.abs(actualDeficitToday).toLocaleString('en-GB')} kcal over burn`;
  const caloriesInDiff = caloriesInToday !== null ? Math.round(caloriesInToday - nutrition.intake) : null;
  const caloriesInSub = caloriesInDiff === null
    ? 'No food log synced yet today'
    : `${caloriesInDiff > 0 ? '+' : caloriesInDiff < 0 ? '−' : ''}${Math.abs(caloriesInDiff).toLocaleString('en-GB')} vs ${nutrition.intake.toLocaleString('en-GB')} target`;
  const caloriesOutSub = todayHealth
    ? `BMR ${nutrition.bmr.toLocaleString('en-GB')} + active ${(activeKcalToday ?? 0).toLocaleString('en-GB')} kcal`
    : 'Connect Apple Health to populate';
  const proteinToday = todayHealth?.nutrition?.proteinG ?? null;
  const carbsToday = todayHealth?.nutrition?.carbsG ?? null;
  const fatToday = todayHealth?.nutrition?.fatG ?? null;
  const fiberToday = todayHealth?.nutrition?.fiberG ?? null;
  const waterMlToday = todayHealth?.nutrition?.waterMl ?? null;
  const stepsToday = todayHealth?.activity?.steps ?? null;
  const exerciseToday = todayHealth?.activity?.exerciseMinutes ?? null;
  const checkpointWeeklyLossKg = 0.45;
  const goalCheckpoints = [30, 90].map((daysOut) => {
    const checkpointDate = parseLocalDateInput(latest.date);
    checkpointDate.setDate(checkpointDate.getDate() + daysOut);
    const projectedWeight = Math.max(goal, Math.round((latest.weight - ((checkpointWeeklyLossKg * daysOut) / 7)) * 10) / 10);
    return {
      date: localIsoDate(checkpointDate),
      value: projectedWeight,
      label: `${daysOut}D`,
      note: projectedWeight <= goal ? 'goal line' : `${projectedWeight.toFixed(1)} kg`,
    };
  });
  const goalGapTone = targetDelta <= 0 ? 'good' : targetDelta <= 12 ? 'neutral' : 'warn';
  const bodyFatTone = latest.bodyFat < 33 ? 'good' : latest.bodyFat < 39 ? 'neutral' : 'warn';
  const cadenceTone = cadence.score >= 80 ? 'good' : cadence.score >= 60 ? 'neutral' : 'warn';
  const todayTrackRead = (() => {
    if (!todayHealth) {
      return {
        tone: 'neutral' as const,
        label: 'Waiting on today',
        note: 'Health data has not refreshed yet, so this read is still provisional.',
      };
    }

    if (caloriesInToday === null) {
      return {
        tone: 'neutral' as const,
        label: 'Tracking still open',
        note: 'Movement is coming through, but the food log still needs to sync before the day can read on track.',
      };
    }

    const movementReady = (stepsToday ?? 0) >= 7000 || (exerciseToday ?? 0) >= 30;
    if (actualDeficitToday !== null && actualDeficitToday >= targetDeficit && movementReady) {
      return {
        tone: 'good' as const,
        label: 'On track today',
        note: 'Deficit is in range and movement is already supporting the day.',
      };
    }

    if (actualDeficitToday !== null && actualDeficitToday >= 0) {
      return {
        tone: 'neutral' as const,
        label: 'Still in range',
        note: movementReady
          ? 'Calories are pointed the right way. Keep the finish tidy and log the last meal.'
          : 'Calories are pointed the right way, but movement still needs topping up.',
      };
    }

    return {
      tone: 'warn' as const,
      label: 'Off track right now',
      note: 'The day is running behind plan, but a walk and a cleaner finish can still rescue it.',
    };
  })();
  const todaySnap: TodaySnapshot = {
    latest,
    state,
    goal,
    cadence,
    nutrition,
    caloriesInToday,
    caloriesOutToday,
    actualDeficitToday,
    targetDeficit,
    proteinG: proteinToday,
    carbsG: carbsToday,
    fatG: fatToday,
    fiberG: fiberToday,
    waterMl: waterMlToday,
    stepsToday,
    sevenDayDelta,
  };
  return (
    <div className="fitness-reference-shell">
      <main className="wrap fitness-redesign" id="operator-overview">
        <Reveal>
        <section className="fit-anchor-section" id="operator-today">
          {/* ───────────────────────── TODAY ─────────────────────────── */}
          <EditorialDivider eyebrow="Today" note="Where the body is right now." style={{ margin: '64px 0 40px' }} />

          <section className="fit-today">
            <div className="fit-today-head">
              <div>
                <span className="fit-today-label">Today at a glance</span>
                <div className="fit-today-copy">Calories in, calories out, deficit, weight, and the quality of today&apos;s tracking.</div>
              </div>
              <span className="muted">{formatReferenceDate(todayIso)}</span>
            </div>

            <div className="fit-today-signals">
              <div className="fit-today-signals-head">
                <span className={`fit-today-track-pill is-${todayTrackRead.tone}`}>{todayTrackRead.label}</span>
                <p className="fit-today-track-note">{todayTrackRead.note}</p>
              </div>
              <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="todayStrip" />
            </div>

            <section className="fit-weight-feature">
              <div className="fit-weight-spotlight">
                <div className="fit-weight-spotlight-figure">
                  <div className="fit-weight-spotlight-copy">
                    <div className="fit-weight-spotlight-facts">
                      <div className="fit-weight-spotlight-fact">
                        <span className="fit-weight-spotlight-fact-label">Goal gap</span>
                        <span className={`fit-weight-spotlight-fact-value is-${goalGapTone}`}>
                          {targetDelta <= 0 ? 'At goal' : `${targetDelta.toFixed(1)} kg`}
                        </span>
                        <span className="fit-weight-spotlight-fact-meta">
                          {targetDelta <= 0 ? 'working line met' : `${goal.toFixed(1)} kg target`}
                        </span>
                      </div>
                      <div className="fit-weight-spotlight-fact">
                        <span className="fit-weight-spotlight-fact-label">Body fat</span>
                        <span className={`fit-weight-spotlight-fact-value is-${bodyFatTone}`}>
                          {latest.bodyFat.toFixed(1)}%
                        </span>
                        <span className="fit-weight-spotlight-fact-meta">{fatStatus(latest.bodyFat)[0]}</span>
                      </div>
                      <div className="fit-weight-spotlight-fact">
                        <span className="fit-weight-spotlight-fact-label">Cadence</span>
                        <span className={`fit-weight-spotlight-fact-value is-${cadenceTone}`}>
                          {cadence.score}/100
                        </span>
                        <span className="fit-weight-spotlight-fact-meta">{cadence.count} days logged</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fit-weight-spotlight-meta">
                  <div className="fit-weight-spotlight-meta-head">
                    <div className="fit-kicker">This week&apos;s figure · {fmtDate(latest.date, { long: true })}</div>
                    <div className="fit-weight-spotlight-meta-value">
                      <span className="value"><AnimatedNumber value={latest.weight} decimals={1} /></span>
                      <span className="unit">kg</span>
                    </div>
                  </div>
                  <div className="fit-weight-spotlight-spark fit-weight-spotlight-spark-meta">
                    <HeadlineSparkline readings={dashboardSource.slice(-4)} variant="wide" />
                  </div>
                  <div className="fit-weight-feature-meta">
                    <span className={`fit-delta-pill ${sevenDayDelta >= 0 ? 'up' : 'down'}`}>
                      {sevenDayDelta >= 0 ? '↑' : '↓'} {Math.abs(sevenDayDelta).toFixed(1)}{' '}kg · vs 7d marker
                    </span>
                    <span className="fit-weight-feature-note">
                      {sevenDayDelta > 0 ? 'climbing further from goal' : sevenDayDelta < 0 ? 'closing the gap' : 'holding the line'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

          </section>
        </section>
        </Reveal>

        <Reveal delay={0.08}>
        <section className="fit-anchor-section" id="operator-trajectory">
          <section className="fit-editorial-chart" style={{ marginBottom: 28 }}>
            <FitnessLineChart
              title={<>Weight <em>trajectory</em></>}
              subtitle="Every daily reading, connected in order, with phase context across the selected window."
              points={buildWeightSeries(dashboardSource)}
              color="oklch(0.70 0.12 76)"
              minY={chartBounds.min}
              maxY={chartBounds.max}
              annotations={[
                {
                  date: dashboardSource.reduce((best, row) => (row.weight < best.weight ? row : best), dashboardSource[0]).date,
                  value: dashboardSource.reduce((best, row) => (row.weight < best.weight ? row : best), dashboardSource[0]).weight,
                  title: 'Leanest point',
                },
                {
                  date: dashboardSource.reduce((best, row) => (row.weight > best.weight ? row : best), dashboardSource[0]).date,
                  value: dashboardSource.reduce((best, row) => (row.weight > best.weight ? row : best), dashboardSource[0]).weight,
                  title: 'Peak weight',
                },
                { date: latest.date, value: latest.weight, title: weightLabel },
              ]}
              phases={phaseMarkers}
              checkpointMarkers={goalCheckpoints}
              range={trajectoryRange}
              onRangeChange={setTrajectoryRange}
              targetWeight={goal}
              showRangeToggle
            />
          </section>

          <div className="fit-trajectory-support">
            <WhyTheLineMovedStrip
              range={trajectoryRange}
              healthDays={visibleTrajectoryHealthDays}
              previousHealthDays={previousTrajectoryHealthDays}
              readings={visibleTrajectoryReadings}
              nutrition={todaySnap.nutrition}
            />
            <ConsistencyHeatmapCard
              anchorIso={trajectoryAnchorIso}
              range={trajectoryRange}
              healthDays={healthDays}
              readings={dashboardSource}
              calorieTarget={todaySnap.nutrition.intake}
            />
          </div>
        </section>
        </Reveal>

        <CollapsibleSection eyebrow="Story" note="Phase context, milestones, and visual evidence.">
        <Reveal>
        <section className="fit-anchor-section" id="operator-story">
          <div className="fit-story-shell">
            {/* ───────────────────────── STORY ─────────────────────────── */}
            <section className="fit-grid">
              <div className="fit-main">
                <div className="fit-panel">
                  <div className="fit-panel-head">
                    <div>
                      <h3>Phase <em>log</em></h3>
                      <div className="meta">The story rendered in the same cadence as the reference dashboard</div>
                    </div>
                  </div>
                  <div className="phase-log">
                    {phaseRows.map((row) => (
                      <div className={`phase-row ${row.current ? 'current' : ''}`} key={row.id}>
                        <div className={`swatch ${row.swatch}`} />
                        <div className="name">{row.name} <em>{row.emphasis}</em><span className="when">{row.when}</span></div>
                        <div className="duration">{row.duration}</div>
                        <div className="start">{row.start}</div>
                        <div className="end">{row.end}</div>
                        <div className={`delta ${row.deltaClass}`}>{row.delta}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="fit-panel fit-photo-panel">
                  <div className="fit-panel-head">
                    <div>
                      <h3>Visual <em>evidence</em></h3>
                      <div className="meta">Date-stamped progress slots wired to this same timeline</div>
                    </div>
                  </div>
                  <PhotoTimeline items={photoMilestones} />
                </div>
              </div>

              <aside className="fit-side">
                <div className="goal-card">
                  <div className="head"><span>Current goal</span><span className="pill brass">{targetDelta <= 0 ? 'On target' : 'Active cut'}</span></div>
                  <div className="target">{goal.toFixed(1)}kg <em>working line</em></div>
                  <div className="by">
                    {projectedGoal
                      ? `Projected from current slope - ${projectedGoal.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : 'Projection appears once the trend line starts moving down'}
                  </div>
                  <div className="bar">
                    <span className="fill" style={{ width: `${progress}%` }} />
                    <span className="marker" style={{ left: '100%' }} />
                  </div>
                  <div className="stats">
                    <div><div className="lbl">To goal</div><div className="v">{targetDelta.toFixed(1)}kg</div></div>
                    <div><div className="lbl">7-day move</div><div className="v">{formatWeightDelta(sevenDayDelta)}</div></div>
                    <div><div className="lbl">Intake plan</div><div className="v">{nutrition.intake.toLocaleString()} kcal</div></div>
                    <div><div className="lbl">BMR estimate</div><div className="v">{nutrition.bmr.toLocaleString()} kcal</div></div>
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="compare" />
        </Reveal>
        <Reveal delay={0.05}>
        <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="prs" />
        </Reveal>
        </CollapsibleSection>

        <Reveal delay={0.1}>
        <div className="fit-panel" style={{ marginBottom: 28 }}>
          <div className="fit-panel-head">
            <div>
              <h3>This <em>week</em></h3>
              <div className="meta">Monday through Sunday - weigh-ins, deltas and body-state context</div>
            </div>
          </div>
          <div className="week-grid">
            {weekRows.map((row) => (
              <div className={`week-cell ${row.weight === null ? 'missed' : ''} ${row.isToday ? 'today' : ''}`} key={`${row.day}-${row.date}`}>
                <div className="dow">{row.day}</div>
                <div className="date">{row.date}</div>
                <div className="w">{row.weight !== null ? <>{row.weight.toFixed(1)}<small>kg</small></> : '-'}</div>
                <div className={`delta ${row.delta.startsWith('+') ? 'up' : row.delta.startsWith('-') ? 'down' : 'flat'}`}>{row.delta}</div>
                <div className="icons"><span>{row.detail}</span></div>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        <Reveal delay={0.18}>
        <section className="fit-anchor-section" id="operator-food">
          <FoodBreakdownSection snap={todaySnap} />
          <TopNutritionCaloriesCard snap={todaySnap} healthDays={healthDays} activeKcalToday={activeKcalToday} />
        </section>
        </Reveal>

        <CollapsibleSection eyebrow="Trends" note="What the lines are doing — and why.">
        <Reveal>
        <section className="fit-anchor-section" id="operator-health-stream">
          {/* ───────────────────────── TRENDS ────────────────────────── */}
          <AnalyticsSection
            latest={latest}
            sorted={dashboardSource}
            goal={goal}
            nutrition={nutrition}
            state={state}
            healthStream={healthStream}
          />
          <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="mainGrid" />
          <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="correlations" />
        </section>
        </Reveal>

        <Reveal>
        <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="lifestyle" />
        </Reveal>
        </CollapsibleSection>

        <CollapsibleSection eyebrow="Action" note="Today's next move.">
        <Reveal>
        <section className="fit-anchor-section" id="operator-action">
          {/* Action block — promise + readiness folded into trends scroll. */}
          <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="readiness" />
          <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="accountability" />
          <HealthMetricsSection opPw={opPw} readings={dashboardSource} injected={healthStream} slot="promise" />
        </section>
        </Reveal>
        </CollapsibleSection>

      </main>

      <Compose open={compose} onClose={()=>setCompose(false)} onSubmit={handleAdd} />
    </div>
  );
}
