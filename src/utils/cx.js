// Gabungkan className, abaikan nilai falsy: cx('btn', active && 'is-active')
export const cx = (...classes) => classes.filter(Boolean).join(' ');
