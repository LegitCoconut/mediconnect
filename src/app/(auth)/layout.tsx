import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-semibold text-primary">
            <Image src="/logo.png" alt="MediConnect" width={32} height={32} className="h-8 w-8 object-contain" />
            <span>MediConnect Pro</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
