import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentsTab } from "@/components/hospital/departments-tab";
import { DoctorsTab } from "@/components/hospital/doctors-tab";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getDepartmentsByHospital } from "@/lib/actions/department.actions";
import { getDoctorsByHospital } from "@/lib/actions/doctor.actions";

export default async function HospitalDoctorsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/hospital/login");
    }

    const hospitalId = session.user.id;
    const departments = await getDepartmentsByHospital(hospitalId);
    const doctors = await getDoctorsByHospital(hospitalId);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Staff Management</h1>
                <p className="text-muted-foreground">Manage departments and doctors in your hospital.</p>
            </div>

            <Tabs defaultValue="departments" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="doctors">Doctors</TabsTrigger>
                </TabsList>

                <TabsContent value="departments" className="mt-6">
                    <DepartmentsTab hospitalId={hospitalId} departments={departments} />
                </TabsContent>

                <TabsContent value="doctors" className="mt-6">
                    <DoctorsTab hospitalId={hospitalId} doctors={doctors} departments={departments} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
