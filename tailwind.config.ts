import type { Config } from "tailwindcss"

export default { 
  // ⚡️ MOST RELIABLE PATH FOR VITE/REACT PROJECTS ⚡️
  content: [
    "./index.html", 
    // এটা src ফোল্ডারের ভেতরে সব .tsx, .jsx ফাইল খুঁজে নেবে
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
    extend: {
      colors: {
        // ⚡️ CSS ভেরিয়েবল রেফারেন্স করা হচ্ছে ⚡️
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-foreground': 'var(--color-primary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',
        card: 'var(--color-card)',
      },
    },},
  plugins: [],
} satisfies Config
