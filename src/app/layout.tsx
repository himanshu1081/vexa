import "./globals.css";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "700" });

export const metadata = {
  title: "Vexa"
}

const instrumentFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`relative text-white bg-[#05000f] ${instrumentFont.className}`}>
        <main className="relative z-10 min-h-screen ">
          {children}
        </main>

      </body>
    </html>
  );
}
