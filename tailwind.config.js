/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        "primary-soft": "var(--primary-soft)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        success: "var(--success)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        section: "var(--section)",
        subtitle: "var(--subtitle)",
        border: "var(--border)",
        inactive: "var(--inactive)",
        tabIndicator: "var(--tabIndicator)",
        danger: "var(--danger)",
        skeleton: "var(--skeleton)",
      },
      borderRadius: {
        card: "16px",
        image: "14px",
        pill: "9999px",
      },
      fontSize: {
        "3xs": ["11px", "16px"],
        "2xs": ["12px", "16px"],
        xs: ["13px", "18px"],
        sm: ["14px", "18px"],
        base: ["15px", "20px"],
        lg: ["16px", "22px"],
        xl: ["18px", "24px"],
        "2xl": ["20px", "26px"],
      },
    },
  },
};
