import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "BOTSTATE | Your AI Real Estate Agent, On-Chain",
  description: "Discover, analyze, and invest in tokenized properties worldwide with your AI real estate advisor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
