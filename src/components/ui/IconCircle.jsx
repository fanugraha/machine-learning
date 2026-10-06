import { cx } from '../../utils/cx.js';

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  warning: 'bg-amber-50 text-amber-700',
  info: 'bg-sky-50 text-sky-700',
  success: 'bg-green-50 text-green-700',
};

// Ikon besar dalam lingkaran, dipakai di layar status (cek email, link kedaluwarsa, dst.).
export function IconCircle({ icon: Icon, tone = 'brand', size = 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  const glyph = size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div className={cx('flex shrink-0 items-center justify-center rounded-full', box, TONES[tone])}>
      <Icon className={glyph} />
    </div>
  );
}
