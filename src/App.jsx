import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router';
import { AUTH_REDIRECTS, PATHS } from './routes/paths.js';

// Tiap halaman dimuat terpisah (code splitting) agar halaman pertama cepat terbuka.
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage.jsx'));
const ConsentPage = lazy(() => import('./pages/onboarding/ConsentPage.jsx'));
const OnboardingPage = lazy(() => import('./pages/onboarding/OnboardingPage.jsx'));
const AuthCallbackPage = lazy(() => import('./pages/auth/AuthCallbackPage.jsx'));
const AccountLinkedPage = lazy(() => import('./pages/auth/AccountLinkedPage.jsx'));
const HomePage = lazy(() => import('./pages/home/HomePage.jsx'));
const NotesPage = lazy(() => import('./pages/notes/NotesPage.jsx'));
const NoteDetailPage = lazy(() => import('./pages/notes/NoteDetailPage.jsx'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage.jsx'));
const SummariesPage = lazy(() => import('./pages/summaries/SummariesPage.jsx'));
const SummaryDetailPage = lazy(() => import('./pages/summaries/SummaryDetailPage.jsx'));

// URL lama (*.html) dialihkan ke route baru dengan query yang sama.
function LegacyRedirect({ to }) {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path={PATHS.login} element={<LoginPage />} />
          <Route path={PATHS.register} element={<RegisterPage />} />
          <Route path={PATHS.verifyEmail} element={<VerifyEmailPage />} />
          <Route path={PATHS.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={PATHS.resetPassword} element={<ResetPasswordPage />} />
          <Route path={PATHS.consent} element={<ConsentPage />} />
          <Route path={PATHS.onboarding} element={<OnboardingPage />} />
          <Route path={PATHS.accountLinked} element={<AccountLinkedPage />} />
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.notes} element={<NotesPage />} />
          <Route path={PATHS.note(':id')} element={<NoteDetailPage />} />
          <Route path={PATHS.summaries} element={<SummariesPage />} />
          <Route path={PATHS.summary(':id')} element={<SummaryDetailPage />} />
          <Route path={PATHS.profile} element={<ProfilePage />} />

          {/* Redirect URL Supabase: dirender langsung (bukan dialihkan) supaya token di URL
              sempat diproses Supabase sebelum pindah halaman. */}
          <Route path={AUTH_REDIRECTS.afterSignIn} element={<AuthCallbackPage />} />
          <Route path={AUTH_REDIRECTS.passwordReset} element={<ResetPasswordPage />} />

          <Route path="/index.html" element={<LegacyRedirect to={PATHS.login} />} />
          <Route path="/register.html" element={<LegacyRedirect to={PATHS.register} />} />
          <Route path="/verify-email.html" element={<LegacyRedirect to={PATHS.verifyEmail} />} />
          <Route path="/forgot-password.html" element={<LegacyRedirect to={PATHS.forgotPassword} />} />
          <Route path="/consent.html" element={<LegacyRedirect to={PATHS.consent} />} />
          <Route path="/onboarding.html" element={<LegacyRedirect to={PATHS.onboarding} />} />
          <Route path="/dashboard" element={<LegacyRedirect to={PATHS.home} />} />

          <Route path="*" element={<Navigate to={PATHS.login} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
