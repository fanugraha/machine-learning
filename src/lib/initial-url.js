// Hash URL saat aplikasi pertama dimuat, sebelum Supabase membersihkannya.
// Supabase menaruh error link email di sini, mis. #error=access_denied&error_code=otp_expired.
// Harus di-import paling awal di main.jsx.
const initialHash = new URLSearchParams(window.location.hash.slice(1));

export const initialHashError = initialHash.get('error_code') || initialHash.get('error');
export const isOtpExpired = initialHash.get('error_code') === 'otp_expired';
