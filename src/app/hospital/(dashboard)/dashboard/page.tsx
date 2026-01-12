
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Calendar, UserPlus, UserCheck, UserX } from "lucide-react";
import { doctors } from "@/lib/data";

export default function HospitalDashboardPage() {
    const totalDoctors = doctors.length;
    const availableDoctors = doctors.filter(d => d.status === 'approved').length;
    const doctorsOnLeave = doctors.filter(d => d.status === 'on-leave').length;
    const pendingApprovals = doctors.filter(d => d.status === 'pending').length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Hospital Dashboard</h1>
        <p className="text-muted-foreground">Manage your institution's operations.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-muted-foreground">{pendingApprovals} pending approval</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableDoctors}</div>
               <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors on Leave</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorsOnLeave}</div>
              <p className="text-xs text-muted-foreground">Currently on leave</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">482</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
            <CardContent className="p-6">
                <p className="text-muted-foreground">No recent activity to show.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
