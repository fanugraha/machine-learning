import { ArrowLeft, Check } from 'lucide-react';
import { StepCard } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Stepper } from '../../components/ui/Stepper.jsx';
import { GOALS } from './profile.js';

// 1f / 2f: Tujuan kesehatan (minimal 1).
export function GoalsStep({ selected, onToggle, onBack, onFinish, saving, error }) {
  return (
    <StepCard
      width="lg:w-[560px]"
      bodyClassName="gap-6 p-5 lg:gap-7 lg:p-10"
      footerClassName="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between"
      footer={
        <>
          <span className="text-center text-xs text-ink-tertiary lg:text-sm" aria-live="polite">
            {selected.length ? `${selected.length} tujuan dipilih` : 'Pilih minimal 1, ya'}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="w-11 shrink-0 !px-0 lg:w-auto lg:!px-5"
              aria-label="Kembali"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5 lg:h-[18px] lg:w-[18px]" />
              <span className="hidden lg:inline">Kembali</span>
            </Button>
            <Button
              className="flex-1 lg:flex-none"
              disabled={selected.length === 0}
              loading={saving}
              loadingText="Menyimpan..."
              onClick={onFinish}
            >
              Yuk, mulai ngobrol
            </Button>
          </div>
        </>
      }
    >
      <Stepper steps={['Profil dasar', 'Tujuan']} current={1} />
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight">Apa yang mau kamu capai?</h1>
        <p className="text-sm text-ink-secondary">Pilih satu atau lebih, bisa diubah nanti.</p>
      </div>
      <div className="flex flex-wrap gap-2 lg:gap-2.5">
        {GOALS.map((goal) => {
          const on = selected.includes(goal);
          return (
            <button
              key={goal}
              type="button"
              className="chip px-3.5 py-2.5 lg:px-4 lg:py-2"
              aria-pressed={on}
              onClick={() => onToggle(goal)}
            >
              {on && <Check className="h-4 w-4" />}
              {goal}
            </button>
          );
        })}
      </div>
      {error && <Banner type="error" title={error} />}
    </StepCard>
  );
}
