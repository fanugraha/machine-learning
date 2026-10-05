import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// "Ingat aku": kalau aktif sesi disimpan di localStorage (bertahan setelah browser ditutup),
// kalau tidak di sessionStorage (hilang saat tab/browser ditutup).
const REMEMBER_KEY = 'edith.remember';
const rememberMe = () => localStorage.getItem(REMEMBER_KEY) !== '0';

const authStorage = {
  getItem: (key) => sessionStorage.getItem(key) ?? localStorage.getItem(key),
  setItem: (key, value) => {
    const [target, other] = rememberMe() ? [localStorage, sessionStorage] : [sessionStorage, localStorage];
    other.removeItem(key);
    target.setItem(key, value);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

export const setRememberMe = (on) => localStorage.setItem(REMEMBER_KEY, on ? '1' : '0');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: authStorage },
});
