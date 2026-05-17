/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222, 47%, 4%)",
        foreground: "hsl(210, 40%, 98%)",
        primary: {
          DEFAULT: "hsl(217, 91%, 60%)",
          glow: "rgba(59, 130, 246, 0.15)",
        },
        success: {
          DEFAULT: "hsl(142, 71%, 45%)",
          glow: "rgba(16, 185, 129, 0.12)",
        },
        warning: {
          DEFAULT: "hsl(38, 92%, 50%)",
          glow: "rgba(245, 158, 11, 0.12)",
        },
        danger: {
          DEFAULT: "hsl(0, 84%, 60%)",
          glow: "rgba(239, 68, 68, 0.12)",
        },
        secondary: "hsl(215, 25%, 27%)",
        muted: "hsl(215, 15%, 45%)",
      },
      borderRadius: {
        lg: "16px",
        md: "10px",
        sm: "6px",
      },
    },
  },
  plugins: [],
}
