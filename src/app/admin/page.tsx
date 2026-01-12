import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Users, Stethoscope, Calendar, UserCheck, AlertTriangle } from "lucide-react";
import { getPlatformStats } from "@/lib/actions/admin.actions";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const stats = await getPlatformStats();

    const statCards = [
        {
            title: "Total Hospitals",
            value: stats.totalHospitals,
            icon: Hospital,
            description: `${stats.verifiedHospitals} verified`,
            color: "text-blue-500"
        },
        {
            title: "Total Patients",
            value: stats.totalPatients,
            icon: Users,
            description: "Registered patients",
            color: "text-green-500"
        },
        {
            title: "Total Doctors",
            value: stats.totalDoctors,
            icon: Stethoscope,
            description: "Active doctors",
            color: "text-purple-500"
        },
        {
            title: "Total Appointments",
            value: stats.totalAppointments,
            icon: Calendar,
            description: "All time",
            color: "text-orange-500"
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome to the MediConnect admin panel.</p>
            </div>

            {stats.pendingVerifications > 0 && (
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                    <CardContent className="flex items-center gap-4 p-4">
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        <div className="flex-1">
                            <p className="font-medium">Pending Approvals</p>
                            <p className="text-sm text-muted-foreground">
                                {stats.pendingVerifications} hospital{stats.pendingVerifications > 1 ? 's' : ''} awaiting verification
                            </p>
                        </div>
                        <Link
                            href="/admin/approvals"
                            className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-400"
                        >
                            Review Now
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Link
                            href="/admin/hospitals"
                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                        >
                            <Hospital className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="font-medium">Manage Hospitals</p>
                                <p className="text-sm text-muted-foreground">View, verify, and manage hospitals</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/patients"
                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                        >
                            <Users className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="font-medium">Manage Patients</p>
                                <p className="text-sm text-muted-foreground">View and manage patient accounts</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/approvals"
                            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
                        >
                            <UserCheck className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="font-medium">Pending Approvals</p>
                                <p className="text-sm text-muted-foreground">Review new registrations</p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Verified Hospitals</span>
                                <span className="font-medium">{stats.verifiedHospitals} / {stats.totalHospitals}</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: stats.totalHospitals > 0 ? `${(stats.verifiedHospitals / stats.totalHospitals) * 100}%` : '0%' }}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-muted-foreground">Active Doctors</span>
                                <span className="font-medium">{stats.totalDoctors}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Pending Verifications</span>
                                <span className="font-medium text-yellow-500">{stats.pendingVerifications}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
