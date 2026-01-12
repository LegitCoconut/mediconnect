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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function HospitalLoginForm() {
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
      const result = await signIn("hospital-login", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // Parse the error message to show specific messages
        if (result.error.includes("No hospital found") || result.error.includes("email")) {
          toast({
            variant: "destructive",
            title: "Email not found",
            description: "No hospital account exists with this email address.",
          });
        } else if (result.error.includes("password") || result.error.includes("Invalid password")) {
          toast({
            variant: "destructive",
            title: "Password incorrect",
            description: "The password you entered is incorrect.",
          });
        } else if (result.error.includes("suspended")) {
          toast({
            variant: "destructive",
            title: "Account suspended",
            description: "This hospital account has been suspended.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: result.error,
          });
        }
      } else if (result?.ok) {
        router.push("/hospital/dashboard");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Login</CardTitle>
        <CardDescription>Login to manage your institution's profile and staff.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abd@gmail.com" {...field} />
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
                    <Input type="password" placeholder="abcd" {...field} />
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
        <div className="mt-4 text-center text-sm">
          Not a hospital?{' '}
          <Link href="/" className="underline">
            Go back
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
