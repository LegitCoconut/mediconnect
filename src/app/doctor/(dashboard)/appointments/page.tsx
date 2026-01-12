import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAppointmentsByDoctor } from "@/lib/actions/appointment.actions";
import { AppointmentActions } from "@/components/doctor/appointment-actions";
import { format } from "date-fns";

export default async function DoctorAppointmentsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'doctor') {
        redirect("/doctor/login");
    }

    const appointments = await getAppointmentsByDoctor(session.user.id);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">My Appointments</h1>
                <p className="text-muted-foreground">View and manage your appointments</p>
            </div>

            {appointments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <p className="text-muted-foreground">No appointments yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <Card key={apt.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {apt.patient?.name || 'Unknown Patient'}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {apt.patient?.email} • {apt.patient?.phone || 'No phone'}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(apt.status)}>
                                        {apt.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Date</span>
                                        <p className="font-medium">{format(new Date(apt.date), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Time</span>
                                        <p className="font-medium">{apt.timeSlot}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Symptoms</span>
                                        <p className="font-medium">{apt.symptoms || 'Not specified'}</p>
                                    </div>
                                </div>

                                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                    <AppointmentActions appointmentId={apt.id} status={apt.status} />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
