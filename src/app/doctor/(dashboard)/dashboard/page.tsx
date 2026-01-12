
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, UserCheck } from "lucide-react";

export default function DoctorDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Smith!</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 remaining</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Patient</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11:30 AM</div>
               <p className="text-xs text-muted-foreground">John Doe</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,432</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="font-headline text-2xl font-bold mb-4">Upcoming Schedule</h2>
        <Card>
            <CardContent className="p-6">
                <p className="text-muted-foreground">Your schedule for the rest of the day is clear.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
