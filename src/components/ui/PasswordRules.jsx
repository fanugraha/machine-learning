import { Circle, CircleCheck } from 'lucide-react';
import { passwordRules } from '../../utils/password.js';
import { cx } from '../../utils/cx.js';

const LABELS = { length: 'Minimal 8 karakter', mix: 'Berisi huruf dan angka' };

// Daftar syarat password yang tercentang saat terpenuhi.
export function PasswordRules({ value }) {
  const rules = passwordRules(value);
  return (
    <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {Object.entries(LABELS).map(([key, label]) => {
        const Icon = rules[key] ? CircleCheck : Circle;
        return (
          <li
            key={key}
            className={cx(
              'inline-flex items-center gap-1 whitespace-nowrap',
              rules[key] ? 'text-green-700' : 'text-ink-tertiary',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
