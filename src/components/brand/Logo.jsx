import { HeartPulse } from 'lucide-react';
import { cx } from '../../utils/cx.js';

const SIZES = {
  sm: { box: 'h-7 w-7', icon: 'h-4 w-4', text: 'text-base' },
  header: { box: 'h-7 w-7 lg:h-8 lg:w-8', icon: 'h-4 w-4 lg:h-[18px] lg:w-[18px]', text: 'text-base lg:text-lg' },
  lg: { box: 'h-9 w-9', icon: 'h-5 w-5', text: 'text-xl' },
};

export function LogoMark({ className, iconClassName }) {
  return (
    <span className={cx('logo-mark', className)}>
      <HeartPulse className={iconClassName} />
    </span>
  );
}

// Logo + tulisan EDITH. size: sm | header | lg
export function Logo({ size = 'sm', className }) {
  const s = SIZES[size];
  return (
    <span className={cx('flex items-center gap-2', size !== 'sm' && 'lg:gap-2.5', className)}>
      <LogoMark className={s.box} iconClassName={s.icon} />
      <span className={cx('font-bold tracking-wide text-ink-primary', s.text)}>EDITH</span>
    </span>
  );
}
