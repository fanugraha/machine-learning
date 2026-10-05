import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cx } from '../../utils/cx.js';

// Input berlabel. `trailing` untuk ikon/tombol di kanan, `unit` untuk satuan (cm, kg).
export function Field({ id, label, hint, invalid, trailing, unit, className, ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className={cx('field-input', invalid && 'is-error')}>
        <input id={id} aria-invalid={invalid || undefined} {...inputProps} />
        {unit && <span className="field-unit">{unit}</span>}
        {trailing && <span className="field-trailing">{trailing}</span>}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

export function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? Eye : EyeOff;
  return (
    <Field
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className="hover:text-ink-primary"
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon className="h-5 w-5" />
        </button>
      }
      {...props}
    />
  );
}
