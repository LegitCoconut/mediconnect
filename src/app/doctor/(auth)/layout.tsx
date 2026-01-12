
import Link from "next/link";
import Image from "next/image";
import { HeartPulse } from "lucide-react";

export default function DoctorAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-headline text-3xl font-bold text-primary">
            <Image src="/logo.png" alt="MediConnect" width={40} height={40} className="h-10 w-10 object-contain" />
            <span>MediConnect Pro</span>
          </Link>
          <p className="text-muted-foreground text-sm">Professional Healthcare Portal</p>
        </div>
        {children}
      </div>
    </div>
  );
}
