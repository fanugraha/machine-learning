import { CircleCheck } from 'lucide-react';

// Notifikasi singkat. Mobile: di atas bar bawah. Desktop: pojok kanan atas.
export function Toast({ children }) {
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-24 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-3 text-sm text-white shadow-lg lg:inset-x-auto lg:bottom-auto lg:right-6 lg:top-6 lg:py-2.5"
    >
      <CircleCheck className="h-4 w-4 shrink-0" />
      {children}
    </div>
  );
}
