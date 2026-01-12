import { getAllPatients } from "@/lib/actions/admin.actions";
import { PatientCard } from "@/components/admin/patient-card";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function PatientsPage() {
    const patients = await getAllPatients();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Manage Patients</h1>
                <p className="text-muted-foreground">
                    View and manage all registered patients on the platform.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">{patients.length} Total Patients</span>
                </div>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search patients..."
                        className="pl-10"
                        disabled
                    />
                </div>
            </div>

            {patients.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
                    <Users className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
                    <p className="text-muted-foreground">
                        There are no patients registered on the platform yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {patients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))}
                </div>
            )}
        </div>
    );
}
