"use client";
import "./globals.css";
import Navbar from "../components/Navbar";
import ColorBends from "../components/ColorBends";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "700" });

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
      <body className={`text-white bg-[#05000f] fixed z-50 min-h-screen ${instrumentFont.variable}`}>
        <div className="absolute z-50">
          <Navbar />
        </div>
        <div className="object-contain w-screen h-screen absolute z-0 ">
          <ColorBends
            colors={['#bd2bf3']}
            rotation={0}
            speed={0.3}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0.8}
            parallax={0.5}
            noise={0}
            transparent />
        </div>
        <div className="absolute z-49">
          {children}
        </div>
      </body>
    </html>
  );
}
