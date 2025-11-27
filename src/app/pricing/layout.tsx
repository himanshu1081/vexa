// app/pricing/layout.tsx
import { Instrument_Sans } from "next/font/google";
import Navbar from "../../components/Navbar";

const instrumentFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`text-white bg-[#05000f] min-h-screen ${instrumentFont.variable}`}>
      <div className="absolute z-50">
        <Navbar />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}