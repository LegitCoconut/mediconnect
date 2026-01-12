import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Calendar, Hospital, FileText } from "lucide-react";

const stats = [
  { title: "Total Appointments", value: "1,254", icon: Calendar, change: "+12%" },
  { title: "Active Doctors", value: "78", icon: Stethoscope, change: "+5" },
  { title: "Verified Hospitals", value: "12", icon: Hospital, change: "+2" },
  { title: "Prescriptions Issued", value: "5,782", icon: FileText, change: "+8%" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Here's your overview.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
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
