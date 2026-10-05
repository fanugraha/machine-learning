import { Info } from 'lucide-react';
import { cx } from '../../utils/cx.js';

export function Disclaimer({ className }) {
  return (
    <p className={cx('flex items-start gap-2 text-xs text-ink-secondary', className)}>
      <Info className="h-4 w-4 shrink-0 text-ink-tertiary" />
      EDITH bukan pengganti dokter. Darurat? Hubungi 119.
    </p>
  );
}
