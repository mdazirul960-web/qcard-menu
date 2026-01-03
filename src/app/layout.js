import { Inter } from "next/font/google";
import "./globals.css";  // <--- THIS IS THE MAGIC LINE YOU ARE MISSING!

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QCard Menu",
  description: "Digital Menu for Cafes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}