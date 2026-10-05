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
        // Warna brand EDITH (teal → hijau dari logo).
        brand: {
          50: '#EBF8F9',
          100: '#CFEFF1',
          200: '#A3E0E4',
          500: '#20AEB8',
          600: '#118690',
          700: '#0D6E76',
          lime: '#91C964',
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
