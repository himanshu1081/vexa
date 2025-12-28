import ClientLayout from "../ClientLayout";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="fixed top-0 left-0 w-full z-50">
            </div>
                <ClientLayout />
            <main className="relative z-10 min-h-screen">
                {children}
            </main>
        </>
    );
}
