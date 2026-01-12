"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RegisterForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Hospital</CardTitle>
        <CardDescription>Create an account for your medical institution.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="hospital-name">Hospital Name</Label>
            <Input id="hospital-name" placeholder="Green Valley General" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@greenvalley.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Maple Creek, USA" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="services">Services (comma-separated)</Label>
            <Input id="services" placeholder="Emergency, Cardiology, Orthopedics" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="operating-hours">Operating Hours</Label>
            <Input id="operating-hours" placeholder="24/7" required />
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
