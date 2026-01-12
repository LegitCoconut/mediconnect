"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { updateAppointmentStatus, createPrescription, MedicineInput } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface AppointmentActionsProps {
    appointmentId: string;
    status: string;
}

export function AppointmentActions({ appointmentId, status }: AppointmentActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [medicines, setMedicines] = useState<MedicineInput[]>([
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
    const { toast } = useToast();
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: 'confirmed' | 'cancelled') => {
        const result = await updateAppointmentStatus(appointmentId, newStatus);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
    };

    const removeMedicine = (index: number) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((_, i) => i !== index));
        }
    };

    const updateMedicine = (index: number, field: keyof MedicineInput, value: string) => {
        const updated = [...medicines];
        updated[index] = { ...updated[index], [field]: value };
        setMedicines(updated);
    };

    const handleCreatePrescription = async () => {
        if (!diagnosis.trim()) {
            toast({ variant: "destructive", title: "Error", description: "Diagnosis is required" });
            return;
        }

        const validMedicines = medicines.filter(m => m.name && m.dosage && m.frequency && m.duration);
        if (validMedicines.length === 0) {
            toast({ variant: "destructive", title: "Error", description: "At least one medicine is required" });
            return;
        }

        setIsLoading(true);
        const result = await createPrescription(appointmentId, diagnosis, validMedicines, notes || undefined);
        setIsLoading(false);

        if (result.success) {
            toast({ title: "Success", description: result.message });
            setIsOpen(false);
            router.refresh();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    return (
        <div className="flex gap-2 pt-2 border-t">
            {status === 'pending' && (
                <>
                    <Button size="sm" onClick={() => handleStatusUpdate('confirmed')}>
                        Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate('cancelled')}>
                        Cancel
                    </Button>
                </>
            )}

            {status === 'confirmed' && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">Write Prescription</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Write Prescription</DialogTitle>
                            <DialogDescription>
                                Add diagnosis and medicines for this appointment
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis">Diagnosis *</Label>
                                <Input
                                    id="diagnosis"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="e.g., Upper respiratory infection"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Medicines</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addMedicine}>
                                        <Plus className="h-4 w-4 mr-1" /> Add Medicine
                                    </Button>
                                </div>

                                {medicines.map((med, idx) => (
                                    <div key={idx} className="p-3 border rounded-lg space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Medicine {idx + 1}</span>
                                            {medicines.length > 1 && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeMedicine(idx)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Medicine name *"
                                                value={med.name}
                                                onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Dosage * (e.g., 500mg)"
                                                value={med.dosage}
                                                onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Frequency * (e.g., Twice daily)"
                                                value={med.frequency}
                                                onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                                            />
                                            <Input
                                                placeholder="Duration * (e.g., 5 days)"
                                                value={med.duration}
                                                onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                                            />
                                        </div>
                                        <Input
                                            placeholder="Instructions (e.g., Take after meals)"
                                            value={med.instructions}
                                            onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional notes..."
                                />
                            </div>

                            <Button onClick={handleCreatePrescription} className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Prescription & Complete"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
