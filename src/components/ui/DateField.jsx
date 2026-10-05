import { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { isoToDob, maskDob, parseDob, toIsoDate } from '../../utils/date.js';
import { Field } from './Field.jsx';

const TODAY = toIsoDate(new Date());

// Field tanggal "DD / MM / YYYY": bisa diketik, atau dipilih lewat kalender bawaan browser
// dengan menekan ikon kalender.
export function DateField({ value, onChange, min = '1900-01-01', max = TODAY, ...props }) {
  const pickerRef = useRef(null);
  const parsed = parseDob(value);

  const openPicker = () => {
    const picker = pickerRef.current;
    try {
      picker.showPicker();
    } catch {
      // Browser lama tanpa showPicker(): fokus + klik input tanggal.
      picker.focus();
      picker.click();
    }
  };

  return (
    <Field
      inputMode="numeric"
      placeholder="DD / MM / YYYY"
      maxLength={14}
      value={value}
      onChange={(e) => onChange(maskDob(e.target.value))}
      trailing={
        <span className="relative flex">
          <button
            type="button"
            className="hover:text-ink-primary"
            aria-label="Pilih tanggal dari kalender"
            onClick={openPicker}
          >
            <Calendar className="h-5 w-5" />
          </button>
          {/* Input tanggal tersembunyi; hanya dipakai untuk menampilkan kalender. */}
          <input
            ref={pickerRef}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none !absolute bottom-0 right-0 !h-px !w-px opacity-0"
            min={min}
            max={max}
            value={parsed ? toIsoDate(parsed) : ''}
            onChange={(e) => e.target.value && onChange(isoToDob(e.target.value))}
          />
        </span>
      }
      {...props}
    />
  );
}
