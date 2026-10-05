import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react';
import { cx } from '../../utils/cx.js';

const ICONS = { error: CircleAlert, warning: TriangleAlert, success: CircleCheck };

// Pesan sorotan. type: error | warning | success. `icon` untuk mengganti ikon bawaan.
export function Banner({ type = 'error', title, children, icon, className, role }) {
  const Icon = icon || ICONS[type];
  return (
    <div className={cx('banner', `banner-${type}`, className)} role={role || (type === 'success' ? 'status' : 'alert')}>
      <Icon className="mt-px h-5 w-5 shrink-0" />
      <div>
        {title && <div className="banner-title">{title}</div>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
