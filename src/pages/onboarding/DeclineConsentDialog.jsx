import { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { IconCircle } from '../../components/ui/IconCircle.jsx';

// 1j / 2h: modal di desktop, bottom sheet di mobile.
export function DeclineConsentDialog({ onReview, onLater }) {
  const reviewRef = useRef(null);

  useEffect(() => {
    reviewRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onReview();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onReview]);

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-slate-900/55 lg:items-center"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="decline-title"
      onClick={(e) => e.target === e.currentTarget && onReview()}
    >
      <div className="flex w-full animate-sheet-up flex-col gap-4 rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-xl lg:w-[440px] lg:animate-fade-up lg:rounded-xl lg:p-6">
        <div className="h-1 w-10 self-center rounded-full bg-line-primary lg:hidden" />
        <IconCircle icon={Shield} tone="warning" size="md" />
        <div className="space-y-1">
          <h2 id="decline-title" className="text-base font-semibold">
            Tanpa izin ini, EDITH belum bisa bantu
          </h2>
          <p className="text-sm text-ink-secondary">
            Tenang, akunmu tetap aman. Kalau berubah pikiran, kamu bisa setuju kapan aja, kok.
          </p>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row-reverse lg:justify-start">
          <Button ref={reviewRef} className="w-full lg:btn-md lg:w-auto" onClick={onReview}>
            Lihat lagi
          </Button>
          <Button variant="ghost" className="w-full lg:btn-md lg:w-auto" onClick={onLater}>
            Nanti aja
          </Button>
        </div>
      </div>
    </div>
  );
}
