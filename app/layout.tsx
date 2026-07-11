import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CsvProvider } from "@/app/providers/CsvProvider";
import Header from "@/components/Header";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AI Powered CSV Importer",
  description: "CSV Importer which is intelligently map or extract CRM fields or structure data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider>
          <CsvProvider>
            <Header />
            {children}
          </CsvProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
