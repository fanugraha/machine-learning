// Keadaan kosong: ikon bulat, judul, deskripsi, dan satu aksi.
export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="h-8 w-8" />
      </span>
      <div className="space-y-1.5">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-ink-secondary">{children}</p>
      </div>
      {action}
    </div>
  );
}
