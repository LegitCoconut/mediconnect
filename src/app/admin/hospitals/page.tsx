import { getAllHospitals } from "@/lib/actions/admin.actions";
import { HospitalCard } from "@/components/admin/hospital-card";
import { Hospital, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function HospitalsPage() {
    const hospitals = await getAllHospitals();

    const verifiedCount = hospitals.filter((h) => h.isVerified).length;
    const pendingCount = hospitals.filter((h) => !h.isVerified).length;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Manage Hospitals</h1>
                <p className="text-muted-foreground">
                    View and manage all registered hospitals on the platform.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                        <Hospital className="h-5 w-5 text-primary" />
                        <span className="font-medium">{hospitals.length} Total</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-medium text-green-600">{verifiedCount} Verified</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-4 py-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="font-medium text-yellow-600">{pendingCount} Pending</span>
                    </div>
                </div>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search hospitals..."
                        className="pl-10"
                        disabled
                    />
                </div>
            </div>

            {hospitals.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
                    <Hospital className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No hospitals found</h3>
                    <p className="text-muted-foreground">
                        There are no hospitals registered on the platform yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {hospitals.map((hospital) => (
                        <HospitalCard key={hospital.id} hospital={hospital} />
                    ))}
                </div>
            )}
        </div>
    );
}
