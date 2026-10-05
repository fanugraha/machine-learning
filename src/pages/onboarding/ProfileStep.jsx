import { StepCard } from '../../components/layout/StepLayout.jsx';
import { Banner } from '../../components/ui/Banner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { DateField } from '../../components/ui/DateField.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { Stepper } from '../../components/ui/Stepper.jsx';
import { cx } from '../../utils/cx.js';

const GENDERS = [
  { value: 'female', label: 'Perempuan' },
  { value: 'male', label: 'Laki-laki' },
];

// 1e / 2e: Profil dasar.
export function ProfileStep({ firstName, form, onChange, invalid, message, saving, onSubmit }) {
  const set =
    (key, transform = (v) => v) =>
    (e) =>
      onChange({ ...form, [key]: transform(e.target.value) });

  return (
    <StepCard
      as="form"
      onSubmit={onSubmit}
      width="lg:w-[560px]"
      bodyClassName="gap-6 p-5 lg:gap-7 lg:p-10"
      footerClassName="flex justify-end"
      footer={
        <Button type="submit" className="w-full lg:w-auto" loading={saving} loadingText="Menyimpan...">
          Lanjut
        </Button>
      }
    >
      <Stepper steps={['Profil dasar', 'Tujuan']} current={0} />
      <div className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight">
          {firstName ? `Hai ${firstName}, kenalan dulu, yuk` : 'Hai, kenalan dulu, yuk'}
        </h1>
        <p className="text-sm text-ink-secondary">Biar EDITH bisa kasih saran yang pas buat kamu.</p>
      </div>
      {message && (
        <Banner type="error" title={message.title}>
          {message.description}
        </Banner>
      )}

      <div className="flex flex-col gap-5">
        <Field
          id="nickname"
          label="Nama panggilan"
          autoComplete="nickname"
          placeholder="Mau dipanggil apa?"
          value={form.nickname}
          onChange={set('nickname')}
          invalid={invalid.nickname}
        />
        <DateField
          id="dob"
          label="Tanggal lahir"
          autoComplete="bday"
          value={form.dob}
          onChange={(dob) => onChange({ ...form, dob })}
          invalid={invalid.dob}
          hint="Minimal 18 tahun, ya."
        />
        <fieldset>
          <legend className="field-label">Jenis kelamin</legend>
          <div className="grid grid-cols-2 gap-3">
            {GENDERS.map((g) => (
              <label key={g.value} className={cx('radio-card', invalid.gender && 'border-red-500')}>
                <input
                  type="radio"
                  name="gender"
                  value={g.value}
                  checked={form.gender === g.value}
                  onChange={set('gender')}
                />
                {g.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <Field
            id="height"
            label="Tinggi badan"
            inputMode="numeric"
            placeholder="160"
            maxLength={3}
            unit="cm"
            value={form.height}
            onChange={set('height')}
            invalid={invalid.height}
          />
          <Field
            id="weight"
            label="Berat badan"
            inputMode="decimal"
            placeholder="55"
            maxLength={5}
            unit="kg"
            value={form.weight}
            onChange={set('weight')}
            invalid={invalid.weight}
          />
        </div>
      </div>
    </StepCard>
  );
}
