"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createDepartment, updateDepartment, deleteDepartment } from "@/lib/actions/department.actions";
import { useRouter } from "next/navigation";

type Department = {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
};

interface DepartmentsTabProps {
    hospitalId: string;
    departments: Department[];
}

export function DepartmentsTab({ hospitalId, departments }: DepartmentsTabProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            let result;
            if (editingDept) {
                result = await updateDepartment(editingDept.id, { name, description });
            } else {
                result = await createDepartment({ hospitalId, name, description });
            }

            if (result.success) {
                toast({ title: "Success", description: result.message });
                setIsOpen(false);
                setName("");
                setDescription("");
                setEditingDept(null);
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

    const handleEdit = (dept: Department) => {
        setEditingDept(dept);
        setName(dept.name);
        setDescription(dept.description || "");
        setIsOpen(true);
    };

    const handleDelete = async (deptId: string) => {
        if (!confirm("Are you sure you want to delete this department?")) return;

        const result = await deleteDepartment(deptId);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setEditingDept(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Departments ({departments.length})</h2>
                <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingDept ? "Edit Department" : "Add New Department"}</DialogTitle>
                            <DialogDescription>
                                {editingDept ? "Update department details" : "Create a new department in your hospital"}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Cardiology"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of the department"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Saving..." : editingDept ? "Update Department" : "Create Department"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {departments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No departments yet. Add your first department.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departments.map((dept) => (
                        <Card key={dept.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg">{dept.name}</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {dept.description || "No description"}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
