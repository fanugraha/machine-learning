/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Kelas yang dibentuk dinamis di <Banner> ('banner-' + type) dan <Button> ('btn-' + variant/size).
  safelist: [
    'banner-error',
    'banner-warning',
    'banner-success',
    'btn-primary',
    'btn-secondary',
    'btn-ghost',
    'btn-lg',
    'btn-md',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Warna brand Qiscus Design System (PRD v2.0: brand #1A7F6F). Gradien logo tetap teal → hijau.
        brand: {
          50: '#E8F4F1',
          100: '#CBE7E0',
          200: '#9DD1C4',
          500: '#24998A',
          600: '#1A7F6F',
          700: '#14665A',
        },
        ink: {
          primary: '#101828',
          secondary: '#475467',
          tertiary: '#667085',
        },
        line: {
          primary: '#E4E7EC',
          secondary: '#D0D5DD',
        },
        surface: {
          secondary: '#F5F7F9',
        },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheetUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out both',
        'sheet-up': 'sheetUp 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
