import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, UserCheck, Settings } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getDoctorById } from "@/lib/actions/doctor.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DoctorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'doctor') {
    redirect("/doctor/login");
  }

  const doctor = await getDoctorById(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. {doctor?.name || session.user.name}!</p>
        </div>
        <Link href="/doctor/schedule">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Manage Schedule
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof doctor?.departmentId === 'object' ? doctor.departmentId.name : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">{doctor?.specialization || 'Specialist'}</p>
          </CardContent>
        </Card>
        <Link href="/doctor/appointments">
          <Card className="hover:bg-accent/10 transition-colors cursor-pointer border-dashed border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">View Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage</div>
              <p className="text-xs text-muted-foreground">Click to view and manage</p>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultation Fee</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{doctor?.consultationFee || 0}</div>
            <p className="text-xs text-muted-foreground">Per consultation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctor?.experience || 0} years</div>
            <p className="text-xs text-muted-foreground">Professional experience</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Your Schedule</h2>
        <Card>
          <CardContent className="p-6">
            {doctor?.schedule ? (
              <div className="grid gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const daySchedule = doctor.schedule?.[day as keyof typeof doctor.schedule] as { isAvailable: boolean; slots: string[] } | undefined;
                  const isAvailable = daySchedule?.isAvailable;
                  const slots = daySchedule?.slots || [];
                  return (
                    <div key={day} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="font-medium capitalize">{day}</span>
                      {isAvailable && slots.length > 0 ? (
                        <span className="text-sm text-muted-foreground">
                          {slots.slice(0, 4).join(', ')}{slots.length > 4 ? ` +${slots.length - 4} more` : ''}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No schedule configured yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
