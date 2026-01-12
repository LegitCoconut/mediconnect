import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAppointmentsByHospital } from "@/lib/actions/appointment.actions";
import { format } from "date-fns";
import Link from "next/link";
import { Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

export default async function HospitalAppointmentsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.hospitalId) {
        redirect("/hospital/login");
    }

    const appointments = await getAppointmentsByHospital(session.user.hospitalId);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">All Appointments</h1>
                <p className="text-muted-foreground">View all appointments across the hospital</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                        Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {appointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-muted-foreground">No appointments yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead className="hidden md:table-cell">Doctor</TableHead>
                                    <TableHead className="hidden sm:table-cell">Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden lg:table-cell">Symptoms</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((apt) => {
                                    const patient = typeof apt.patientId === 'object' ? apt.patientId : null;
                                    const doctor = typeof apt.doctorId === 'object' ? apt.doctorId : null;

                                    return (
                                        <TableRow key={apt._id}>
                                            <TableCell className="font-medium">
                                                {patient?.name || 'Unknown Patient'}
                                                <br />
                                                <span className="text-xs text-muted-foreground">
                                                    {patient?.email}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                Dr. {doctor?.name || 'Unknown'}
                                                <br />
                                                <span className="text-xs text-muted-foreground">
                                                    {doctor?.specialization}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {format(new Date(apt.date), 'MMM dd, yyyy')}
                                                <br />
                                                <span className="text-xs text-muted-foreground">
                                                    {apt.timeSlot}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusStyles[apt.status] || statusStyles.pending}>
                                                    {apt.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                                                {apt.symptoms || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {patient?._id && (
                                                    <Link href={`/hospital/patients/${patient._id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" /> View Patient
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
