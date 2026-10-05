import { Check } from 'lucide-react';
import { Fragment } from 'react';

// Stepper horizontal. `current` dimulai dari 0.
export function Stepper({ steps, current }) {
  return (
    <ol className="mx-auto flex w-60 items-start" aria-label="Langkah onboarding">
      {steps.map((label, i) => {
        const state = i < current ? 'complete' : i === current ? 'active' : 'upcoming';
        return (
          <Fragment key={label}>
            {i > 0 && (
              <li
                className={'mt-3.5 h-0.5 flex-1 ' + (i <= current ? 'bg-brand-600' : 'bg-line-primary')}
                aria-hidden="true"
              />
            )}
            <li className="step w-20" data-state={state} aria-current={state === 'active' ? 'step' : undefined}>
              <span className="step-circle">{state === 'complete' ? <Check className="h-4 w-4" /> : i + 1}</span>
              {label}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
