import { cx } from '../../utils/cx.js';

export function Checkbox({ children, className, inputClassName, ...props }) {
  return (
    <label className={cx('checkbox', className)}>
      <input type="checkbox" className={inputClassName} {...props} />
      {children}
    </label>
  );
}
