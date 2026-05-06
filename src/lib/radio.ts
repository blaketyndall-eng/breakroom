/**
 * Radio 1:47 — PR 59
 *
 * Radio entry model, user request handling,
 * and feed assembly from seeded + user + agent sources.
 */

import { SEEDED_RADIO_ENTRIES } from '@/content/data/radio';
import type { RadioEntry, RadioEntryType } from '@/content/data/radio';

export type { RadioEntry, RadioEntryType } from '@/content/data/radio';

// --- Storage ---

const STORAGE_KEY = 'breakroom.radio.entries.v1';
const REQUESTS_KEY = 'breakroom.radio.requests.v1';

export type RadioRequest = {
  id: string;
  message: string;
  handle?: string;
  timestamp: number;
  status: 'pending' | 'aired' | 'rejected' | 'lost';
};

function loadUserEntries(): RadioEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserEntries(entries: RadioEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 100)));
}

function loadRequests(): RadioRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRequests(requests: RadioRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests.slice(0, 50)));
}

// --- Feed assembly ---

export function getAllRadioEntries(): RadioEntry[] {
  const user = loadUserEntries();
  const all = [...SEEDED_RADIO_ENTRIES, ...user];
  all.sort((a, b) => b.timestamp - a.timestamp);
  return all;
}

export function getRadioFeed(limit = 20): RadioEntry[] {
  return getAllRadioEntries().slice(0, limit);
}

export function getRadioEntriesByType(type: RadioEntryType, limit = 10): RadioEntry[] {
  return getAllRadioEntries().filter((e) => e.type === type).slice(0, limit);
}

export function getNowPlaying(): RadioEntry | null {
  const entries = getAllRadioEntries();
  // "Now playing" is the most recent entry
  return entries[0] || null;
}

// --- User requests ---

export function submitRadioRequest(message: string, handle?: string): RadioRequest {
  const request: RadioRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    message,
    handle: handle || 'Anonymous Regular',
    timestamp: Date.now(),
    status: 'pending',
  };

  const requests = loadRequests();
  requests.unshift(request);
  saveRequests(requests);

  // Randomly "air" the request as a shoutout (30% chance, immediate for the demo)
  if (Math.random() < 0.3) {
    const entry: RadioEntry = {
      id: `radio-user-${request.id}`,
      slug: `request-${request.id}`,
      type: 'shoutout',
      title: `Request from ${request.handle}`,
      body: request.message,
      host: 'Phone Behind The Bar',
      timestamp: Date.now(),
      tags: ['user-request', 'shoutout'],
      source: 'user',
    };

    const userEntries = loadUserEntries();
    userEntries.unshift(entry);
    saveUserEntries(userEntries);

    // Update request status
    request.status = 'aired';
    const updatedRequests = loadRequests();
    const idx = updatedRequests.findIndex((r) => r.id === request.id);
    if (idx >= 0) updatedRequests[idx] = request;
    saveRequests(updatedRequests);
  }

  return request;
}

export function getRadioRequests(): RadioRequest[] {
  return loadRequests();
}

// --- Now Playing logic ---

export function getRadioStatus(): {
  nowPlaying: RadioEntry | null;
  signalStrength: string;
  deadAir: boolean;
  nextUp: string;
} {
  const now = getNowPlaying();
  const deadAir = now?.type === 'dead_air';

  const signals = ['cigarette-yellow', 'bar-neon', 'parking-lot-amber', 'motel-vacancy', 'static-grey'];
  const signalStrength = signals[Math.floor(Date.now() / 60000) % signals.length];

  const nextShows = ['Lot Weather', 'Phone Behind The Bar', 'OmniShift Compliance Hour', 'Back Booth Mix', 'Dead Air (approved)'];
  const nextUp = nextShows[Math.floor(Date.now() / 120000) % nextShows.length];

  return { nowPlaying: now, signalStrength, deadAir, nextUp };
}

// --- Entry type labels ---

export const RADIO_TYPE_LABELS: Record<RadioEntryType, string> = {
  transmission: 'Transmission',
  weather_report: 'Lot Weather',
  station_id: 'Station ID',
  fake_ad: 'Sponsored',
  agent_call_in: 'Call-In',
  user_request: 'Request',
  dead_air: 'Dead Air',
  faction_beef: 'Faction Report',
  shoutout: 'Shoutout',
};
