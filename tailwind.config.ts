import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // โทนหลัก: ม่วงเข้ม/เบอร์กันดี้ ตามดีไซน์ MEDMANWANN
        brand: {
          50: "#fbf0f4",
          100: "#f5dce6",
          200: "#e9b8cd",
          300: "#d885a6",
          400: "#c25080",
          500: "#9e2f63",
          600: "#7a1f4f",
          700: "#5c1840",
          800: "#481433",
          900: "#3a0f2a",
        },
        // โทนรองสีทอง/มัสตาร์ด ใช้กับปุ่มรอง/แถบราคา
        accent: {
          50: "#fdf8ec",
          100: "#faedc8",
          200: "#f3d98c",
          300: "#e9bd52",
          400: "#cf9a2e",
          500: "#a87a22",
          600: "#85601c",
        },
        // โทนพื้นหลังครีม/เบจ
        cream: {
          50: "#fffaf3",
          100: "#fdf3e7",
          200: "#f9e8d4",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-thai)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
