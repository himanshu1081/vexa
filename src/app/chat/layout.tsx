import "../../styles/background.css";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="gradient-background absolute z-0">
                <main className="relative z-10 min-h-screen">
                    {children}
                </main>
            </div>
        </>
    );
}
