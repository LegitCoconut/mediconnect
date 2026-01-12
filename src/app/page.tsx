
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <HeartPulse className="h-12 w-12 text-primary" />
        <h1 className="font-headline text-4xl font-bold">MediConnect Pro</h1>
        <p className="text-muted-foreground">Your professional platform for medical connectivity.</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Login As</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild size="lg">
            <Link href="/login">Admin</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/hospital/login">Hospital</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/doctor/login">Doctor</Link>
          </Button>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="underline">
          Register your institution
        </Link>
      </p>
    </div>
  );
}
