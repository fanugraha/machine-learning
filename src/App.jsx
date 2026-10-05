import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router';
import { PATHS } from './routes/paths.js';

// Tiap halaman dimuat terpisah (code splitting) agar halaman pertama cepat terbuka.
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage.jsx'));
const ConsentPage = lazy(() => import('./pages/onboarding/ConsentPage.jsx'));
const OnboardingPage = lazy(() => import('./pages/onboarding/OnboardingPage.jsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage.jsx'));

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
          <Route path={PATHS.dashboard} element={<DashboardPage />} />

          {/* Redirect URL Supabase: dirender langsung (bukan dialihkan) supaya token di URL
              sempat diproses Supabase. Halaman lalu merapikan URL-nya sendiri. */}
          <Route path="/dashboard.html" element={<DashboardPage />} />
          <Route path="/reset-password.html" element={<ResetPasswordPage />} />

          <Route path="/index.html" element={<LegacyRedirect to={PATHS.login} />} />
          <Route path="/register.html" element={<LegacyRedirect to={PATHS.register} />} />
          <Route path="/verify-email.html" element={<LegacyRedirect to={PATHS.verifyEmail} />} />
          <Route path="/forgot-password.html" element={<LegacyRedirect to={PATHS.forgotPassword} />} />
          <Route path="/consent.html" element={<LegacyRedirect to={PATHS.consent} />} />
          <Route path="/onboarding.html" element={<LegacyRedirect to={PATHS.onboarding} />} />

          <Route path="*" element={<Navigate to={PATHS.login} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
