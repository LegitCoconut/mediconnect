"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const testAccounts = [
  { name: "Dr. Rajesh Kumar", email: "rajesh.kumar@cityhospital.com", specialty: "Cardiologist" },
  { name: "Dr. Priya Sharma", email: "priya.sharma@cityhospital.com", specialty: "Orthopedic" },
  { name: "Dr. Amit Patel", email: "amit.patel@cityhospital.com", specialty: "Neurologist" },
  { name: "Dr. Sneha Gupta", email: "sneha.gupta@cityhospital.com", specialty: "Pediatrician" },
  { name: "Dr. Vikram Singh", email: "vikram.singh@cityhospital.com", specialty: "General" },
];

export function DoctorLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await signIn("doctor-login", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("No doctor found") || result.error.includes("email")) {
          toast({
            variant: "destructive",
            title: "Email not found",
            description: "No doctor account exists with this email address.",
          });
        } else if (result.error.includes("password") || result.error.includes("Invalid password")) {
          toast({
            variant: "destructive",
            title: "Password incorrect",
            description: "The password you entered is incorrect.",
          });
        } else if (result.error.includes("deactivated")) {
          toast({
            variant: "destructive",
            title: "Account deactivated",
            description: "Your doctor account has been deactivated. Please contact the hospital.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: result.error,
          });
        }
      } else if (result?.ok) {
        router.push("/doctor/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function fillTestCredentials(email: string) {
    form.setValue("email", email);
    form.setValue("password", "doctor123");
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Doctor Login</CardTitle>
        <CardDescription>Access your schedule and patient information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="doctor@hospital.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <Separator />

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground text-center font-medium">Quick Login (Test Accounts)</p>
          <div className="grid grid-cols-1 gap-2">
            {testAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => fillTestCredentials(account.email)}
                className="flex items-center justify-between p-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors text-left text-sm"
              >
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">{account.specialty}</p>
                </div>
                <span className="text-xs text-primary">Use</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">All test accounts use password: <code className="bg-muted px-1 rounded">doctor123</code></p>
        </div>

        <div className="text-center text-sm">
          Not a doctor?{' '}
          <Link href="/" className="underline text-primary">
            Go back
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
