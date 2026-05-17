'use client';

import React, {
  useState, useEffect, useCallback, useMemo, FormEvent, useRef, CSSProperties,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FitnessReading {
  id: string; date: string; weight: number; bmi: number;
  bodyFat: number; water: number; muscleMass: number; boneMass: number;
  visceralFat?: number;
}
interface Reg {
  slope: number; intercept: number; r2: number; t0: number;
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

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtDate(iso: string, opts: { long?: boolean } = {}) {
  const d = new Date(iso);
  if (opts.long) return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDateObj(d: Date) {
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function weightStatus(w: number, goal: number): [string, string] {
  if (w <= goal) return ['AT GOAL', T.green];
  return ['ABOVE GOAL', T.rose];
}
function bmiStatus(b: number): [string, string] {
  if (b < 18.5) return ['UNDERWEIGHT', T.gold];
  if (b < 25)   return ['HEALTHY', T.green];
  if (b < 30)   return ['OVERWEIGHT', T.gold];
  return ['VERY HIGH', T.rose];
}
function fatStatus(f: number): [string, string] {
  if (f < 21) return ['LOW', T.gold];
  if (f < 33) return ['HEALTHY', T.green];
  if (f < 39) return ['HIGH', T.gold];
  return ['VERY HIGH', T.rose];
}
function waterStatus(w: number): [string, string] {
  if (w < 45) return ['LOW', T.rose];
  return ['HEALTHY', T.green];
}
function muscleStatus(m: number): [string, string] {
  if (m >= 45) return ['STRONG', T.green];
  if (m >= 38) return ['AVERAGE', T.gold];
  return ['LOW', T.rose];
}
function boneStatus(b: number): [string, string] {
  if (b >= 3.0) return ['HEALTHY', T.green];
  return ['LOW', T.gold];
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const kStyle: CSSProperties = {
  fontFamily: T.sans, fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: T.muted,
};
function Kicker({ children, color, style }: { children: React.ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ ...kStyle, color: color ?? T.muted, ...style }}>{children}</div>;
}
function Rule({ weight=0.5, style }: { weight?: number; style?: CSSProperties }) {
  return <div style={{ borderTop:`${weight}px solid ${T.line}`, ...style }} />;
}
function ThickRule({ style }: { style?: CSSProperties }) {
  return <div style={{ borderTop:`2px solid ${T.ink}`, ...style }} />;
}
function Wrap({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ maxWidth:1080, margin:'0 auto', padding:'56px 40px 120px', ...style }}>
      {children}
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

function assessState(sorted: FitnessReading[], goal: number, today: Date = new Date('2026-05-17')): State {
  const latest = sorted[sorted.length - 1];
  const daysSince = Math.floor((today.getTime() - new Date(latest.date).getTime()) / 86400000);
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
    <div style={{
      position: 'sticky', top: 0, zIndex: 30, background: T.paper,
      borderTop: `0.5px solid ${T.line}`, borderBottom: `2px solid ${T.ink}`,
      margin: '0 -40px 32px', padding: '0 40px',
    }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', maxWidth:1000, margin:'0 auto' }}>
        {cells.map((c, i) => (
          <button key={i} onClick={c.onClick} style={{
            padding:'16px 18px',
            borderRight: i < 3 ? `0.5px solid ${T.line}` : 'none',
            background:'none', border:'none', cursor:'pointer',
            textAlign:'left', fontFamily:T.sans,
          }}>
            <Kicker style={{ marginBottom:6, fontSize:9 }}>{c.kicker}</Kicker>
            <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:4 }}>
              <span style={{ fontFamily:T.display, fontSize:28, color:T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{c.value}</span>
              <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted, letterSpacing:'0.1em' }}>{c.unit}</span>
            </div>
            <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.18em', color:c.subColor }}>{c.sub}</span>
          </button>
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
    ? { title: 'Stop the gain first.', sub: 'Before the cut plan can work, the upward trend must break.', color: T.rose }
    : state.direction === 'stable'
    ? { title: 'Hold steady — then begin the cut.', sub: 'You are at a stable plateau. Initiate the moderate deficit this week.', color: T.gold }
    : state.direction === 'losing-slow'
    ? { title: 'On track. Stay the course.', sub: 'A slow, sustainable loss is exactly what the plan calls for.', color: T.green }
    : { title: 'Slow down — protect the muscle.', sub: 'Loss rate is high. Add a refeed day or ease the deficit by 100 kcal.', color: T.blue };

  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.line}`,
      padding: '28px 32px', marginBottom: 48,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:24, flexWrap:'wrap', marginBottom:18 }}>
        <div>
          <Kicker style={{ marginBottom:8 }}>This Week · {new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' })}</Kicker>
          <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, color: verdict.color, letterSpacing:'-0.02em', lineHeight:1.06, margin:'0 0 4px' }}>
            <em>{verdict.title}</em>
          </h2>
          <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, margin:0, lineHeight:1.6, maxWidth:'56ch' }}>{verdict.sub}</p>
        </div>
        <button onClick={() => setCompose(true)} style={{
          background: overdue ? T.rose : T.ink, color: T.paper, border: 0, cursor:'pointer',
          padding:'14px 28px', fontFamily:T.sans, fontSize:11, fontWeight:500,
          letterSpacing:'0.22em', textTransform:'uppercase', whiteSpace:'nowrap',
        }}>
          {overdue ? 'File overdue reading →' : 'File this week →'}
        </button>
      </div>

      <Rule style={{ margin:'0 0 18px' }} />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
        <div style={{ paddingRight:24, borderRight:`0.5px solid ${T.line}` }}>
          <Kicker style={{ marginBottom:8 }}>Aim for by next Monday</Kicker>
          <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
            <span style={{ fontFamily:T.display, fontSize:36, color:T.gold, letterSpacing:'-0.02em', lineHeight:1 }}>{state.thisWeekTarget}</span>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
          </div>
          <span style={{ fontFamily:T.sans, fontSize:11, color:T.green, fontWeight:500 }}>
            {targetDelta.toFixed(2)} kg from today
          </span>
        </div>
        <div style={{ padding:'0 24px', borderRight:`0.5px solid ${T.line}` }}>
          <Kicker style={{ marginBottom:8 }}>Last weigh-in</Kicker>
          <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
            <span style={{ fontFamily:T.display, fontSize:36, color:T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{state.daysSinceWeighIn}</span>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>{state.daysSinceWeighIn === 1 ? 'day' : 'days'} ago</span>
          </div>
          <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:500, color: overdue ? T.rose : T.green }}>
            {overdue ? 'OVERDUE — log it now' : 'On schedule'}
          </span>
        </div>
        <div style={{ paddingLeft:24 }}>
          <Kicker style={{ marginBottom:8 }}>Today&apos;s priority</Kicker>
          <button onClick={() => setTab('Plan')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, textAlign:'left' }}>
            <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.ink, lineHeight:1.3, marginBottom:4 }}>
              See the plan →
            </div>
            <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted, fontWeight:500, letterSpacing:'0.05em' }}>
              Five non-negotiables for this week
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Journey Story (auto-generated narrative) ────────────────────────────────

function JourneyStory({ sorted, state }: { sorted: FitnessReading[]; state: State }) {
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
      copy: `The first reading. BMI ${first.bmi}, body fat ${first.bodyFat}%. The starting line.`,
    },
    {
      kicker: `${fmtDate(state.best.date)}`,
      title: `${state.best.weight} kg · the lowest point`,
      copy: `Roughly ${Math.round((new Date(state.best.date).getTime() - new Date(first.date).getTime()) / 86400000 / 7)} weeks in. Proof that loss was possible.`,
    },
    {
      kicker: `${fmtDate(state.peak.date)}`,
      title: `${state.peak.weight} kg · the peak`,
      copy: `${(state.peak.weight - state.best.weight).toFixed(1)} kg above the low. The drift that needs reversing.`,
    },
    {
      kicker: `${fmtDate(latest.date)} · today`,
      title: `${latest.weight} kg`,
      copy: `${fromBest > 0 ? `+${fromBest.toFixed(1)}` : fromBest.toFixed(1)} kg from your best, ${fromPeak > 0 ? `−${fromPeak.toFixed(1)}` : `+${(-fromPeak).toFixed(1)}`} kg from peak. The journey resets here.`,
    },
  ];

  return (
    <div style={{ marginBottom: 64 }}>
      <Kicker style={{ marginBottom: 10 }}>Section · The Arc</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        {totalWeeks} weeks observed. <em>Three turning points.</em>
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        the story this data tells, in four moments.
      </p>
      <ThickRule style={{ margin: '18px 0 0' }} />
      <div style={{ borderBottom: `0.5px solid ${T.line}` }}>
        {events.map((e, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'180px 1fr', gap:32,
            padding:'22px 0', borderBottom: i < events.length - 1 ? `0.5px solid ${T.softLine}` : 'none',
            alignItems:'baseline',
          }}>
            <Kicker color={i === events.length - 1 ? T.gold : T.muted}>{e.kicker}</Kicker>
            <div>
              <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color: i === events.length - 1 ? T.gold : T.ink, marginBottom:6 }}>
                {e.title}
              </div>
              <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.6, margin:0, maxWidth:'62ch' }}>{e.copy}</p>
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
      label: 'PRIORITY · BREAK THE TREND',
      title: 'Before the plan, stop the gain.',
      copy: `You are gaining ${state.trendKgPerWeek.toFixed(2)} kg per week. A calorie deficit cannot work if the diet is currently in surplus. Phase zero: identify the surplus. Track every bite for the next 7 days at your current intake. The data will show where the gap is.`,
      action: 'Track current intake for 7 days, no changes yet',
      color: T.rose, bg: T.roseSoft,
    },
    'stable': {
      label: 'PRIORITY · BEGIN THE CUT',
      title: 'You are stable. Now move.',
      copy: `Last 4 weeks: ${state.trendKgPerWeek >= 0 ? '+' : ''}${state.trendKgPerWeek.toFixed(2)} kg/week — effectively flat. This is the easiest state to convert into loss: drop intake by 500 kcal, hold training, watch the trend.`,
      action: 'Begin moderate deficit this week. Hit the five non-negotiables.',
      color: T.gold, bg: T.goldSoft,
    },
    'losing-slow': {
      label: 'PRIORITY · STAY THE COURSE',
      title: 'Already on the right line.',
      copy: `Losing ${Math.abs(state.trendKgPerWeek).toFixed(2)} kg/week — within the sustainable zone. Do not change anything. Keep logging. The plan below codifies what is already working.`,
      action: 'Continue current approach. Re-evaluate in 4 weeks.',
      color: T.green, bg: T.greenSoft,
    },
    'losing-fast': {
      label: 'PRIORITY · SLOW IT DOWN',
      title: 'Loss rate too high to sustain.',
      copy: `Losing ${Math.abs(state.trendKgPerWeek).toFixed(2)} kg/week is unsustainable beyond ~6 weeks. Risk of muscle loss and adherence collapse. Add 200 kcal back to daily intake. Aim for −0.5 kg/week instead.`,
      action: 'Raise intake by 200 kcal/day. Add one carb-rich refeed day per week.',
      color: T.blue, bg: T.blueSoft,
    },
  } as const;

  const b = briefs[state.direction];

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ background: b.bg, borderLeft: `3px solid ${b.color}`, padding: '28px 32px' }}>
        <Kicker color={b.color} style={{ marginBottom: 12 }}>{b.label}</Kicker>
        <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:36, letterSpacing:'-0.02em', lineHeight:1.05, color:T.ink, margin:'0 0 14px' }}>
          {b.title}
        </h2>
        <p style={{ fontFamily:T.sans, fontSize:15, color:T.body, fontWeight:300, lineHeight:1.7, margin:'0 0 18px', maxWidth:'58ch' }}>
          {b.copy}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:14, paddingTop:14, borderTop:`0.5px solid ${b.color}33` }}>
          <Kicker color={b.color}>This week, do this:</Kicker>
          <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color:T.ink }}>{b.action}</span>
        </div>
      </div>

      <div style={{ display:'flex', gap:18, marginTop:16, flexWrap:'wrap' }}>
        <button onClick={() => setTab('Projections')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:3 }}>
            See your phase plan →
        </button>
        <button onClick={() => setTab('Health')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:3 }}>
            See the health panel →
        </button>
        <button onClick={() => setTab('Overview')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:3 }}>
            Back to overview →
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

  // BMR (Mifflin-St Jeor estimate, age 30)
  const bmr = Math.round(10 * latest.weight + 6.25 * HEIGHT_M * 100 - 5 * 30 - 161);
  const tdee = Math.round(bmr * 1.2);

  // Discipline score: how many of last 14 days had a reading?
  const last14ms = new Date(latest.date).getTime() - 14 * 86400000;
  const last14 = sorted.filter(r => new Date(r.date).getTime() >= last14ms).length;
  const discipline = Math.min(100, Math.round((last14 / 14) * 100));

  const cells = [
    { kicker:'BODY FAT',    value:`${latest.bodyFat.toFixed(1)}%`, sub:`${dFat>=0?'+':''}${dFat.toFixed(1)} in 30 days`, color: dFat<0?T.green:T.rose },
    { kicker:'MUSCLE MASS', value:`${latest.muscleMass.toFixed(1)}%`, sub:`${dMuscle>=0?'+':''}${dMuscle.toFixed(1)} since last month`, color: dMuscle>0?T.green:T.rose },
    { kicker:'VISCERAL FAT',value:`${latest.visceralFat ?? '—'}`,   sub:'target ≤ 9', color: (latest.visceralFat||0) > 9 ? T.gold : T.green },
    { kicker:'BMR',         value:`${bmr.toLocaleString()}`,        sub:`TDEE est ${tdee.toLocaleString()}`, color: T.body },
    { kicker:'WATER',       value:`${latest.water.toFixed(1)}%`,    sub: latest.water < 45 ? 'Low · drink up' : 'On range', color: latest.water < 45 ? T.gold : T.green },
    { kicker:'DISCIPLINE',  value:`${discipline}/100`,              sub:`${last14}/14 days logged`, color: discipline >= 80 ? T.green : discipline >= 50 ? T.gold : T.rose },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:32 }}>
      {cells.map((c,i) => (
        <div key={i} style={{ padding:'14px 16px', borderRight: i<5 ? `0.5px solid ${T.softLine}` : 'none' }}>
          <Kicker style={{ marginBottom:7, fontSize:8.5 }}>{c.kicker}</Kicker>
          <div style={{ fontFamily:T.display, fontSize:24, color:T.ink, letterSpacing:'-0.015em', lineHeight:1, marginBottom:5 }}>{c.value}</div>
          <span style={{ fontFamily:T.sans, fontSize:10, color:c.color, fontWeight:500 }}>{c.sub}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Current Goal Card ───────────────────────────────────────────────────────

function GoalCard({ state, latest, goal }: { state: State; latest: FitnessReading; goal: number }) {
  // Project goal date assuming 0.45 kg/wk
  const weeks = Math.max(0, (latest.weight - goal) / 0.45);
  const goalDate = new Date(new Date(latest.date).getTime() + weeks * 7 * 86400000);
  const intake = 1860 - 500;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:0, marginBottom:48, borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}` }}>
      <div style={{ padding:'20px 24px', borderRight:`0.5px solid ${T.line}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <Kicker>Current Goal</Kicker>
          <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.2em', padding:'2px 8px', background: state.direction === 'gaining' ? T.roseSoft : T.greenSoft, color: state.direction === 'gaining' ? T.rose : T.green }}>
            {state.direction === 'gaining' ? 'OFF TRACK' : 'ON TRACK'}
          </span>
        </div>
        <div style={{ marginBottom:6 }}>
          <span style={{ fontFamily:T.display, fontSize:36, color:T.gold, letterSpacing:'-0.02em' }}>{goal}kg</span>
          <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.muted, marginLeft:10 }}>healthy weight</span>
        </div>
        <p style={{ fontFamily:T.sans, fontSize:11, color:T.body, margin:0, lineHeight:1.5 }}>
          Target reached by <strong style={{ color:T.ink }}>{goalDate.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</strong> at the moderate-cut pace.
        </p>
      </div>
      <div style={{ padding:'20px 24px', borderRight:`0.5px solid ${T.line}` }}>
        <Kicker style={{ marginBottom:6 }}>To Goal</Kicker>
        <div style={{ fontFamily:T.display, fontSize:28, color:T.ink }}>{(latest.weight - goal).toFixed(1)}<span style={{ fontFamily:T.sans, fontSize:11, color:T.muted, marginLeft:5 }}>kg</span></div>
        <Kicker style={{ marginTop:14, marginBottom:6 }}>Projection</Kicker>
        <div style={{ fontFamily:T.display, fontSize:18, color:T.muted, fontStyle:'italic' }}>{Math.ceil(weeks/4.33)} months</div>
      </div>
      <div style={{ padding:'20px 24px' }}>
        <Kicker style={{ marginBottom:6 }}>Intake Plan</Kicker>
        <div style={{ fontFamily:T.display, fontSize:24, color:T.ink }}>{intake.toLocaleString()} <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kcal</span></div>
        <Kicker style={{ marginTop:14, marginBottom:6 }}>Burn Plan</Kicker>
        <div style={{ fontFamily:T.display, fontSize:18, color:T.muted, fontStyle:'italic' }}>{(1860).toLocaleString()} kcal/day</div>
      </div>
    </div>
  );
}

// ─── This Week 7-day Grid ───────────────────────────────────────────────────

function ThisWeekGrid({ sorted, state }: { sorted: FitnessReading[]; state: State }) {
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
    <div style={{ marginBottom: 48 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10 }}>
        <Kicker>This week · scale rhythm, deltas and training context</Kicker>
        <Kicker color={T.muted}>Mon {monday.toLocaleDateString('en-GB',{day:'numeric'})} – Sun {days[6].iso}</Kicker>
      </div>
      <ThickRule style={{ marginBottom:0 }} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:`0.5px solid ${T.line}` }}>
        {days.map((d, i) => (
          <div key={i} style={{
            padding:'18px 14px',
            borderRight: i<6 ? `0.5px solid ${T.softLine}` : 'none',
            background: d.isToday ? T.goldSoft : 'transparent',
            opacity: d.isFuture ? 0.4 : 1,
          }}>
            <Kicker style={{ marginBottom:4, fontSize:9 }}>{d.label}</Kicker>
            <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:11, color:T.muted, marginBottom:14 }}>{d.iso}</div>
            {d.reading ? (
              <>
                <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                  <span style={{ fontFamily:T.display, fontSize:22, color: d.isToday ? T.gold : T.ink, letterSpacing:'-0.015em', lineHeight:1 }}>{d.reading.weight.toFixed(1)}</span>
                  <span style={{ fontFamily:T.sans, fontSize:10, color:T.muted }}>kg</span>
                </div>
                {d.delta !== null && (
                  <div style={{ marginTop:6, fontFamily:T.sans, fontSize:10, color: d.delta > 0 ? T.rose : d.delta < 0 ? T.green : T.muted, fontWeight:500 }}>
                    {d.delta >= 0 ? '+' : ''}{d.delta.toFixed(1)}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.muted }}>—</div>
                <div style={{ fontFamily:T.sans, fontSize:9, color:T.muted, letterSpacing:'0.12em', marginTop:8 }}>{d.isFuture ? 'TO COME' : 'NO LOG'}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phase Log (timeline) ───────────────────────────────────────────────────

function PhaseLog({ sorted }: { sorted: FitnessReading[] }) {
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
    <div style={{ marginTop: 56 }}>
      <Kicker style={{ marginBottom:10 }}>Phase log</Kicker>
      <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:24, fontStyle:'italic', color:T.ink, margin:'0 0 6px' }}>
        The story: rise, collapse, rebuild, discipline.
      </h3>
      <ThickRule style={{ margin:'18px 0 0' }} />
      <div style={{ borderBottom:`0.5px solid ${T.line}` }}>
        {entries.map((e, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'4px 1.6fr 1fr 1fr 1fr 1fr',
            borderBottom: i<entries.length-1 ? `0.5px solid ${T.softLine}` : 'none',
            gap:20, alignItems:'baseline',
            background: e.current ? T.goldSoft : 'transparent',
            margin: e.current ? '0 -16px' : 0,
            padding: e.current ? '22px 16px' : '22px 0',
          }}>
            <div style={{ background:e.color, height:'100%', minHeight:48 }} />
            <div>
              <div style={{ fontFamily:T.display, fontSize:18, color:T.ink, marginBottom:3 }}>
                {e.title}{e.current && <em style={{ color:e.color, fontSize:14, marginLeft:8 }}>— current</em>}
              </div>
              <Kicker color={T.muted}>{e.sub}</Kicker>
            </div>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.muted }}>{e.months} months</div>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.body }}>{e.startKg.toFixed(1)}kg start</div>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.body }}>{e.endKg.toFixed(1)}kg {e.current ? 'now' : 'end'}</div>
            <div style={{ fontFamily:T.display, fontSize:18, color: e.delta > 0 ? T.rose : T.green, textAlign:'right' }}>
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

function ImportNote({ setTab: _setTab }: { setTab: (t:string)=>void }) {
  return (
    <div style={{ marginTop:48, padding:'24px 28px', background:T.surface, border:`0.5px solid ${T.line}` }}>
      <Kicker style={{ marginBottom:12 }}>Data sources · Apple Health</Kicker>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.ink, margin:'0 0 12px' }}>
        Direct Apple Health sync isn&apos;t possible from a browser.
      </p>
      <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.7, margin:'0 0 12px' }}>
        Apple only exposes HealthKit to native iOS apps. The practical paths:
      </p>
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
        <li style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, paddingLeft:20, position:'relative' }}>
          <span style={{ position:'absolute', left:0, color:T.gold, fontFamily:T.display, fontStyle:'italic' }}>i.</span>
          <strong style={{ color:T.ink, fontWeight:500 }}>Apple Health Export.</strong> iPhone → Health app → profile photo → Export All Health Data. Upload the resulting <code>export.xml</code> here (importer coming next iteration).
        </li>
        <li style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, paddingLeft:20, position:'relative' }}>
          <span style={{ position:'absolute', left:0, color:T.gold, fontFamily:T.display, fontStyle:'italic' }}>ii.</span>
          <strong style={{ color:T.ink, fontWeight:500 }}>Health Auto Export.</strong> £4 App Store app that pushes selected metrics to a webhook. Your existing POST <code>/api/operator/fitness</code> already accepts this format.
        </li>
        <li style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, paddingLeft:20, position:'relative' }}>
          <span style={{ position:'absolute', left:0, color:T.gold, fontFamily:T.display, fontStyle:'italic' }}>iii.</span>
          <strong style={{ color:T.ink, fontWeight:500 }}>Smart-scale cloud.</strong> Withings / Renpho / Eufy all have webhook APIs that mirror their Apple Health output — often more reliable than HealthKit re-exports.
        </li>
      </ul>
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
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:T.paper, padding:40 }}>
      <form onSubmit={submit} style={{ width:'100%', maxWidth:360, textAlign:'center' }}>
        <Kicker style={{ marginBottom:20 }}>Vol. 01 · Restricted Access</Kicker>
        <h1 style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize:48, color:T.ink, margin:'0 0 8px', letterSpacing:'-0.02em' }}>
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
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'end', paddingBottom:48, borderBottom:`2px solid ${T.ink}`, marginBottom:48 }}>
      <div>
        <Kicker style={{ marginBottom:14 }}>This Week&apos;s Figure · {fmtDate(latest.date, { long:true })}</Kicker>
        <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:12 }}>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize:120, letterSpacing:'-0.04em', lineHeight:0.85, color:T.ink }}>
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

// ─── Stat panel ───────────────────────────────────────────────────────────────

function StatItem({ label, value, unit, status, statusColor, last }: {
  label:string; value:string; unit:string; status:string; statusColor:string; last?:boolean;
}) {
  return (
    <div style={{ flex:1, padding:'22px 22px', borderRight: last ? 'none' : `0.5px solid ${T.line}` }}>
      <Kicker style={{ marginBottom:12 }}>{label}</Kicker>
      <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:10 }}>
        <span style={{ fontFamily:T.display, fontWeight:400, fontSize:40, lineHeight:1, color:T.ink, letterSpacing:'-0.015em' }}>{value}</span>
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
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginTop:16 }}>
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
              <span style={{ fontFamily:T.display, fontSize:34, color:T.ink, letterSpacing:'-0.01em' }}>{last.toFixed(1)}</span>
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
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        Waypoints <em>on the route home</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        {reg && reg.slope < 0 ? 'Estimated at your current rate of loss.' : 'Requires a trend reversal — current direction is away from goal.'}
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />
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
    </div>
  );
}

// ─── Cut Strategies ───────────────────────────────────────────────────────────

function CutStrategies({ sorted, goal }: { sorted:FitnessReading[]; goal:number }) {
  const latest = sorted[sorted.length-1];
  const toGo   = latest.weight - goal;

  // Mifflin-St Jeor BMR (female, age 30 — reasonable default)
  const bmr  = Math.round(10*latest.weight + 6.25*HEIGHT_M*100 - 5*30 - 161);
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
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
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
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize:56, color:T.gold, letterSpacing:'-0.02em', lineHeight:1 }}>Cut.</span>
        </div>
        <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:'28px 0 0', maxWidth:'52ch' }}>
          {verdictText}
        </p>
      </div>

      {/* TDEE estimate */}
      <div style={{ padding:'24px 0', borderBottom:`0.5px solid ${T.line}` }}>
        <Kicker style={{ marginBottom:14 }}>Estimated Daily Energy Expenditure · Mifflin-St Jeor (female, 30)</Kicker>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {[
            { label:'Sedentary', mult:'×1.2', kcal:tdee.sedentary, note:'Desk job, little exercise' },
            { label:'Lightly Active', mult:'×1.375', kcal:tdee.light, note:'Light exercise 1–3 days/wk' },
            { label:'Moderately Active', mult:'×1.55', kcal:tdee.moderate, note:'Exercise 3–5 days/wk' },
          ].map((row,i) => (
            <div key={i} style={{ padding:'16px 20px', borderRight: i<2?`0.5px solid ${T.line}`:'none' }}>
              <Kicker style={{ marginBottom:8 }}>{row.label} {row.mult}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:5 }}>
                <span style={{ fontFamily:T.display, fontSize:36, color:T.ink, letterSpacing:'-0.02em' }}>{row.kcal.toLocaleString()}</span>
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
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 1.2fr', padding:'12px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
          {['Strategy','Deficit','Intake (sedentary)','Loss rate','Goal date'].map((h,i)=>(
            <Kicker key={i} style={{ textAlign:i>0?'right':'left' }}>{h}</Kicker>
          ))}
        </div>
        {strategies.map((s, i) => {
          const kgPerWeek = (s.deficit/KcalPerKg*7);
          const intake = tdee.sedentary - s.deficit;
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
      </div>

      {/* Pro/Con detail */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginTop:48 }}>
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom:`0.5px solid ${T.line}` }}>
          {strategies.map((s,i) => {
            const target = parseFloat(thisWeekTarget(s.deficit));
            const change = target - latest.weight;
            const isRec = s.recommended;
            return (
              <div key={i} style={{ padding:'20px 18px', borderRight: i<3?`0.5px solid ${T.line}`:'none', background: isRec?T.goldSoft:'transparent' }}>
                <Kicker style={{ marginBottom:10 }} color={isRec?T.gold:undefined}>{s.name}</Kicker>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                  <span style={{ fontFamily:T.display, fontSize:38, color:isRec?T.gold:T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{target.toFixed(1)}</span>
                  <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
                </div>
                <div style={{ fontFamily:T.sans, fontSize:11, color:T.green, fontWeight:500 }}>
                  {change.toFixed(2)} kg this week
                </div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:T.muted, marginTop:4, letterSpacing:'0.05em' }}>
                  {(tdee.sedentary - s.deficit).toLocaleString()} kcal/day
                </div>
              </div>
            );
          })}
        </div>
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
  const deficit = 500; // recommended moderate cut

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
        `Eat at ${Math.round(1860 - 500).toLocaleString()} kcal/day (sedentary TDEE − 500)`,
        `Protein: ${Math.round(latest.weight * 1.8)} g/day minimum to protect muscle`,
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
        'Eat at maintenance (~1,860 kcal/day sedentary)',
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
        `Protein: ${Math.round(78 * 1.8)} g/day (recalculated for new weight)`,
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
        'Eat at maintenance again (~1,720 kcal/day at 70 kg)',
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
        'Maintenance calories (~1,720/day) — not a deficit',
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
        `Mild deficit: −400 kcal/day (easier at lower body fat)`,
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
        'Eat at maintenance for your new weight',
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
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        When to cut, when to rest, <em>when to build</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        Seven phases from today to goal and beyond — triggered by body fat, not just scale weight.
      </p>

      {/* Key rule */}
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'start', padding:'24px 0', margin:'18px 0 0', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
        <div>
          <Kicker style={{ marginBottom:8 }}>The Rule</Kicker>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize:48, letterSpacing:'-0.02em', lineHeight:1, color:T.rose }}>
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
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
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
                <span style={{ fontFamily:T.display, fontWeight:400, fontSize:48, color:item.color, letterSpacing:'-0.02em', lineHeight:1 }}>{item.value}</span>
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
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:14 }}>
        {[
          { l:'Total Lost',   v:`${totalLost.toFixed(1)} kg`,    c:T.green },
          { l:'Total Gained', v:`+${totalGained.toFixed(1)} kg`, c:T.rose  },
          { l:'Net Change',   v:`${netChange>0?'+':''}${netChange.toFixed(1)} kg`, c: netChange > 0 ? T.rose : T.green },
        ].map((m,i)=>(
          <div key={i} style={{ padding:'18px 20px', borderRight: i<2 ? `0.5px solid ${T.line}` : 'none' }}>
            <Kicker style={{ marginBottom:8 }}>{m.l}</Kicker>
            <span style={{ fontFamily:T.display, fontSize:32, color:m.c, letterSpacing:'-0.02em' }}>{m.v}</span>
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

function PieComposition({ latest, goal }: { latest: FitnessReading; goal: number }) {
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

  const W = 200, H = 200;
  const cx = W/2, cy = H/2;
  const rO = 80, rI = 46;

  const renderPie = (slices: Slice[], heading: string, totalKg: number, sub: string) => {
    const wedges = donutSlices(slices, cx, cy, rO, rI);
    return (
      <div style={{ padding:'18px 24px', textAlign:'center' }}>
        <Kicker style={{ marginBottom:10 }}>{heading}</Kicker>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', maxWidth:200, height:'auto' }}>
          {wedges.map(w => <path key={w.key} d={w.d} fill={w.color} opacity="0.85" />)}
          <text x={cx} y={cy-4} textAnchor="middle" fontFamily={T.display} fontSize="22" fill={T.ink} letterSpacing="-0.02em">
            {totalKg.toFixed(1)}
          </text>
          <text x={cx} y={cy+14} textAnchor="middle" fontFamily={T.sans} fontSize="9" fill={T.muted} letterSpacing="0.18em">KG TOTAL</text>
        </svg>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:13, color:T.muted, margin:'8px 0 0' }}>{sub}</p>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, gap:0 }}>
        <div style={{ borderRight:`0.5px solid ${T.line}` }}>
          {renderPie(currentSlices, 'Today · the current composition', latest.weight, `at ${latest.weight} kg`)}
        </div>
        <div>
          {renderPie(goalSlices, `At ${goal} kg · the target composition`, goal, 'estimated at 25% body fat')}
        </div>
      </div>

      {/* Legend with kg/% breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', marginTop:24, borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}` }}>
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
  const latest = sorted[sorted.length - 1];
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

  return (
    <div>
      <Kicker style={{ marginBottom:10 }}>Section · Health Panel</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:'0 0 8px' }}>
        Beyond the scale, <em>the full picture</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 36px' }}>
        {sorted.length} readings over {daysObserved} days · journey from {first.weight} kg to {latest.weight} kg
      </p>

      {/* Health flags grid */}
      <Kicker style={{ marginBottom:10 }}>The Four Health Markers</Kicker>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
        {healthFlags.map((f, i) => {
          const [stTxt, stCol] = f.status;
          return (
            <div key={f.label} style={{ padding:'22px 24px', borderRight: i%2===0 ? `0.5px solid ${T.line}` : 'none', borderBottom: i<2 ? `0.5px solid ${T.line}` : 'none' }}>
              <Kicker style={{ marginBottom:10 }}>{f.label}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:8 }}>
                <span style={{ fontFamily:T.display, fontWeight:400, fontSize:44, letterSpacing:'-0.02em', lineHeight:1, color:T.ink }}>{f.value}</span>
                <span style={{ fontFamily:T.sans, fontSize:9, fontWeight:600, letterSpacing:'0.22em', padding:'3px 8px', background:stCol+'18', color:stCol }}>{stTxt}</span>
              </div>
              <div style={{ fontFamily:T.sans, fontSize:11, color: f.change > 0 ? T.rose : f.change < 0 ? T.green : T.muted, fontWeight:500, marginBottom:8 }}>
                {f.change > 0 ? '▲' : f.change < 0 ? '▼' : '—'} {Math.abs(f.change).toFixed(1)} since first reading
              </div>
              <p style={{ fontFamily:T.sans, fontSize:12, color:T.body, fontWeight:300, lineHeight:1.5, margin:0 }}>{f.note}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly bar chart */}
      <div style={{ marginTop:72 }}>
        <Kicker style={{ marginBottom:10 }}>Monthly Weight Change · {sorted.length} weekly readings aggregated</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:32, letterSpacing:'-0.015em', lineHeight:1.05, color:T.ink, margin:'0 0 8px' }}>
          The good months, the <em>bad months</em>.
        </h3>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.muted, lineHeight:1.6, maxWidth:'62ch', margin:'0 0 18px' }}>
          green bars mark months you lost weight; rose bars mark months you gained. The pattern is the truth — short loss streaks followed by sustained gain.
        </p>
        <MonthlyBarChart sorted={sorted} />
      </div>

      {/* Composition pie comparison */}
      <div style={{ marginTop:80 }}>
        <Kicker style={{ marginBottom:10 }}>Body Composition · Now vs Target</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:32, letterSpacing:'-0.015em', lineHeight:1.05, color:T.ink, margin:'0 0 8px' }}>
          Where the kilograms <em>live</em>.
        </h3>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.muted, lineHeight:1.6, maxWidth:'62ch', margin:'0 0 18px' }}>
          target composition assumes muscle mass is preserved through resistance training while body fat drops to a healthy 25%.
        </p>
        <PieComposition latest={latest} goal={goal} />
      </div>

      {/* Journey landmarks */}
      <div style={{ marginTop:72 }}>
        <Kicker style={{ marginBottom:10 }}>The Journey · Three Years of Data</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:32, letterSpacing:'-0.015em', lineHeight:1.05, color:T.ink, margin:'0 0 18px' }}>
          From low to high, <em>and back to low</em>.
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
          {[
            { l:'Lightest', v:`${minWeight} kg`, d:fmtDate(minDate), c:T.green },
            { l:'Heaviest', v:`${maxWeight} kg`, d:fmtDate(maxDate), c:T.rose },
            { l:'Range',    v:`${(maxWeight-minWeight).toFixed(1)} kg`, d:`peak to trough`, c:T.gold },
            { l:'Last 8 weeks', v:`${recentSlope>=0?'+':''}${recentSlope.toFixed(2)} kg/wk`, d:`recent trend`, c: recentSlope>=0 ? T.rose : T.green },
          ].map((m,i)=>(
            <div key={i} style={{ padding:'22px 22px', borderRight: i<3?`0.5px solid ${T.line}`:'none' }}>
              <Kicker style={{ marginBottom:10 }}>{m.l}</Kicker>
              <div style={{ fontFamily:T.display, fontSize:30, color:m.c, letterSpacing:'-0.015em', lineHeight:1 }}>{m.v}</div>
              <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:12, color:T.muted, margin:'8px 0 0' }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── The Plan ────────────────────────────────────────────────────────────────

function PlanTab({ sorted, goal, state, setTab }: { sorted: FitnessReading[]; goal: number; state: State; setTab: (t: string) => void }) {
  const latest = sorted[sorted.length - 1];
  const bmr  = Math.round(10*latest.weight + 6.25*HEIGHT_M*100 - 5*30 - 161);
  const tdee = Math.round(bmr * 1.2);
  const intake = tdee - 500;
  const protein = Math.round(latest.weight * 1.8);
  const goalDate = new Date(new Date(latest.date).getTime() + ((latest.weight - goal) / 0.45 * 7) * 86400000);

  const sectionGap = { marginTop: 64 };

  return (
    <div>
      <PlanOpener state={state} sorted={sorted} setTab={setTab} />

      <Kicker style={{ marginBottom:10 }}>Section · The Solid Plan</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(40px,6vw,68px)', letterSpacing:'-0.025em', lineHeight:0.98, color:T.ink, margin:'0 0 12px' }}>
        A plan you can <em>actually follow</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color:T.muted, margin:'0 0 36px', maxWidth:'52ch', lineHeight:1.5 }}>
        Specific numbers, specific actions, no vague advice. Built from {sorted.length} of your own readings.
      </p>

      {/* The Mission */}
      <div style={{ background:T.surface, border:`0.5px solid ${T.line}`, padding:'32px 36px', marginBottom:48 }}>
        <Kicker style={{ marginBottom:14 }}>The Mission</Kicker>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24, alignItems:'baseline' }}>
          <div>
            <div style={{ fontFamily:T.display, fontSize:48, color:T.rose, letterSpacing:'-0.02em', lineHeight:1 }}>{latest.weight}</div>
            <Kicker color={T.muted} style={{ marginTop:6 }}>FROM (kg)</Kicker>
          </div>
          <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.muted, textAlign:'center' }}>→</div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:T.display, fontSize:48, color:T.gold, letterSpacing:'-0.02em', lineHeight:1 }}>{goal.toFixed(0)}</div>
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
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:30, letterSpacing:'-0.015em', lineHeight:1.06, color:T.ink, margin:'0 0 24px' }}>
          Rules that don&apos;t bend, <em>ever</em>.
        </h3>
        <ThickRule />
        {[
          {n:'01', r:'Weigh in every Monday morning',                                        d:'Same time, same clothing (or none). One number per week — that is the data point. Ignore daily fluctuation.'},
          {n:'02', r:`Eat at most ${intake.toLocaleString()} kcal per day on average`,       d:`This is your sedentary TDEE (${tdee.toLocaleString()}) minus a 500-kcal moderate deficit. Track it for the first 8 weeks at minimum.`},
          {n:'03', r:`Hit ${protein}g of protein every day`,                                 d:'1.8g per kg of bodyweight. This protects muscle during the deficit. Non-negotiable on training days especially.'},
          {n:'04', r:'Lift three times per week, minimum',                                   d:'45-60 minute sessions. Compound movements. Progressive overload. Walks do not count as resistance training.'},
          {n:'05', r:'Log every reading, every meal, every session',                         d:'Even the bad weeks. Especially the bad weeks. Data with gaps cannot be analysed.'},
        ].map(rule => (
          <div key={rule.n} style={{ display:'grid', gridTemplateColumns:'56px 1fr', padding:'22px 0', borderBottom:`0.5px solid ${T.softLine}`, alignItems:'baseline', gap:16 }}>
            <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:34, color:T.gold, lineHeight:1 }}>{rule.n}</span>
            <div>
              <p style={{ fontFamily:T.display, fontSize:19, color:T.ink, margin:'0 0 4px', fontWeight:400, lineHeight:1.4 }}>{rule.r}</p>
              <p style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300, lineHeight:1.6, margin:0 }}>{rule.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Day of eating */}
      <div style={sectionGap}>
        <Kicker style={{ marginBottom:10 }}>II · A Day of Eating</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:30, letterSpacing:'-0.015em', lineHeight:1.06, color:T.ink, margin:'0 0 8px' }}>
          What <em>{intake.toLocaleString()}</em> kcal &amp; <em>{protein}g</em> of protein actually looks like.
        </h3>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.muted, margin:'0 0 18px' }}>
          one possible day — adjust for your preferences, but match the totals.
        </p>
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
      </div>

      {/* Training split */}
      <div style={sectionGap}>
        <Kicker style={{ marginBottom:10 }}>III · The Training Split</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:30, letterSpacing:'-0.015em', lineHeight:1.06, color:T.ink, margin:'0 0 18px' }}>
          Three sessions a week. <em>Forty-five minutes each.</em>
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
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
      </div>

      {/* Weekly check-in */}
      <div style={sectionGap}>
        <Kicker style={{ marginBottom:10 }}>IV · Weekly Check-in Protocol</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:30, letterSpacing:'-0.015em', lineHeight:1.06, color:T.ink, margin:'0 0 18px' }}>
          Every Monday morning. <em>Seven minutes, no skipping.</em>
        </h3>
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
      </div>

      {/* Troubleshooting */}
      <div style={sectionGap}>
        <Kicker style={{ marginBottom:10 }}>V · Troubleshooting</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:30, letterSpacing:'-0.015em', lineHeight:1.06, color:T.ink, margin:'0 0 18px' }}>
          When the plan <em>stalls</em>.
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}` }}>
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
      </div>

      {/* The closing piece */}
      <div style={{ ...sectionGap, padding:'40px 36px', background:T.goldSoft, borderLeft:`3px solid ${T.gold}` }}>
        <Kicker color={T.gold} style={{ marginBottom:12 }}>The Closing Thought</Kicker>
        <p style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize:24, color:T.ink, lineHeight:1.45, margin:'0 0 12px' }}>
          {sorted.length} readings show that you can lose weight; you have done it before, from {Math.max(...sorted.map(r=>r.weight))} kg down to {Math.min(...sorted.map(r=>r.weight))} kg.
        </p>
        <p style={{ fontFamily:T.sans, fontSize:15, color:T.body, fontWeight:300, lineHeight:1.7, margin:0, maxWidth:'62ch' }}>
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
  const [form, setForm] = useState({ date:new Date().toISOString().slice(0,10), weight:'', bmi:'', bodyFat:'', water:'', muscleMass:'', boneMass:'' });
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
    <div style={{ position:'fixed', inset:0, background:'rgba(26,24,21,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:24 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:T.paper, maxWidth:480, width:'100%', padding:'40px 40px 48px', maxHeight:'90vh', overflowY:'auto' }}>
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

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function OperatorDashboardClient() {
  const [authed, setAuthed]   = useState(false);
  const [opPw, setOpPw]       = useState('');
  const [tab, setTab]         = useState('Overview');
  const [readings, setReadings] = useState<FitnessReading[]>([]);
  const [goal, setGoal]       = useState(60.0);
  const [compose, setCompose] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean|null>(null);

  const saveLocal = useCallback((rs:FitnessReading[]) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(rs)); }, []);

  const loadData = useCallback(async (pw:string) => {
    const localRaw = localStorage.getItem(STORAGE_KEY);
    const local: FitnessReading[] = localRaw ? JSON.parse(localRaw) : SEED;
    setReadings(local);
    if (!localRaw) saveLocal(local);
    setSyncing(true);
    const cloud = await apiLoad(pw);
    setSyncing(false);
    if (cloud === null) { setCloudOk(false); return; }
    setCloudOk(true);
    if (cloud.length === 0) {
      for (const r of local) { const nid = await apiSave(pw, r); if (nid) r.id = nid; }
      setReadings([...local]); saveLocal(local);
    } else { setReadings(cloud); saveLocal(cloud); }
  }, [saveLocal]);

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

  const sorted   = useMemo(() => [...readings].sort((a,b)=>a.date.localeCompare(b.date)), [readings]);
  const reg      = useMemo(() => regress(sorted), [sorted]);
  const latest   = sorted[sorted.length-1];
  const previous = sorted.length>=2 ? sorted[sorted.length-2] : latest;
  const state    = useMemo(() => assessState(sorted.length > 0 ? sorted : SEED, goal), [sorted, goal]);

  if (!authed) {
    return <Lock onUnlock={() => {
      // auth state was set in Lock before calling onUnlock
      handleUnlock();
    }} />;
  }

  if (!latest) return <div style={{ background:T.paper, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.muted }}>No readings yet.</p></div>;

  const slopePerWeek = reg ? reg.slope*7 : 0;
  const startKg = sorted[0].weight;
  const remaining = latest.weight - goal;
  const reqRate6m = remaining/26;
  const reqRate1y = remaining/52;

  const projAt = (d:number) => reg ? project(reg, daysFrom(reg, new Date(latest.date)) + d) : 0;
  const projections = reg ? [
    { label:'1 month',  kg:projAt(30),  delta:projAt(30)-latest.weight },
    { label:'3 months', kg:projAt(90),  delta:projAt(90)-latest.weight },
    { label:'6 months', kg:projAt(180), delta:projAt(180)-latest.weight },
    { label:'1 year',   kg:projAt(365), delta:projAt(365)-latest.weight },
  ] : [];

  const [wsTxt,wsCol] = weightStatus(latest.weight, goal);
  const [bsTxt,bsCol] = bmiStatus(latest.bmi);
  const [fsTxt,fsCol] = fatStatus(latest.bodyFat);
  const [waTxt,waCol] = waterStatus(latest.water);
  const [msTxt,msCol] = muscleStatus(latest.muscleMass);
  const [bonTxt,bonCol] = boneStatus(latest.boneMass);

  const TABS = ['Overview','Health','Projections','Plan','Charts','Ledger'];

  return (
    <div style={{ background:T.paper, minHeight:'100vh' }}>
      <Wrap>

        {/* ── MASTHEAD ─────────────────────────────── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div>
            <Kicker>The Operator Log · Vol. 01 · Issue {sorted.length.toString().padStart(2,'0')}</Kicker>
          </div>
          <Kicker color={T.ink}>{fmtDate(latest.date, { long:true })}</Kicker>
        </div>

        <h1 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(48px,7vw,88px)', letterSpacing:'-0.025em', lineHeight:0.96, color:T.ink, margin:'0 0 24px', maxWidth:'16ch' }}>
          Weight, composition &amp; the <em>line headed home</em>.
        </h1>

        <div style={{ display:'grid', gridTemplateColumns:'2.2fr 1fr', gap:60, alignItems:'start', marginBottom:32 }}>
          <p style={{ fontFamily:T.sans, fontSize:18, fontWeight:300, lineHeight:1.6, color:T.body, margin:0, maxWidth:'52ch' }}>
            {sorted.length === 7 ? 'Seventh' : `${sorted.length}th`} recorded weigh-in since November. A private operator log charting the slow march of the body, the slope of the trend, and what the regression projects forward against the{' '}
            <em style={{ fontFamily:T.display, color:T.gold }}>{goal.toFixed(1)} kg</em> goal.
          </p>
          <div style={{ borderLeft:`0.5px solid ${T.line}`, paddingLeft:24 }}>
            <Kicker style={{ marginBottom:6 }}>By the Numbers</Kicker>
            <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.body, lineHeight:1.8 }}>
              {sorted.length} readings · {reg ? Math.round(reg.r2*100) : 0}% R² · slope{' '}
              <span style={{ color: slopePerWeek>=0 ? T.rose : T.green }}>{slopePerWeek>=0?'+':''}{slopePerWeek.toFixed(2)} kg/wk</span>
              {syncing && <span style={{ color:T.muted }}> · syncing…</span>}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}`, gap:24, flexWrap:'wrap', marginBottom:6 }}>
          <div style={{ display:'flex', gap:32, flexWrap:'wrap', alignItems:'baseline' }}>
            <Kicker>
              <span style={{ display:'inline-block', width:6, height:6, background: cloudOk?T.green:T.muted, marginRight:7, verticalAlign:'middle' }} />
              {cloudOk===null ? 'Local' : cloudOk ? 'Cloud sync · active' : 'Local only'} · {readings.length} entries
            </Kicker>
            {reg && <Kicker>R² {Math.round(reg.r2*100)}% confidence</Kicker>}
          </div>
          <button onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }} style={{ background:'transparent', border:0, cursor:'pointer', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:3 }}>
            Lock ⌃
          </button>
        </div>

        {/* ── TABS ─────────────────────────────────── */}
        <nav style={{ display:'flex', gap:48, padding:'16px 0 16px', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:56 }}>
          {TABS.map(label => {
            const active = tab===label;
            return (
              <button key={label} onClick={()=>setTab(label)} style={{
                background:'transparent', border:0, cursor:'pointer', padding:'4px 0',
                fontFamily: active ? T.display : T.sans,
                fontStyle: active ? 'italic' : 'normal',
                fontSize: active ? 16 : 10, fontWeight: active ? 400 : 500,
                letterSpacing: active ? '-0.01em' : '0.24em',
                textTransform: active ? 'none' : 'uppercase',
                color: active ? T.ink : T.muted,
                borderBottom: active ? `1px solid ${T.ink}` : 'none',
                marginBottom:-1, transition:'color 200ms',
              }}>
                {active ? label.toLowerCase() : label}
              </button>
            );
          })}
        </nav>

        {/* Sticky context strip — always visible across every tab */}
        <StatusStrip state={state} latest={latest} goal={goal} setTab={setTab} />

        {/* ── OVERVIEW ─────────────────────────────── */}
        {tab==='Overview' && (
          <div>
            <ThisWeek state={state} latest={latest} setCompose={setCompose} setTab={setTab} />

            {/* The compact 6-cell stat strip */}
            <TopStatStrip sorted={sorted} state={state} />

            {/* Goal banner */}
            <GoalCard state={state} latest={latest} goal={goal} />

            {/* Centrepiece phase-banded chart */}
            <div style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                <div>
                  <Kicker style={{ marginBottom:4 }}>Weight, phases and <em>evidence</em></Kicker>
                  <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.muted, margin:0 }}>
                    raw readings · smoothed trend · phase bands · pinned events
                  </p>
                </div>
              </div>
              <PhaseChart sorted={sorted} goal={goal} range="all" />
            </div>

            {/* This week's 7-day rhythm */}
            <ThisWeekGrid sorted={sorted} state={state} />

            {/* Hero reading + journey arc */}
            <HeroReading latest={latest} previous={previous} sorted={sorted} />
            <JourneyStory sorted={sorted} state={state} />

            {/* Phase log timeline */}
            <PhaseLog sorted={sorted} />

            {/* Command notes */}
            <CommandNotes sorted={sorted} state={state} latest={latest} />


            <Kicker style={{ marginBottom:10 }}>Section I · The Full Panel</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>Six readings, <em>one body</em>.</h2>
            <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 20px' }}>
              filed {fmtDate(latest.date,{long:true})} — all metrics from the latest weigh-in.
            </p>
            <div style={{ display:'flex', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:64 }}>
              <StatItem label="Weight"    value={latest.weight.toFixed(1)}     unit="kg" status={wsTxt}  statusColor={wsCol} />
              <StatItem label="BMI"       value={latest.bmi.toFixed(1)}        unit=""   status={bsTxt}  statusColor={bsCol} />
              <StatItem label="Body Fat"  value={latest.bodyFat.toFixed(1)}    unit="%"  status={fsTxt}  statusColor={fsCol} />
              <StatItem label="Water"     value={latest.water.toFixed(1)}      unit="%"  status={waTxt}  statusColor={waCol} />
              <StatItem label="Muscle"    value={latest.muscleMass.toFixed(1)} unit="%"  status={msTxt}  statusColor={msCol} />
              <StatItem label="Bone"      value={latest.boneMass.toFixed(1)}   unit="%"  status={bonTxt} statusColor={bonCol} last />
            </div>

            <Kicker style={{ marginBottom:10 }}>Section II · The Goal</Kicker>
            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:40, alignItems:'baseline', marginBottom:16 }}>
              <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:96, letterSpacing:'-0.025em', lineHeight:0.9, color:T.gold, margin:0 }}>
                {goal.toFixed(0)}<span style={{ fontStyle:'italic', fontSize:42, opacity:0.6 }}>.0</span>
                <span style={{ fontFamily:T.sans, fontSize:14, color:T.muted, letterSpacing:0, marginLeft:10 }}>kg</span>
              </h2>
              <div>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.ink, marginBottom:8 }}>
                  <em>{remaining.toFixed(1)} kilograms</em> still to lose.
                </div>
                <div style={{ fontFamily:T.sans, fontSize:13, color:T.body, lineHeight:1.6, maxWidth:'48ch' }}>
                  Began at <strong style={{ color:T.ink }}>{startKg.toFixed(1)} kg</strong>; sitting at{' '}
                  <strong style={{ color:T.rose }}>{latest.weight.toFixed(1)} kg</strong> today. Direction of travel currently away from goal — see <button onClick={()=>setTab('Projections')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.display, fontStyle:'italic', fontSize:13, color:T.gold, padding:0, textDecoration:'underline' }}>Projections</button> for corrective rate required.
                </div>
              </div>
            </div>

            {/* Progress track */}
            {(() => {
              const range = Math.max(startKg, latest.weight) - goal;
              const currentPct = (1-(latest.weight-goal)/range)*100;
              const startPct   = (1-(startKg-goal)/range)*100;
              return (
                <div style={{ marginTop:16, marginBottom:8 }}>
                  <div style={{ position:'relative', height:28, marginBottom:8 }}>
                    <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:T.line, transform:'translateY(-50%)' }} />
                    <div style={{ position:'absolute', top:'50%', height:3, transform:'translateY(-50%)', left:`${Math.min(currentPct,startPct)}%`, width:`${Math.abs(startPct-currentPct)}%`, background:T.rose, opacity:0.2 }} />
                    <div style={{ position:'absolute', left:0, top:'25%', bottom:'25%', width:2, background:T.gold }} />
                    <div style={{ position:'absolute', left:`${startPct}%`, top:'25%', bottom:'25%', width:1, background:T.muted }} />
                    <div style={{ position:'absolute', left:`${currentPct}%`, top:0, bottom:0, width:2, background:T.rose }} />
                    <div style={{ position:'absolute', left:`${currentPct}%`, top:-20, transform:'translateX(-50%)', fontFamily:T.display, fontStyle:'italic', fontSize:11, color:T.rose, whiteSpace:'nowrap' }}>
                      {latest.weight.toFixed(1)} kg
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', borderTop:`0.5px solid ${T.line}`, paddingTop:8 }}>
                    <Kicker color={T.gold}>← Goal {goal.toFixed(1)}</Kicker>
                    <Kicker color={T.muted}>Start {startKg.toFixed(1)}</Kicker>
                    <Kicker color={T.rose}>Today {latest.weight.toFixed(1)} →</Kicker>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop:64 }}>
              <Kicker style={{ marginBottom:10 }}>Section III · Composition</Kicker>
              <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>Where the body has <em>shifted</em>.</h2>
              <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:0 }}>a seven-month span — three slow-moving metrics, side by side.</p>
              <CompositionChart sorted={sorted} />
            </div>

            <Milestones sorted={sorted} reg={reg} goal={goal} />
            <Insights sorted={sorted} reg={reg} goal={goal} />

            <div style={{ marginTop:56 }}>
              <button onClick={()=>setCompose(true)} style={{ background:T.ink, color:T.paper, border:0, cursor:'pointer', padding:'16px 36px', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase' }}>
                Compose new reading →
              </button>
            </div>
          </div>
        )}

        {/* ── HEALTH ───────────────────────────────── */}
        {tab==='Health' && <HealthTab sorted={sorted} goal={goal} reg={reg} />}

        {/* ── PLAN ─────────────────────────────────── */}
        {tab==='Plan' && <PlanTab sorted={sorted} goal={goal} state={state} setTab={setTab} />}

        {/* ── PROJECTIONS ──────────────────────────── */}
        {tab==='Projections' && reg && (
          <div>
            <Kicker style={{ marginBottom:10 }}>Section IV · Projections</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:'0 0 32px', maxWidth:'18ch' }}>
              At the current rate, here is where the line <em>leads</em>.
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:36, alignItems:'baseline', padding:'28px 0', borderTop:`2px solid ${T.ink}`, borderBottom:`2px solid ${T.ink}`, marginBottom:48 }}>
              <span style={{ fontFamily:T.display, fontWeight:400, fontSize:96, color: slopePerWeek>=0 ? T.rose : T.green, letterSpacing:'-0.03em', lineHeight:0.9 }}>
                {slopePerWeek>=0?'+':''}{slopePerWeek.toFixed(2)}
                <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:32, opacity:0.7 }}> kg/wk</span>
              </span>
              <div>
                <Kicker color={slopePerWeek>=0?T.rose:T.green} style={{ marginBottom:8 }}>Current Trend Rate</Kicker>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:20, color:T.ink, lineHeight:1.4, marginBottom:4 }}>
                  {slopePerWeek>=0 ? 'gaining' : 'losing'} weight at a steady pace.
                </div>
                <div style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300 }}>
                  Confidence — high. Linear fit explains <strong style={{ color:T.ink }}>{Math.round(reg.r2*100)}%</strong> of variance across {sorted.length} readings.
                </div>
              </div>
            </div>

            <Kicker style={{ marginBottom:14 }}>Horizons · Naïve Linear Extrapolation</Kicker>
            {slopePerWeek > 0 && (
              <div style={{ background:T.roseSoft, border:`0.5px solid ${T.rose}`, padding:'14px 18px', marginBottom:18 }}>
                <p style={{ fontFamily:T.sans, fontSize:13, color:T.rose, fontWeight:500, margin:0, letterSpacing:'0.02em' }}>
                  ⚠ You are currently gaining weight. These projections show where the trend leads if nothing changes.
                </p>
              </div>
            )}
            <div style={{ borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'10px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
                <Kicker>Horizon</Kicker><Kicker style={{ textAlign:'right' }}>Projected weight</Kicker><Kicker style={{ textAlign:'right' }}>Δ from today</Kicker>
              </div>
              {projections.map((p,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'22px 0', borderBottom: i<projections.length-1 ? `0.5px solid ${T.softLine}` : 'none', alignItems:'baseline' }}>
                  <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.ink }}>{p.label}</div>
                  <div style={{ fontFamily:T.display, fontSize:30, color:T.ink, textAlign:'right', letterSpacing:'-0.01em' }}>
                    {p.kg.toFixed(1)} <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:500, padding:'4px 10px', background: p.delta>=0?T.roseSoft:T.greenSoft, color: p.delta>=0?T.rose:T.green, letterSpacing:'0.2em', textTransform:'uppercase' }}>
                      {p.delta>=0?'↑':'↓'} {Math.abs(p.delta).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Kicker style={{ marginTop:56, marginBottom:14 }}>Required Pace · To Close the Gap</Kicker>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:56 }}>
              {[
                { label:'To hit goal in 6 months', value:-reqRate6m, unit:'kg / week', accent:T.gold },
                { label:'To hit goal in 1 year',   value:-reqRate1y, unit:'kg / week', accent:T.gold },
                { label:'Distance from goal',       value:remaining,  unit:'kilograms', accent:T.rose },
              ].map((m,i) => (
                <div key={i} style={{ padding:'26px 26px', borderRight: i<2?`0.5px solid ${T.line}`:'none' }}>
                  <Kicker style={{ marginBottom:12 }}>{m.label}</Kicker>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontFamily:T.display, fontSize:40, color:m.accent, letterSpacing:'-0.02em', lineHeight:1 }}>
                      {(m.value>=0?'+':'')+m.value.toFixed(2)}
                    </span>
                  </div>
                  <Kicker color={T.muted} style={{ marginTop:6 }}>{m.unit}</Kicker>
                </div>
              ))}
            </div>

            <Kicker style={{ marginBottom:10 }}>Section V · The Line</Kicker>
            <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:32, letterSpacing:'-0.015em', lineHeight:1.05, color:T.ink, margin:'0 0 6px' }}>Observed &amp; <em>projected</em>.</h3>
            <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.muted, lineHeight:1.6, maxWidth:'60ch', margin:0 }}>
              solid hairline for observed weigh-ins, dashed gold for the goal line, dashed blue extending the linear regression ninety days forward.
            </p>
            <TrendChart sorted={sorted} reg={reg} goal={goal} />

            <Milestones sorted={sorted} reg={reg} goal={goal} />
            <CutStrategies sorted={sorted} goal={goal} />
            <Phases sorted={sorted} goal={goal} reg={reg} />
          </div>
        )}

        {/* ── CHARTS ───────────────────────────────── */}
        {tab==='Charts' && (
          <div>
            <Kicker style={{ marginBottom:10 }}>Section VI · The Visual Ledger</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:'0 0 36px' }}>All charts, <em>in order</em>.</h2>
            <Kicker style={{ marginBottom:8 }}>Weight · {sorted.length} readings · with 90-day projection</Kicker>
            <ThickRule />
            <TrendChart sorted={sorted} reg={reg} goal={goal} />
            <div style={{ marginTop:72 }}>
              <Kicker style={{ marginBottom:8 }}>Body Composition · The Slow Movers</Kicker>
              <CompositionChart sorted={sorted} />
            </div>
            <div style={{ marginTop:72 }}>
              <Kicker style={{ marginBottom:8 }}>BMI · {sorted.length} readings · with zone bands</Kicker>
              <ThickRule />
              <BMIChart sorted={sorted} />
            </div>
          </div>
        )}

        {/* ── LEDGER ───────────────────────────────── */}
        {tab==='Ledger' && (
          <div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:18, marginBottom:28 }}>
              <div>
                <Kicker style={{ marginBottom:10 }}>Section VII · The Ledger</Kicker>
                <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:0 }}>Every <em>weigh-in</em>, in order.</h2>
              </div>
              <button onClick={()=>setCompose(true)} style={{ background:T.ink, color:T.paper, border:0, cursor:'pointer', padding:'14px 30px', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase' }}>
                Compose new →
              </button>
            </div>
            <ThickRule />
            <div style={{ display:'grid', gridTemplateColumns:'1.6fr repeat(6,1fr) 0.5fr', padding:'10px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
              {['Date','Weight','BMI','Body Fat','Water','Muscle','Bone',''].map((h,i) => (
                <Kicker key={i} style={{ textAlign: i>0?'right':'left' }}>{h}</Kicker>
              ))}
            </div>
            {[...sorted].reverse().map((r,i) => (
              <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1.6fr repeat(6,1fr) 0.5fr', padding:'18px 0', borderBottom:`0.5px solid ${T.softLine}`, alignItems:'baseline' }}>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.ink }}>{fmtDate(r.date)}</div>
                {[
                  r.weight.toFixed(1)+'kg', r.bmi.toFixed(1), r.bodyFat.toFixed(1)+'%',
                  r.water.toFixed(1)+'%', r.muscleMass.toFixed(1)+'%', r.boneMass.toFixed(2)+'%',
                ].map((v,j)=>(
                  <div key={j} style={{ fontFamily:T.sans, fontSize:14, color:T.body, textAlign:'right' }}>{v}</div>
                ))}
                <div style={{ textAlign:'right' }}>
                  {!r.id.startsWith('s') && (
                    <button onClick={()=>handleDelete(r.id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:9, letterSpacing:'0.16em', color:T.muted, textTransform:'uppercase' }}>del</button>
                  )}
                </div>
              </div>
            ))}

            <ImportNote setTab={setTab} />
          </div>
        )}

      </Wrap>

      <Compose open={compose} onClose={()=>setCompose(false)} onSubmit={handleAdd} />
    </div>
  );
}
