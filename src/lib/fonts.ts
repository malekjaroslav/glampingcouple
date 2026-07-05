import { Karla, Lora } from "next/font/google";

export const lora = Lora({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

export const karla = Karla({
  subsets: ["latin", "latin-ext"],
  variable: "--font-karla",
});
