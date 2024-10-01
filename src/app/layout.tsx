import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ['cyrillic'],
  variable: "--font-roboto",
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "Project-x",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="ru">
      <body className={roboto.variable}>
      <div className="page">
        {children}
      </div>
      </body>
    </html>
  );
}
