// src/fonts/index.ts
import localFont from "next/font/local";

export const wantedSans = localFont({
  src: "./WantedSansVariable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--wanted-sans-variable",
  display: "swap",
});
