// Aturan password yang ditampilkan di layar Daftar & Reset.
export function passwordRules(value) {
  return {
    length: value.length >= 8,
    mix: /[A-Za-z]/.test(value) && /\d/.test(value),
  };
}

export const isValidPassword = (value) => Object.values(passwordRules(value)).every(Boolean);
