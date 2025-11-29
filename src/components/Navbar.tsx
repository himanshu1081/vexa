"use client"
import { motion } from "motion/react"
import Link from "next/link";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "900"],
});

const instrumentFont = Instrument_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-instrument",
});


const Navbar: React.FC = () => {
    const pathname = usePathname()

    const linkColor = (href: string) => {
        return pathname.startsWith(href) ? "text-white" : "text-gray-400";
    }
    return (
        <>
            <div className={` ${instrumentFont.className} flex w-screen justify-center`}>

                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="h-fit bg-white/10 rounded-3xl w-3/4 mt-5 backdrop-blur-2xl shadow-xl border border-white/20"
                    id="navbar">
                    <div className="flex items-center justify-between sm:justify-around whitespace-nowrap font-chillax p-2 px-4 text-base scroll-smooth text-white">
                        <div>
                            <Link href="/" className={`${inter.className} whitespace-nowrap cursor-pointer font-bold text-base md:text-4xl`}>
                                Vexa
                            </Link>
                        </div>
                        <div className={`${instrumentFont.className} sm:flex hidden justify-between items-center gap-5 md:gap-10 text-xs md:text-base text-gray-300 `}>
                            <div>
                                <Link href="/pricing" className={`hover:text-white ${linkColor("/pricing")}`}>Pricing</Link>
                            </div>
                            <div>
                                <Link href="/about" className={`hover:text-white ${linkColor("/about")}`}>About us</Link>
                            </div>
                            <div>
                                <Link href="/contact" className={`hover:text-white ${linkColor("/contact")}`}>Contact</Link>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Link href='/login' className="md:px-4 md:py-3 bg-[#50056e] rounded-full text-xs px-2 py-1 md:text-sm border border-white/20 cursor-pointer hover:bg-[#7700a5] transition-all duration-75 ease-in">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default Navbar;