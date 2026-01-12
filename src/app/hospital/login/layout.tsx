
import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function HospitalLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-semibold text-primary">
                        <HeartPulse className="h-8 w-8" />
                        <span>MediConnect Pro</span>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}
