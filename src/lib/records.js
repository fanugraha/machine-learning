import { useSyncExternalStore } from 'react';
import { SAMPLE_NOTES, SAMPLE_PROFILE_ITEMS, SAMPLE_SUMMARIES } from './sample-data.js';

// Catatan kesehatan, ringkasan dokter, dan isi Profil kesehatan.
// BELUM tersimpan di database (tabelnya menyusul di Fase 2): data hidup di memori selama tab terbuka.
// Data contoh hanya muncul saat dev dengan ?demo di URL; selain itu semuanya kosong.

const DEMO_KEY = 'edith.demo';

function isDemo() {
  if (!import.meta.env.DEV) return false;
  try {
    if (new URLSearchParams(window.location.search).has('demo')) sessionStorage.setItem(DEMO_KEY, '1');
    return sessionStorage.getItem(DEMO_KEY) === '1';
  } catch {
    return false;
  }
}

const EMPTY_PROFILE_ITEMS = { allergy: [], meds: [], history: [], blood: [], contact: [] };

let state = null;
const listeners = new Set();

function current() {
  if (!state) {
    const demo = isDemo();
    state = {
      notes: demo ? SAMPLE_NOTES : [],
      summaries: demo ? SAMPLE_SUMMARIES : [],
      profileItems: demo ? SAMPLE_PROFILE_ITEMS : EMPTY_PROFILE_ITEMS,
    };
  }
  return state;
}

function update(patch) {
  state = { ...current(), ...patch };
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useRecords = () => useSyncExternalStore(subscribe, current);

export const deleteNote = (id) => update({ notes: current().notes.filter((n) => n.id !== id) });

export function addProfileItem(key, item) {
  const items = current().profileItems;
  update({ profileItems: { ...items, [key]: [...items[key], item] } });
}

export function removeProfileItem(key, index) {
  const items = current().profileItems;
  update({ profileItems: { ...items, [key]: items[key].filter((_, i) => i !== index) } });
}
