import "./globals.css";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import ClientLayout from "./ClientLayout";

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
      <body className={`text-white bg-[#05000f] z-50 ${instrumentFont.className}`}>
        <div className="fixed z-50 backdrop-blur-2xl">
          <Navbar />
        </div>
        <ClientLayout>
          <div className="absolute z-49">
            {children}
          </div>
        </ClientLayout>

      </body>
    </html>
  );
}
