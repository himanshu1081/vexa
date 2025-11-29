"use client";

import ColorBends from "../components/ColorBends";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideBg = pathname == "/pricing" ? true : false;

    return (
        <>
            {!hideBg && (
                <div className="object-contain w-screen h-screen absolute z-0">
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
                        transparent
                    />
                </div>
            )}

            {children}
        </>
    );
}
