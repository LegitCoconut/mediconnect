
"use client";

import { useState } from 'react';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronsUpDown, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const specialties = ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Gynecology", "Dermatology", "Radiology"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AddDoctorPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [dateOfBirth, setDateOfBirth] = useState<Date>();
    const [timings, setTimings] = useState([{ day: '', startTime: '', endTime: '' }]);

    const handleAddTiming = () => {
        setTimings([...timings, { day: '', startTime: '', endTime: '' }]);
    };

    const handleRemoveTiming = (index: number) => {
        const newTimings = timings.filter((_, i) => i !== index);
        setTimings(newTimings);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., send data to an API
        toast({
            title: "Request Sent",
            description: "A request to add the new doctor has been sent to the admin for approval.",
        });
        router.push('/hospital/doctors');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Add New Doctor</h1>
                    <p className="text-muted-foreground">Fill in the details to add a new doctor to the roster.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild><Link href="/hospital/doctors">Cancel</Link></Button>
                    <Button type="submit">Send for Approval</Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Doctor Information</CardTitle>
                            <CardDescription>Provide the personal and professional details of the doctor.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" placeholder="Dr. John Doe" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="qualifications">Academic Qualifications</Label>
                                <Textarea id="qualifications" placeholder="M.D., Ph.D. in Neurology..." required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="specialty">Specialization</Label>
                                <Select required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Consultation Details</CardTitle>
                            <CardDescription>Set the doctor's schedule and patient capacity.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="maxPatients">Max Patients per Day</Label>
                                <Input id="maxPatients" type="number" placeholder="20" required />
                            </div>
                             <div>
                                <Label>Consultation Timings</Label>
                                <div className="space-y-2 mt-2">
                                {timings.map((timing, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                         <Select required>
                                            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                                            <SelectContent>{daysOfWeek.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <Input type="time" required />
                                        <Input type="time" required />
                                        <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveTiming(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                </div>
                                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddTiming}>Add Timing</Button>
                             </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Doctor Photo</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <Input id="picture" type="file" className="text-sm" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
