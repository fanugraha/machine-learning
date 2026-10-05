import { Navigate, useLocation } from 'react-router';
import { isOtpExpired } from '../../lib/initial-url.js';
import { AUTH_REDIRECTS, PATHS } from '../../routes/paths.js';
import { useSignOut, useStepGuard } from '../../hooks/useAuthFlow.js';
import { Logo } from '../../components/brand/Logo.jsx';

// Data contoh — ganti dengan data asli saat fitur dashboard dikerjakan.
const STATS = [
  { label: 'Dataset', value: '12', note: '+2 minggu ini', positive: true },
  { label: 'Model dilatih', value: '28', note: '+5 minggu ini', positive: true },
  { label: 'Akurasi terbaik', value: '94,2%', note: 'Random Forest' },
  { label: 'Jam belajar', value: '36 jam', note: '+4 jam minggu ini', positive: true },
];

const EXPERIMENTS = [
  { model: 'Random Forest', dataset: 'Iris', accuracy: '94,2%', status: 'Selesai' },
  { model: 'Logistic Regression', dataset: 'Titanic', accuracy: '81,5%', status: 'Selesai' },
  { model: 'Neural Network', dataset: 'MNIST', accuracy: '—', status: 'Berjalan' },
  { model: 'K-Means', dataset: 'Mall Customers', accuracy: '—', status: 'Antre' },
];

const STATUS_STYLE = {
  Selesai: 'bg-green-100 text-green-700',
  Berjalan: 'bg-yellow-100 text-yellow-700',
  Antre: 'bg-gray-100 text-gray-600',
};

const COURSES = [
  { name: 'Dasar Python', progress: 100 },
  { name: 'Supervised Learning', progress: 70 },
  { name: 'Deep Learning', progress: 25 },
];

function Dashboard() {
  const user = useStepGuard(PATHS.dashboard);
  const signOut = useSignOut();
  if (!user) return null;

  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || user.email;
  const nickname = meta.edith_profile?.nickname || name.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <title>Dashboard · EDITH</title>
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            {meta.avatar_url && (
              <img src={meta.avatar_url} className="h-9 w-9 rounded-full" alt="" referrerPolicy="no-referrer" />
            )}
            <button
              type="button"
              onClick={signOut}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-bold">Halo, {nickname} 👋</h1>
          <p className="text-sm text-gray-500">Ini ringkasan progres belajar Anda (data contoh).</p>
        </div>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
              <p className={'text-xs ' + (s.positive ? 'text-green-600' : 'text-gray-400')}>{s.note}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
            <h2 className="mb-3 font-semibold">Eksperimen terbaru</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Model</th>
                    <th className="py-2 pr-4 font-medium">Dataset</th>
                    <th className="py-2 pr-4 font-medium">Akurasi</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {EXPERIMENTS.map((x) => (
                    <tr key={x.model}>
                      <td className="py-2 pr-4">{x.model}</td>
                      <td className="py-2 pr-4">{x.dataset}</td>
                      <td className="py-2 pr-4">{x.accuracy}</td>
                      <td className="py-2">
                        <span className={'rounded-full px-2 py-0.5 text-xs ' + STATUS_STYLE[x.status]}>{x.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Progres kursus</h2>
            <ul className="space-y-4 text-sm">
              {COURSES.map((c) => (
                <li key={c.name}>
                  <div className="mb-1 flex justify-between">
                    <span>{c.name}</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: c.progress + '%' }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { pathname } = useLocation();
  // Link verifikasi email yang kedaluwarsa juga kembali ke sini (lewat dashboard.html).
  if (isOtpExpired && pathname === AUTH_REDIRECTS.afterSignIn)
    return <Navigate to={PATHS.verifyEmail + '?expired=1'} replace />;
  return <Dashboard />;
}
