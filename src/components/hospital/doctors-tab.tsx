"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, UserPlus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createDoctor, updateDoctor, deleteDoctor, toggleDoctorStatus } from "@/lib/actions/doctor.actions";
import { useRouter } from "next/navigation";

type Department = {
    id: string;
    name: string;
};

type Doctor = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualifications: string[];
    experience: number;
    consultationFee: number;
    departmentId: { id: string; name: string } | string;
    isActive: boolean;
    schedule?: Record<string, { slots: string[]; isAvailable: boolean }>;
};

interface DoctorsTabProps {
    hospitalId: string;
    doctors: Doctor[];
    departments: Department[];
}

export function DoctorsTab({ hospitalId, doctors, departments }: DoctorsTabProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        qualifications: "",
        experience: 0,
        consultationFee: 0,
        departmentId: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password || !form.departmentId) {
            toast({ variant: "destructive", title: "Error", description: "Please fill all required fields" });
            return;
        }

        setIsLoading(true);
        try {
            const result = await createDoctor({
                hospitalId,
                departmentId: form.departmentId,
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
                specialization: form.specialization,
                qualifications: form.qualifications.split(",").map((q) => q.trim()).filter(Boolean),
                experience: form.experience,
                consultationFee: form.consultationFee,
            });

            if (result.success) {
                toast({ title: "Success", description: result.message });
                setIsOpen(false);
                resetForm();
                router.refresh();
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Something went wrong" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (doctorId: string) => {
        if (!confirm("Are you sure you want to remove this doctor?")) return;

        const result = await deleteDoctor(doctorId);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    const handleToggleStatus = async (doctorId: string) => {
        const result = await toggleDoctorStatus(doctorId);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            specialization: "",
            qualifications: "",
            experience: 0,
            consultationFee: 0,
            departmentId: "",
        });
    };

    const getDepartmentName = (doctor: Doctor) => {
        if (typeof doctor.departmentId === "object" && doctor.departmentId?.name) {
            return doctor.departmentId.name;
        }
        const dept = departments.find((d) => d.id === doctor.departmentId);
        return dept?.name || "Unassigned";
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Doctors ({doctors.length})</h2>
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Doctor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Doctor</DialogTitle>
                            <DialogDescription>
                                Create a login account for the doctor. They can login using email and password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Dr. John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="doctor@hospital.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="Login password"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department *</Label>
                                    <Select
                                        value={form.departmentId}
                                        onValueChange={(value) => setForm({ ...form, departmentId: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input
                                        id="specialization"
                                        value={form.specialization}
                                        onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                                        placeholder="e.g., Cardiologist"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="qualifications">Qualifications (comma separated)</Label>
                                <Input
                                    id="qualifications"
                                    value={form.qualifications}
                                    onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                                    placeholder="MBBS, MD, DM"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Experience (years)</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        value={form.experience}
                                        onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                                    <Input
                                        id="consultationFee"
                                        type="number"
                                        value={form.consultationFee}
                                        onChange={(e) => setForm({ ...form, consultationFee: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Doctor Account"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {departments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <p className="text-muted-foreground">Please create departments first before adding doctors.</p>
                    </CardContent>
                </Card>
            ) : doctors.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No doctors yet. Add your first doctor.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {doctors.map((doctor) => (
                        <Card key={doctor._id}>
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">Dr. {doctor.name}</CardTitle>
                                        <Badge variant={doctor.isActive ? "default" : "secondary"}>
                                            {doctor.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{doctor.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleStatus(doctor._id)}
                                    >
                                        {doctor.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(doctor._id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Department:</span>
                                        <p className="font-medium">{getDepartmentName(doctor)}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Specialization:</span>
                                        <p className="font-medium">{doctor.specialization || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Experience:</span>
                                        <p className="font-medium">{doctor.experience} years</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Fee:</span>
                                        <p className="font-medium">₹{doctor.consultationFee}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
